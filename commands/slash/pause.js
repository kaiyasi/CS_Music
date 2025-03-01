const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
    .setName("pause")
    .setDescription("暫停目前播放的歌曲")
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
                        .setDescription("目前沒有正在播放的內容"),
                ],
                ephemeral: true,
            });
        }
        
        if (player.paused) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("目前已暫停播放"),
                ],
                ephemeral: true,
            });
        }

        player.pause(true);
        
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setDescription(`⏸ | 已暫停播放`),
            ],
        });
    });

module.exports = command;
