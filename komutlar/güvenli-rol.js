const { MessageEmbed } = require("discord.js");
const Database = require("croxydb");

exports.run = async (client, message, args) => {
    const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
    const embed = new MessageEmbed()
        .setColor("YELLOW")
        
    if (message.author.id !== message.guild.ownerId) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Yetersiz izin, sistemi sadece \`SUNUCU SAHIBI\` kullanabilir.**`)] })

    const safeRole = await Database.get(`safeRole.${message.guild.id}`);

    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

    if (args[0] === "sıfırla") {

        if (safeRole) {
            await Database.delete(`safeRole.${message.guild.id}`)

            message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Başarıyla güvenli rol sıfırlandı.**`)] })
        } else {
            message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Güvenli rol zaten ayarlanmamış.** \n\nAyarlamak İçin: ${prefix}güvenli-rol @rol`)] })
        }

        return;
    }

    if (safeRole) {
        message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Güvenli rol zaten ayarlanmış.** \n\nSıfırlamak İçin: ${prefix}güvenli-rol sıfırla`)] })
    } else {
        if (!role) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Güvenli rolünü ayarlamak için bir rol etiketlemen gerekiyor.**`)] })

        await Database.set(`safeRole.${message.guild.id}`, role.id)

        message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Başarıyla güvenli rol ${role} olarak ayarlandı.**`)] })
    }
}

exports.conf = {
    aliases: ["güvenlirol"]
}

exports.help = {
    name: 'güvenli-rol',
    description: 'Koruma sistemlerinden etkilenmeyen rolü ayarlar.',
    usage: 'güvenli-rol',
    category: 'koruma'
}
