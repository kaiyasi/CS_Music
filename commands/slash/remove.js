const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
	.setName("remove")
	.setDescription("從隊列中移除你不想要的曲目")
	.addNumberOption((option) =>
		option
			.setName("number")
			.setDescription("輸入曲目編號。")
			.setRequired(true),
	)
	
	.setRun(async (client, interaction) => {
		const args = interaction.options.getNumber("number");
		
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
						.setDescription("沒有可移除的曲目。"),
				],
				ephemeral: true,
			});
		}
		
		await interaction.deferReply();
		
		const position = Number(args) - 1;
		if (position > player.queue.size) {
			let thing = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setDescription(
					`當前隊列只有 **${player.queue.size}** 首曲目`,
				);
			return interaction.editReply({ embeds: [thing] });
		}
		
		const song = player.queue[position];
		player.queue.remove(position);
		
		const number = position + 1;
		let removeEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setDescription(`已從隊列中移除第 **${number}** 首曲目`);
		return interaction.editReply({ embeds: [removeEmbed] });
	});

module.exports = command;
