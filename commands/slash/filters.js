const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
	.setName("filters")
	.setDescription("新增或移除音效濾鏡")
	.addStringOption((option) =>
		option
			.setName("preset")
			.setDescription("要新增的預設音效")
			.setRequired(true)
			.addChoices(
				{ name: "夜核", value: "nightcore" },
				{ name: "重低音", value: "bassboost" },
				{ name: "蒸氣波", value: "vaporwave" },
				{ name: "流行", value: "pop" },
				{ name: "柔和", value: "soft" },
				{ name: "高低音", value: "treblebass" },
				{ name: "八維立體聲", value: "eightD" },
				{ name: "卡拉OK", value: "karaoke" },
				{ name: "震音", value: "vibrato" },
				{ name: "顫音", value: "tremolo" },
				{ name: "重置", value: "off" },
			),
	)
	
	.setRun(async (client, interaction, options) => {
		const args = interaction.options.getString("preset");
		
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
		
		// 創建一個新的嵌入訊息
		let filtersEmbed = new MessageEmbed().setColor(client.config.embedColor);
		
		if (args == "nightcore") {
			filtersEmbed.setDescription("✅ | 夜核音效已啟用！");
			player.nightcore = true;
		} else if (args == "bassboost") {
			filtersEmbed.setDescription("✅ | 重低音音效已開啟！");
			player.bassboost = true;
		} else if (args == "vaporwave") {
			filtersEmbed.setDescription("✅ | 蒸氣波音效已開啟！");
			player.vaporwave = true;
		} else if (args == "pop") {
			filtersEmbed.setDescription("✅ | 流行音效已開啟！");
			player.pop = true;
		} else if (args == "soft") {
			filtersEmbed.setDescription("✅ | 柔和音效已開啟！");
			player.soft = true;
		} else if (args == "treblebass") {
			filtersEmbed.setDescription("✅ | 高低音音效已開啟！");
			player.treblebass = true;
		} else if (args == "eightD") {
			filtersEmbed.setDescription("✅ | 八維立體聲音效已開啟！");
			player.eightD = true;
		} else if (args == "karaoke") {
			filtersEmbed.setDescription("✅ | 卡拉OK音效已開啟！");
			player.karaoke = true;
		} else if (args == "vibrato") {
			filtersEmbed.setDescription("✅ | 震音音效已開啟！");
			player.vibrato = true;
		} else if (args == "tremolo") {
			filtersEmbed.setDescription("✅ | 顫音音效已開啟！");
			player.tremolo = true;
		} else if (args == "off") {
			filtersEmbed.setDescription("✅ | 均衡器已重置！");
			player.reset();
		} else {
			filtersEmbed.setDescription("❌ | 無效的音效濾鏡！");
		}
		
		return interaction.reply({ embeds: [filtersEmbed] });
	});

module.exports = command;
