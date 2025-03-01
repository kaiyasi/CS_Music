const colors = require("colors");
const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
    .setName("247")
    .setDescription("防止機器人從語音頻道斷開連接（切換）")
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
                        .setDescription("沒有任何內容可以 24/7 播放。"),
                ],
                ephemeral: true,
            });
        }
        
        let twentyFourSevenEmbed = new MessageEmbed().setColor(
            client.config.embedColor
        );
        const twentyFourSeven = player.get("twentyFourSeven");
        
        if (!twentyFourSeven || twentyFourSeven === false) {
            player.set("twentyFourSeven", true);
        } else {
            player.set("twentyFourSeven", false);
        }
        twentyFourSevenEmbed
          .setDescription(`**24/7 模式已** \`${!twentyFourSeven ? "開啟" : "關閉"}\``)
          .setFooter({
            text: `機器人將${!twentyFourSeven ? "現在" : "不再"} 24/7 保持連接到語音頻道。`
      });
        client.warn(
            `播放器: ${ player.options.guild } | [${ colors.blue(
                "24/7",
            ) }] 已被 [${ colors.blue(
                !twentyFourSeven? "啟用" : "禁用",
            ) }] 在 ${
                client.guilds.cache.get(player.options.guild)
                    ? client.guilds.cache.get(player.options.guild).name
                    : "一個伺服器"
            }`,
        );
        
        if (!player.playing && player.queue.totalSize === 0 && twentyFourSeven) {
            player.destroy();
        }
        
        return interaction.reply({ embeds: [twentyFourSevenEmbed] });
    });

module.exports = command;
// 檢查上面的訊息，有點令人困惑。錯誤沒有處理。可能應該修復。
// 好的，使用 catch 簡單，跟著我 ;_;
// 上面的訊息意味著錯誤，如果找不到或花費太長時間，機器人會崩潰
// 播放命令，如果超時或需要 1000 年找到歌曲會崩潰
// 好的，將評論留在這裡，不知道為什麼
// 評論非常有用，247 很好 :+1:
