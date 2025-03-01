const { MessageEmbed, message } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");
const fs = require("fs");
const path = require("path");

const command = new SlashCommand()
	.setName("reload")
	.setDescription("重新載入所有指令")
	.setRun(async (client, interaction, options) => {
		if (interaction.user.id === client.config.adminId) {
			try {
				let ContextCommandsDirectory = path.join(__dirname, "..", "context");
				fs.readdir(ContextCommandsDirectory, (err, files) => {
					files.forEach((file) => {
						delete require.cache[
							require.resolve(ContextCommandsDirectory + "/" + file)
							];
						let cmd = require(ContextCommandsDirectory + "/" + file);
						if (!cmd.command || !cmd.run) {
							return this.warn(
								"❌ 無法載入指令：" +
								file.split(".")[0] +
								"，檔案缺少 command 或 run",
							);
						}
						client.contextCommands.set(file.split(".")[0].toLowerCase(), cmd);
					});
				});
				
				let SlashCommandsDirectory = path.join(__dirname, "..", "slash");
				fs.readdir(SlashCommandsDirectory, (err, files) => {
					files.forEach((file) => {
						delete require.cache[
							require.resolve(SlashCommandsDirectory + "/" + file)
							];
						let cmd = require(SlashCommandsDirectory + "/" + file);
						
						if (!cmd || !cmd.run) {
							return client.warn(
								"❌ 無法載入指令：" +
								file.split(".")[0] +
								"，檔案缺少有效的帶有 run 函數的指令",
							);
						}
						client.slashCommands.set(file.split(".")[0].toLowerCase(), cmd);
					});
				});
				
				const totalCmds =
					client.slashCommands.size + client.contextCommands.size;
				client.log(`已重新載入 ${ totalCmds } 個指令！`);
				return interaction.reply({
					embeds: [
						new MessageEmbed()
							.setColor(client.config.embedColor)
							.setDescription(`成功重新載入 \`${ totalCmds }\` 個指令！`)
							.setFooter({
								text: `${ client.user.username } 已被 ${ interaction.user.username } 重新載入`,
							})
							.setTimestamp(),
					],
					ephemeral: true,
				});
			} catch (err) {
				console.log(err);
				return interaction.reply({
					embeds: [
						new MessageEmbed()
							.setColor(client.config.embedColor)
							.setDescription(
								"發生錯誤。請查看控制台以獲取更多詳細信息。",
							),
					],
					ephemeral: true,
				});
			}
		} else {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(client.config.embedColor)
						.setDescription("您沒有權限使用此指令！"),
				],
				ephemeral: true,
			});
		}
	});

module.exports = command;
