const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
const pms = require("pretty-ms");

const command = new SlashCommand()
.setName("queue")
.setDescription("顯示目前播放隊列")
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
                    .setDescription("隊列中沒有歌曲"),
            ],
            ephemeral: true,
        });
    }

    if (!player.queue || !player.queue.length || player.queue.length === 0) {
        let embed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setDescription("隊列中沒有歌曲");
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    let 隊列總時長 = player.queue.reduce((prev, curr) => prev + curr.duration, 0);
    let 目前歌曲 = player.queue.current;
    let 歌曲時長 = 目前歌曲.duration;
    let 目前播放位置 = player.position;

    let embed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle("播放隊列")
        .setDescription(
            `**正在播放:** [${目前歌曲.title}](${目前歌曲.uri}) \`[${pms(歌曲時長)}]\`\n\n` +
            `**隊列:**\n${player.queue.map((track, index) => 
                `\`${index + 1}.\` [${track.title}](${track.uri}) \`[${pms(track.duration)}]\``
            ).join("\n")}`
        )
        .setFooter({ text: `總時長: ${pms(隊列總時長)}` });

    return interaction.reply({ embeds: [embed] });
});

module.exports = command;
