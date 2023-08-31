const Discord = require('discord.js')
const db = require("croxydb")

exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
   .setColor("YELLOW")
    const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
    if (!message.member.permissions.has("ADMINISTRATOR")){
        const ytkmsj = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`<:cross:980410756484956210>  Bu komutu kullanabilmek için **Yönetici** iznine sahip olmalısın!`)
        return message.reply({ embeds: [ytkmsj] })
    }
            
            if (args[0] === "ayarla") {
                const data = db.get(`rgiris_${message.guild.id}`)
                if (data) {
                    const ztnayarli = new Discord.MessageEmbed()
                        .setColor('YELLOW')
                        .setDescription(`<:cross:980410756484956210>  **Resimli giriş çıkış sistemi zaten ayarlı!**`)
                    return message.reply({ embeds: [ztnayarli] })
                }

                let channel = message.mentions.channels.first()
                if (!channel) {
                    const kullanim = new Discord.MessageEmbed()
                        .setColor('YELLOW')
                        .setDescription('<:cross:980410756484956210>  Kullanım: `' + prefix + 'resimli-hgbb ayarla #kanal`')
                    return message.reply({ embeds: [kullanim] })
                }

                await db.set('rgiris_' + message.guild.id, channel.id); {
                    const knlbasari = new Discord.MessageEmbed()
                        .setColor('YELLOW')
                        .setDescription(`<:correct:980410756187185172>  **Resimli giriş-çıkış kanalı ${channel} olarak ayarlandı!**`)
                    return message.reply({ embeds: [knlbasari] })
                }


            } else {

                if (args[0] === "sıfırla") {
                    const data = db.get(`rgiris_${message.guild.id}`)
                    if (!data) {
                        const ayarlidegil = new Discord.MessageEmbed()
                            .setColor('YELLOW')
                            .setDescription(`<:cross:980410756484956210>  **Resimli giriş çıkış sistemi zaten ayarlı değil!**`)
                        return message.reply({ embeds: [ayarlidegil] })
                    }

                    await db.delete('rgiris_' + message.guild.id); {
                        const sifirlandi = new Discord.MessageEmbed()
                            .setColor('YELLOW')
                            .setDescription('<:correct:980410756187185172>  **Resimli giriş-çıkış kanalı sıfırlandı!**')
                        return message.reply({ embeds: [sifirlandi] })
                    }

                } else {
                    const ryardimi = new Discord.MessageEmbed()
                        .setColor('YELLOW')
                        .setTitle("_RESİMLİ GİRİŞ-ÇIKIŞ SİSTEMİ_")
                        .addFields(
                            //{ name: '\u200B', value: '\u200B' },
                            { name: '**⚡️Peki Nasıl Ayarlarım?**', value: "`" + prefix + "resimli-hgbb ayarla #kanal`", inline: true },
                            { name: '**⚡️Peki Nasıl Kapatacağım?**', value: "`" + prefix + "resimli-hgbb sıfırla`", inline: true }
                        )
                    return message.reply({ embeds: [ryardimi] })
                }
            }
        }

exports.conf = {
    aliases: ["resimligirişçıkış", "resimlihgbb", "resimli-hgbb"]
}

exports.help = {
    name: 'resimli-giriş-çıkış',
    description: 'Resimli Giriş Çıkış Sistemi Ayarlarınızı Yapar.',
    usage: 'resimli-giriş-çıkış ayarla #kanal',
    category: "moderasyon"
}
