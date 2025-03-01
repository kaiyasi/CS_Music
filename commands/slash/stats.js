const SlashCommand = require("../../lib/SlashCommand");
const moment = require("moment");
require("moment-duration-format");
const { MessageEmbed } = require("discord.js");
const os = require("os");

const command = new SlashCommand()
	.setName("stats")
	.setDescription("獲取機器人的相關資訊")
	.setRun(async (client, interaction) => {
		// 獲取操作系統資訊
		const osver = os.platform() + " " + os.release();
		
		// 獲取 Node.js 版本
		const nodeVersion = process.version;
		
		// 以易讀格式獲取運行時間
		const runtime = moment
			.duration(client.uptime)
			.format("d[ 天]・h[ 小時]・m[ 分鐘]・s[ 秒]");
		// 以易讀格式顯示 Lavalink 運行時間
		const lavauptime = moment
			.duration(client.manager.nodes.values().next().value.stats.uptime)
			.format(" D[天], H[小時], m[分鐘]");
		// 以易讀格式顯示 Lavalink 記憶體使用量
		const lavaram = (
			client.manager.nodes.values().next().value.stats.memory.used /
			1024 /
			1024
		).toFixed(2);
		// 以易讀格式顯示 Lavalink 已分配記憶體
		const lavamemalocated = (
			client.manager.nodes.values().next().value.stats.memory.allocated /
			1024 /
			1024
		).toFixed(2);
		// 顯示系統運行時間
		var sysuptime = moment
			.duration(os.uptime() * 1000)
			.format("d[ 天]・h[ 小時]・m[ 分鐘]・s[ 秒]");
		
		// 獲取 Git 提交哈希和日期
		let gitHash = "未知";
		try {
			gitHash = require("child_process")
				.execSync("git rev-parse HEAD")
				.toString()
				.trim();
		} catch (e) {
			// 不做任何處理
			gitHash = "未知";
		}
		
		const statsEmbed = new MessageEmbed()
			.setTitle(`${client.user.username} 資訊`)
			.setColor(client.config.embedColor)
			.setDescription(
				`\`\`\`yml\n名稱: ${client.user.username}#${client.user.discriminator} [${client.user.id}]\nAPI: ${client.ws.ping}ms\n運行時間: ${runtime}\`\`\``,
			)
			.setFields([
				{
					name: `Lavalink 統計`,
					value: `\`\`\`yml\n運行時間: ${lavauptime}\n記憶體: ${lavaram} MB\n播放中: ${
						client.manager.nodes.values().next().value.stats.playingPlayers
					} / ${
						client.manager.nodes.values().next().value.stats.players
					}\`\`\``,
					inline: true,
				},
				{
					name: "機器人統計",
					value: `\`\`\`yml\n伺服器數: ${
						client.guilds.cache.size
					} \nNode.js: ${nodeVersion}\nDiscordMusicBot: v${
						require("../../package.json").version
					} \`\`\``,
					inline: true,
				},
				{
					name: "系統統計",
					value: `\`\`\`yml\n作業系統: ${osver}\n運行時間: ${sysuptime}\n\`\`\``,
					inline: false,
				},
			])
			.setFooter({ text: `版本: ${gitHash}` });
		return interaction.reply({ embeds: [statsEmbed], ephemeral: false });
	});

module.exports = command;