const { MessageEmbed } = require("discord.js");
const escapeMarkdown = require('discord.js').Util.escapeMarkdown;
const SlashCommand = require("../../lib/SlashCommand");
const prettyMilliseconds = require("pretty-ms");

const command = new SlashCommand()
    .setName("nowplaying")
    .setDescription("顯示目前在語音頻道中播放的歌曲")
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
                        .setDescription("機器人未在任何頻道中"),
                ],
                ephemeral: true,
            });
        }
        
        if (!player.playing) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("目前沒有正在播放的內容"),
                ],
                ephemeral: true,
            });
        }
        
        const song = player.queue.current;
        const embed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle("正在播放")
            .setDescription(`[${escapeMarkdown(song.title)}](${song.uri})`)
            .addFields(
                {
                    name: "歌曲長度",
                    value: song.isStream
                        ? `\`🔴 直播\``
                        : `\`${prettyMilliseconds(song.duration, {
                            colonNotation: true,
                        })}\``,
                    inline: true,
                },
                {
                    name: "歌曲作者",
                    value: `\`${song.author}\``,
                    inline: true,
                },
                {
                    name: "播放進度",
                    value: player.position > 0
                        ? `\`${prettyMilliseconds(player.position, {
                            colonNotation: true,
                        })}\``
                        : `\`🔴 直播\``,
                    inline: true,
                }
            );
        
        return interaction.reply({ embeds: [embed] });
    });

module.exports = command;
