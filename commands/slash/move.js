const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
    .setName("move")
    .setDescription("將歌曲移動到不同位置")
    .addIntegerOption((option) =>
        option
            .setName("歌曲編號")
            .setDescription("要移動的歌曲編號")
            .setRequired(true),
    )
    .addIntegerOption((option) =>
        option
            .setName("目標位置")
            .setDescription("要移動到的位置")
            .setRequired(true),
    )
    
    .setRun(async (client, interaction) => {
        const track = interaction.options.getInteger("歌曲編號");
        const position = interaction.options.getInteger("目標位置");
        
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
            });
        }
        
        if (track < 1 || position < 1) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("無效的歌曲編號或位置"),
                ],
            });
        }

        if (track > player.queue.length || position > player.queue.length) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("無效的歌曲編號或位置"),
                ],
            });
        }

        const targetTrack = player.queue[track - 1];
        player.queue.splice(track - 1, 1);
        player.queue.splice(position - 1, 0, targetTrack);

        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setDescription(`✅ | 已將歌曲 **${track}** 移動到位置 **${position}**`),
            ],
        });
    });

module.exports = command;
