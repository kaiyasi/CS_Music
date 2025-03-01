const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const fetch = require("node-fetch");
const lyricsApi = require("../../util/lyricsApi"); 

const command = new SlashCommand()
    .setName("lyrics")
    .setDescription("顯示目前播放歌曲的歌詞")
    .addStringOption((option) =>
        option
            .setName("歌曲名稱")
            .setDescription("要搜尋歌詞的歌曲名稱")
            .setRequired(false)
    )
    .setRun(async (client, interaction) => {
        await interaction.deferReply();
        let player = client.manager.players.get(interaction.guild.id);

        if (!player && !interaction.options.getString("歌曲名稱")) {
            return interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("目前沒有正在播放的內容"),
                ],
            });
        }

        let songTitle = interaction.options.getString("歌曲名稱");
        if (!songTitle && player) songTitle = player.queue.current.title;

        let lyricsData = [];
        try {
            lyricsData = await lyricsApi.search(songTitle);
        } catch (e) {
            client.error(e);
            return interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription(`❌ | 找不到歌詞\n${e.message}`),
                ],
            });
        }

        if (!lyricsData || !lyricsData.length) {
            return interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("❌ | 找不到歌詞"),
                ],
            });
        }

        const selectMenuArray = [];
        lyricsData.forEach((track, index) => {
            selectMenuArray.push({
                label: track.artist,
                description: track.name,
                value: index.toString(),
            });
        });

        const selectMenuRow = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId("select")
                .setPlaceholder("選擇一首歌曲")
                .addOptions(selectMenuArray)
        );

        let selectedLyrics = await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setDescription(
                        `請選擇要顯示歌詞的歌曲:`,
                    ),
            ],
            components: [selectMenuRow],
        });

        const filter = (button) => button.user.id === interaction.user.id;

        const collector = selectedLyrics.createMessageComponentCollector({
            filter,
            time: 30000,
        });

        collector.on("collect", async (interaction) => {
            if (interaction.isSelectMenu()) {
                await interaction.deferUpdate();
                const url = lyricsData[parseInt(interaction.values[0])].url;

                lyricsApi.find(url).then((lyrics) => {
                    let lyricsText = lyrics.lyrics;

                    const button = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('tipsbutton')
                                .setLabel('提示')
                                .setEmoji(`📌`)
                                .setStyle('SECONDARY'),
                            new MessageButton()
                                .setLabel('來源')
                                .setURL(url)
                                .setStyle('LINK'),
                        );

                    const musixmatch_icon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Musixmatch_logo_icon_only.svg/480px-Musixmatch_logo_icon_only.svg.png';
                    let lyricsEmbed = new MessageEmbed()
                        .setColor(client.config.embedColor)
                        .setTitle(`${lyrics.name}`)
                        .setURL(url)
                        .setThumbnail(lyrics.icon)
                        .setFooter({
                            text: '歌詞由 MusixMatch 提供',
                            iconURL: musixmatch_icon
                        })
                        .setDescription(lyricsText);

                    interaction.editReply({
                        embeds: [lyricsEmbed],
                        components: [button],
                    });
                });
            }
        });

        collector.on("end", (collected) => {
            if (collected.size === 0) {
                selectedLyrics.edit({
                    content: "❌ | 選擇時間已過期",
                    embeds: [],
                    components: [],
                });
            }
        });
    });

module.exports = command;
