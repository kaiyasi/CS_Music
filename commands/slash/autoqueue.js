const colors = require("colors");
const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
    .setName("autoqueue")
    .setDescription("自動將歌曲添加到隊列（切換）")
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
                        .setDescription("隊列中沒有正在播放的內容"),
                ],
                ephemeral: true,
            });
        }
        
        let autoQueueEmbed = new MessageEmbed().setColor(client.config.embedColor);
        const autoQueue = player.get("autoQueue");
        player.set("requester", interaction.guild.members.me);

        if (!autoQueue || autoQueue === false) {
            player.set("autoQueue", true);
        } else {
            player.set("autoQueue", false);
        }
        autoQueueEmbed
            .setDescription(`**自動隊列模式已** \`${!autoQueue ? "開啟" : "關閉"}\``)
            .setFooter({
                text: `機器人將${!autoQueue ? "現在" : "不再"}自動將歌曲添加到隊列。`
            });
        client.warn(
            `播放器: ${player.options.guild} | [${colors.blue(
                "自動隊列",
            )}] 已被 [${colors.blue(
                !autoQueue ? "啟用" : "禁用",
            )}] 在 ${
                client.guilds.cache.get(player.options.guild)
                    ? client.guilds.cache.get(player.options.guild).name
                    : "一個伺服器"
            }`,
        );

        return interaction.reply({ embeds: [autoQueueEmbed] });
    });

module.exports = command;
