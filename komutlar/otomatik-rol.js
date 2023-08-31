const Discord = require('discord.js')
const db = require("croxydb")

exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
   .setColor("YELLOW")
    const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
    if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek için \`Yönetici\` iznine sahip olmalısın!**`)] }).catch(e => { })

    if (args[0] === "ayarla") {
        const data = db.get(`autorole_${message.guild.id}`)
        if (data) {
            return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Otomatik yeni katılan üyelere rol verme sistemi zaten ayarlı!**`)] }).catch(e => { })
        }

        let channel = message.mentions.channels.first()
        if (!channel) {
            return message.channel.send({ embeds: [embed.setDescription('<:cross:980410756484956210>  **Bir log kanalı belirt!**\nKullanım: `' + prefix + 'oto-rol ayarla #kanal @rol`')] }).catch(e => { })
        }

        let role = message.mentions.roles.first()
        if (!role) {
            return message.channel.send({ embeds: [embed.setDescription('<:cross:980410756484956210>  **Bir rol belirt!**\nKullanım: `' + prefix + 'oto-rol ayarla #kanal @rol`')] }).catch(e => { })
        }

        await db.set(`autorole_${message.guild.id}`, {
            log: channel,
            role: role
        })
        message.channel.send({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Otomatik yeni katılan üyelere rol verme kanalı ${channel} olarak ayarlandı, verilecek rol ${role} olarak ayarlandı!**`)] }).catch(e => { })

    } else {

        if (args[0] === "sıfırla") {
            const data = db.get(`autorole_${message.guild.id}`)
            if (!data) {
                return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Otomatik yeni katılan üyelere rol verme sistemi zaten ayarlı değil!**`)] }).catch(e => { })
            }

            message.channel.send({ embeds: [embed.setDescription('<:correct:980410756187185172>  **Otorol sistemi sıfırlandı!**')] }).catch(e => { })
            await db.delete('autorole_' + message.guild.id)

        } else {
            return message.reply({ embeds: [embed.setDescription("`" + prefix + "oto-rol ayarla #kanal @rol` veya `" + prefix + "oto-rol sıfırla` **yazmalısın!**")] }).catch(e => { })
        }
    }
}

exports.conf = {
    aliases: ["otorol", "auto-rol", "auto-role", "otomatikrol", "otomatik-rol"]
}

exports.help = {
    name: 'oto-rol',
    description: 'Sunucuya Katılan Üyelere Otomatik Rol Verir.',
    usage: 'oto-rol ayarla #kanal @rol',
    category: "moderasyon"
}
