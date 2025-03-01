const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");

const command = new SlashCommand()
	.setName("seek")
	.setDescription("跳轉到當前歌曲的特定時間點。")
	.addStringOption((option) =>
		option
			.setName("time")
			.setDescription("你想跳轉到的時間點。例如：1h 30m | 2h | 80m | 53s")
			.setRequired(true),
	)
	.setRun(async (client, interaction, options) => {
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
		
		await interaction.deferReply();

		const rawArgs = interaction.options.getString("time");
		const args = rawArgs.split(' ');
		var rawTime = [];
		for (i = 0; i < args.length; i++){
			rawTime.push(ms(args[i]));
		}
		const time = rawTime.reduce((a,b) => a + b, 0);
		const position = player.position;
		const duration = player.queue.current.duration;
		
		if (time <= duration) {
			player.seek(time);
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(client.config.embedColor)
						.setDescription(
							`⏩ | **${player.queue.current.title}** 已被${
								time < position ? "倒轉" : "跳轉"
							}到 **${ms(time)}**`,
						),
				],
			});
		} else {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor(client.config.embedColor)
						.setDescription(
							`無法跳轉當前播放的曲目。這可能是因為超出了曲目時長或時間格式不正確。請檢查後再試一次。`,
						),
				],
			});
		}
	});

module.exports = command;