const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
    .setName("clear")
    .setDescription("清空播放隊列中的所有歌曲")
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
        
        if (!player.queue || !player.queue.length || player.queue.length === 0) {
            let cembed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription("播放隊列已經是空的");
            return interaction.reply({
                embeds: [cembed],
                ephemeral: true,
            });
        }
        
        player.queue.clear();
        
        let clearEmbed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setDescription(`✅ | 播放隊列已清空！`);
        
        return interaction.reply({ embeds: [clearEmbed] });
    });

module.exports = command;