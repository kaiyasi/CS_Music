const { MessageEmbed, message } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");
const fs = require("fs");
const path = require("path");
const { forEach } = require("lodash");

const command = new SlashCommand()
    .setName("guildleave")
    .setDescription("離開指定的伺服器")
    .addStringOption((option) =>
        option
            .setName("id")
            .setDescription("輸入要離開的伺服器 ID（輸入 `list` 查看伺服器列表）")
            .setRequired(true)
    )
    .setRun(async (client, interaction, options) => {
        if (interaction.user.id === client.config.adminId) {
            try {
                const id = interaction.options.getString('id');

                if (id.toLowerCase() === 'list') {
                    client.guilds.cache.forEach((guild) => {
                        console.log(`${guild.name} | ${guild.id}`);
                    });
                    const guild = client.guilds.cache.map(guild => ` ${guild.name} | ${guild.id}`);
                    try {
                        return interaction.reply({ content: `伺服器列表:\n\`${guild}\``, ephemeral: true });
                    } catch {
                        return interaction.reply({ content: `請查看控制台以獲取伺服器列表`, ephemeral: true });
                    }
                }

                const guild = client.guilds.cache.get(id);

                if (!guild) {
                    return interaction.reply({ content: `\`${id}\` 不是有效的伺服器 ID`, ephemeral: true });
                }

                await guild.leave();
                return interaction.reply({ content: `成功離開伺服器 \`${guild.name}\``, ephemeral: true });
            } catch (e) {
                return interaction.reply({ content: `發生錯誤：${e.message}`, ephemeral: true });
            }
        } else {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("⛔ | 此命令僅供系統管理員使用！")
                ],
                ephemeral: true
            });
        }
    });

module.exports = command;