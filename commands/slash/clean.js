const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
    .setName("clean")
    .setDescription("清理頻道中最後 100 條機器人訊息")
    .addIntegerOption((option) =>
        option
            .setName("數量")
            .setDescription("要刪除的訊息數量")
            .setMinValue(2).setMaxValue(100)
            .setRequired(false),
    )
    .setRun(async (client, interaction, options) => {
        
        await interaction.deferReply();
        let number = interaction.options.getInteger("數量");
        number = number && number < 100? ++number : 100;
        
        interaction.channel.messages.fetch({
            limit: number,
        }).then((messages) => {
            const botMessages = [];
            messages.filter(m => m.author.id === client.user.id).forEach(msg => botMessages.push(msg))
            
            botMessages.shift();
            interaction.channel.bulkDelete(botMessages, true)
                .then(async deletedMessages => {
                    // 過濾未被刪除的訊息
                    messages = messages.filter(msg => {
                        !deletedMessages.some(deletedMsg => deletedMsg == msg);
                    });
                    if (messages.size > 0) {
                        client.log(`正在刪除 [${messages.size}] 條超過 14 天的訊息`)
                        for (const msg of messages) {
                            await msg.delete();
                        }
                    }
                    
                    return interaction.editReply({
                        content: `✅ | 已刪除 ${deletedMessages.size} 條機器人訊息！`,
                    }).catch(err => {
                        client.error(err);
                    });
                })
        }).catch((e) => {
            client.error(e);
            return interaction.editReply({
                content: "❌ | 刪除訊息時發生錯誤！",
            });
        });
    });

module.exports = command;
