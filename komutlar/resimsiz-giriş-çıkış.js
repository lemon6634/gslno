const Discord = require('discord.js')
const db = require("croxydb")

exports.run = async (client, message, args) => {
    const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
    if (!message.member.permissions.has("ADMINISTRATOR")) {
        const ytkmsj = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`<:cross:980410756484956210>  Bu komutu kullanabilmek için **Yönetici** iznine sahip olmalısın!`)
        return message.reply({ embeds: [ytkmsj] })
    }

    if (args[0] === "giriş-metni") {
        let metin = args.slice(1).join(" ")
        if (!metin) {
            const metinmsj = new Discord.MessageEmbed()
                .setColor('YELLOW')
                .setFooter({text: "» ?giriş-çıkış giriş-metni <mesaj>"})
                .setTitle("<:cross:980410756484956210>  Bir metin girmelisin!")
                .setDescription(`Örnek: \`{kullanıcı} sunucumuza hoşgeldin, burası {sunucu}, şuanda sunucumuz {kişisayısı} kişi.\``)
                .addField("**⚡️Argümanlar**", "{kullanıcı} : Kullanıcıyı etiketlemeden adını yazar.\n{kullanıcı_etiket} : Kullanıcıyı etiketleyerek yazar.\n{sunucu} : Sunucunun adını yazar.\n{kişisayısı} : Sunucudaki üye sayısını yazar.")
            return message.reply({ embeds: [metinmsj] })
        }

        db.set(`grsmetni_${message.guild.id}`, metin); {
            const girisbasari = new Discord.MessageEmbed()
                .setColor('YELLOW')
                .setDescription(`<:correct:980410756187185172>  **Giriş metni başarıyla değiştirildi!**`)
            return message.reply({ embeds: [girisbasari] })
        }
    } else {
        if (args[0] === "giriş-metni-sıfırla") {
            let metin = args.slice(1).join(" ")
        await db.delete(`grsmetni_${message.guild.id}`, metin); {
            const sifirbasari = new Discord.MessageEmbed()
                .setColor('YELLOW')
                .setDescription(`<:correct:980410756187185172>  **Giriş metni başarıyla sıfırlandı!**`)
            return message.reply({ embeds: [sifirbasari] })
        }}

        if (args[0] === "çıkış-metni") {
            let metin = args.slice(1).join(" ")
            if (!metin) {
                const metinmsjtwo = new Discord.MessageEmbed()
                    .setColor('YELLOW')
                    .setFooter({text: "» ?giriş-çıkış çıkış-metni <mesaj>"})
                    .setTitle("<:cross:980410756484956210>  Bir metin girmelisin!")
                    .setDescription(`Örnek: \`Sunucumuzdan {kullanıcı} ayrıldı, burası {sunucu} sunucusu, şu anda sunucumuz {kişisayısı} kişi.\``)
                    .addField("**⚡️Argümanlar**", "{kullanıcı} : Kullanıcıyı etiketlemeden adını yazar.\n{kullanıcı_etiket} : Kullanıcıyı etiketleyerek yazar.\n{sunucu} : Sunucunun adını yazar.\n{kişisayısı} : Sunucudaki üye sayısını yazar.")
                return message.reply({ embeds: [metinmsjtwo] })
            }

            db.set(`cksmetin_${message.guild.id}`, metin); {
                const çkşbasari = new Discord.MessageEmbed()
                    .setColor('YELLOW')
                    .setDescription(`<:correct:980410756187185172>  **Çıkış metni başarıyla değiştirildi!**`)
                return message.reply({ embeds: [çkşbasari] })
            }

        } else {
            if (args[0] === "çıkış-metni-sıfırla") {
                let metin = args.slice(1).join(" ")
            await db.delete(`cksmetin_${message.guild.id}`, metin); {
                const sifirbasari = new Discord.MessageEmbed()
                    .setColor('YELLOW')
                    .setDescription(`<:correct:980410756187185172>  **Çıkış metni başarıyla sıfırlandı!**`)
                return message.reply({ embeds: [sifirbasari] })
            }}

            if (args[0] === "ayarla") {
                const data = db.get(`rsgiris_${message.guild.id}`)
                if (data) {
                    const ztnayarli = new Discord.MessageEmbed()
                        .setColor('YELLOW')
                        .setDescription(`<:cross:980410756484956210>  **Giriş çıkış sistemi zaten ayarlı!**`)
                    return message.reply({ embeds: [ztnayarli] })
                }

                let channel = message.mentions.channels.first()
                if (!channel) {
                    const kullanim = new Discord.MessageEmbed()
                        .setColor('YELLOW')
                        .setDescription('<:cross:980410756484956210>  Kullanım: `' + prefix + 'giriş-çıkış ayarla #kanal`')
                    return message.reply({ embeds: [kullanim] })
                }

                await db.set('rsgiris_' + message.guild.id, channel.id); {
                    const knlbasari = new Discord.MessageEmbed()
                        .setColor('YELLOW')
                        .setDescription(`<:correct:980410756187185172>  **Giriş çıkış kanalı ${channel} olarak ayarlandı!**`)
                    return message.reply({ embeds: [knlbasari] })
                }

            } else {

                if (args[0] === "sıfırla") {
                    const data = db.get(`rsgiris_${message.guild.id}`)
                    if (!data) {
                        const ayarlidegil = new Discord.MessageEmbed()
                            .setColor('YELLOW')
                            .setDescription(`<:cross:980410756484956210>  **Giriş çıkış sistemi zaten ayarlı değil!**`)
                        return message.reply({ embeds: [ayarlidegil] })
                    }

                    await db.delete('rsgiris_' + message.guild.id); {
                        const sifirlandi = new Discord.MessageEmbed()
                            .setColor('YELLOW')
                            .setDescription('<:correct:980410756187185172>  **Giriş çıkış kanalı sıfırlandı!**')
                        return message.reply({ embeds: [sifirlandi] })
                    }
                } else {
                    const ryardimi = new Discord.MessageEmbed()
                    .setColor('YELLOW')
                    .setTitle("_GİRİŞ-ÇIKIŞ SİSTEMİ_")
                    .setDescription("Giriş/Çıkış metinlerinin **argümanlarını görmek** için \`?giriş-çıkış giriş-metni\` yazabilirsiniz!")
                    .addFields(
                        //{ name: '\u200B', value: '\u200B' },
                        { name: '**⚡️Peki Nasıl Ayarlarım?**', value: "`" + prefix + "giriş-çıkış ayarla #kanal\n" + prefix + "giriş-çıkış giriş-metni\n" + prefix + "giriş-çıkış çıkış-metni`", inline: true },
                        { name: '**⚡️Peki Nasıl Kapatacağım?**', value: "`" + prefix + "giriş-çıkış sıfırla`\n`" + prefix + "giriş-çıkış giriş-metni-sıfırla`\n`" + prefix + "giriş-çıkış çıkış-metni-sıfırla`", inline: true }
                    )
                return message.reply({ embeds: [ryardimi] })
                }
            }
        }
    }
}

exports.conf = {
    aliases: ["girişçıkış", "hg-bb", "hgbb"]
}

exports.help = {
    name: 'giriş-çıkış',
    description: 'Giriş Çıkış Sistemi Ayarlarınızı Yapar.',
    usage: 'giriş-çıkış ayarla #kanal',
    category: "moderasyon"
}
