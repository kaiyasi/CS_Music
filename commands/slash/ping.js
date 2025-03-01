const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    description: "顯示機器人的延遲資訊",
    run: async (client, interaction) => {
        let msg = await interaction.channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription("檢查中...")
                    .setColor("#FFD700")
            ]
        });

        let green = "🟢";
        let red = "🔴";
        let yellow = "🟡";

        var 機器人狀態 = green;
        var API狀態 = green;

        let API延遲 = client.ws.ping;
        let 機器人延遲 = Math.floor(msg.createdAt - interaction.createdAt);

        if (API延遲 >= 40 && API延遲 < 200) {
            API狀態 = green;
        } else if (API延遲 >= 200 && API延遲 < 400) {
            API狀態 = yellow;
        } else if (API延遲 >= 400) {
            API狀態 = red;
        }

        if (機器人延遲 >= 40 && 機器人延遲 < 200) {
            機器人狀態 = green;
        } else if (機器人延遲 >= 200 && 機器人延遲 < 400) {
            機器人狀態 = yellow;
        } else if (機器人延遲 >= 400) {
            機器人狀態 = red;
        }

        msg.delete();
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("🏓 | Pong!")
                    .addFields(
                        {
                            name: "API 延遲",
                            value: `\`\`\`yml\n${API狀態} | ${API延遲}ms\`\`\``,
                            inline: true,
                        },
                        {
                            name: "機器人延遲", 
                            value: `\`\`\`yml\n${機器人狀態} | ${機器人延遲}ms\`\`\``,
                            inline: true,
                        }
                    )
                    .setColor("#FFD700")
                    .setFooter({ text: `由 ${interaction.member.user.tag} 請求` })
            ]
        });
    },
};
