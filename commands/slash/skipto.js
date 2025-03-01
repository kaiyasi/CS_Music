const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
	.setName("skipto")
	.setDescription("跳到佇列中的特定歌曲")
	.addNumberOption((option) =>
		option
			.setName("number")
			.setDescription("要跳到的曲目編號")
			.setRequired(true),
	)
	
	.setRun(async (client, interaction, options) => {
		const args = interaction.options.getNumber("number");
		//const duration = player.queue.current.duration
		
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
						.setDescription("我不在任何頻道中。"),
				],
				ephemeral: true,
			});
		}
		
		await interaction.deferReply();
		
		const position = Number(args);
		
		try {
			if (!position || position < 0 || position > player.queue.size) {
				let thing = new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("❌ | 無效的位置！");
				return interaction.editReply({ embeds: [thing] });
			}
			
			player.queue.remove(0, position - 1);
			player.stop();
			
			let thing = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setDescription("✅ | 已跳到第 " + position + " 首歌曲");
			
			return interaction.editReply({ embeds: [thing] });
		} catch {
			if (position === 1) {
				player.stop();
			}
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(client.config.embedColor)
						.setDescription("✅ | 已跳到第 " + position + " 首歌曲"),
				],
			});
		}
	});

module.exports = command;