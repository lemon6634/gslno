const Discord = require('discord.js')
const db = require("orio.db")

exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
    const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
    if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek için \`Yönetici\` iznine sahip olmalısın!**`)] }).catch(e => { })

    if (args[0] === "ayarla-kanal") {
        await db.set('küfürkanal_' + message.guild.id + message.channel.id, "Online")
        message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Küfür engelleme sistemi <#${message.channel.id}> kanalında açıldı! **`)] }).catch(e => { })

    } else {
        if (args[0] === "ayarla-sunucu") {
            await db.set('küfür_' + message.guild.id, "Online")
            message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Küfür engelleme sistemi tüm kanallarda açıldı! **`)] }).catch(e => { })
        } else {
            if (args[0] === "sıfırla-kanal") {
                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Küfür engelleme sistemi <#${message.channel.id}> kanalında kapatıldı!**`)] }).catch(e => { })
                await db.delete('küfürkanal_' + message.guild.id + message.channel.id)

            } else {
                if (args[0] === "sıfırla-sunucu") {
                    message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Küfür engelleme sistemi tüm kanallarda kapatıldı! **`)] }).catch(e => { })
                    await db.delete('küfür_' + message.guild.id)

                } else {
                    const tntmmesj = new Discord.MessageEmbed()
                        .setColor('YELLOW')
                        .setTitle("<:cross:980410756484956210>  Bir ayar belirtmelisin!")
                        .setDescription(`Bilgi: **?küfür-engel ayarla-kanal** komutu, komutu kullandığınız kanalda sistemi aktif eder.`)
                        .addFields(
                            { name: "**⚡️Peki Nasıl Ayarlarım?**", value: "`?küfür-engel ayarla-kanal\n?küfür-engel ayarla-sunucu`", inline: true },
                            { name: "**⚡️Peki Nasıl Kapatacağım?**", value: "`?küfür-engel sıfırla-kanal\n?küfür-engel sıfırla-sunucu`", inline: true }
                        )
                    return message.reply({ embeds: [tntmmesj] })
                }
            }
        }
    }
}

exports.conf = {
    aliases: ["küfürengel", "kufurengel", "kufur-engel"]
}

exports.help = {
    name: 'küfür-engel',
    description: 'Sunucuda Küfür Edilince Silinmesini Ayarlar.',
    usage: 'küfür-engel ayarla',
    category: 'moderasyon'
}
