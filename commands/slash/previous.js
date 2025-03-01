const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
.setName("previous")
.setDescription("返回播放上一首歌曲")
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
                    .setDescription("本次播放階段沒有之前播放的歌曲"),
            ],
            ephemeral: true,
        });
    }

    const 上一首歌 = player.queue.previous;
    const 目前歌曲 = player.queue.current;

    if (!上一首歌) {
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("沒有之前播放的歌曲"),
            ],
            ephemeral: true,
        });
    }

    if (!目前歌曲) {
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("目前沒有正在播放的歌曲"),
            ],
            ephemeral: true,
        });
    }

    player.queue.unshift(目前歌曲);
    player.play(上一首歌);

    interaction.reply({
        embeds: [
            new MessageEmbed()
                .setColor("BLUE")
                .setDescription(`⏮ | 返回播放: **${上一首歌.title}**`),
        ],
    });
});

module.exports = command;
