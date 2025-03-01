const colors = require("colors");
const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("autoleave")
  .setDescription("當所有人離開語音頻道時自動離開（切換）")
  .setRun(async (client, interaction) => {
    let channel = await client.getChannel(client, interaction);
    if (!channel) return;

    let player;
    if (client.manager)
      player = client.manager.players.get(interaction.guild.id);
    else
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("Lavalink 節點未連接"),
        ],
      });

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

    let autoLeaveEmbed = new MessageEmbed().setColor(client.config.embedColor);
    const autoLeave = player.get("autoLeave");
    player.set("requester", interaction.guild.me);

    if (!autoLeave || autoLeave === false) {
      player.set("autoLeave", true);
    } else {
      player.set("autoLeave", false);
    }
    autoLeaveEmbed
      .setDescription(`**自動離開模式已** \`${!autoLeave ? "開啟" : "關閉"}\``)
      .setFooter({
        text: `機器人將${!autoLeave ? "現在" : "不再"}在所有人離開語音頻道時自動離開。`
      });
    client.warn(
      `播放器: ${player.options.guild} | [${colors.blue(
        "自動離開",
      )}] 已被 [${colors.blue(
        !autoLeave ? "啟用" : "禁用",
      )}] 在 ${
        client.guilds.cache.get(player.options.guild)
          ? client.guilds.cache.get(player.options.guild).name
          : "一個伺服器"
      }`,
    );

    return interaction.reply({ embeds: [autoLeaveEmbed] });
  });

module.exports = command;