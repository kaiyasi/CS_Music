const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
    .setName("loopq")
    .setDescription("循環播放目前的歌曲隊列")
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
        
        if (player.setQueueRepeat(!player.queueRepeat)) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.config.embedColor)
                        .setDescription(`🔄 | **隊列循環模式已開啟**`),
                ],
            });
        } else {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.config.embedColor)
                        .setDescription(`🔄 | **隊列循環模式已關閉**`),
                ],
            });
        }
    });

module.exports = command;
