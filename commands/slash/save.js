const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

const command = new SlashCommand()
	.setName("save")
	.setDescription("將當前歌曲保存到你的私人訊息")
	.setRun(async (client, interaction) => {
		let channel = await client.getChannel(client, interaction);
		if (!channel) {
			return;
		}
		
		let player;
		if (client.manager) {
			player = client.manager.players.get(interaction.guild.id);
		} else {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("Lavalink 節點未連接"),
				],
			});
		}
		
		if (!player) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("目前沒有正在播放的音樂。"),
				],
				ephemeral: true,
			});
		}
		
		const sendtoDmEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setAuthor({
				name: "已保存的曲目",
				iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}`,
			})
			.setDescription(
				`**已將 [${player.queue.current.title}](${player.queue.current.uri}) 保存到你的私人訊息**`,
			)
			.addFields(
				{
					name: "曲目時長",
					value: `\`${prettyMilliseconds(player.queue.current.duration, {
						colonNotation: true,
					})}\``,
					inline: true,
				},
				{
					name: "曲目作者",
					value: `\`${player.queue.current.author}\``,
					inline: true,
				},
				{
					name: "請求的伺服器",
					value: `\`${interaction.guild}\``,
					inline: true,
				},
			);
		
		interaction.user.send({ embeds: [sendtoDmEmbed] });
		
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription(
						"請查看你的**私人訊息**。如果你沒有收到我的訊息，請確保你的**私人訊息**設置是開放的",
					),
			],
			ephemeral: true,
		});
	});

module.exports = command;