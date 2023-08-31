const { MessageEmbed } = require("discord.js");
const Database = require("croxydb");

exports.run = async (client, message, args) => {
    const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
    const embed = new MessageEmbed()
        .setColor("YELLOW")

    if (message.author.id !== message.guild.ownerId) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek için \`Sunucu Sahibi\` iznine sahip olmalısın!**`)] })

    const channelDeleteBoolean = await Database.get(`channelDeleteBoolean.${message.guild.id}`);
    const channelDeleteNumber = await Database.get(`channelDeleteNumber.${message.guild.id}`);
    const channelDeleteLogChannel = await Database.get(`channelDeleteLogChannel.${message.guild.id}`);

    const channelCreateBoolean = await Database.get(`channelCreateBoolean.${message.guild.id}`);
    const channelCreateNumber = await Database.get(`channelCreateNumber.${message.guild.id}`);
    const channelCreateLogChannel = await Database.get(`channelCreateLogChannel.${message.guild.id}`);

    if (!args[0]) {
        const embed = new MessageEmbed()
            .setTitle("__KANAL KORUMA SİSTEMİ__")
            .setAuthor({ name: "" })
            .setDescription(`Dunge Kanal Koruma Sistemi`, client.user.displayAvatarURL())
            .addField('**⚡️Silinen Kanal Koruma**', '> Sunucunuzda silinen kanalları geri oluşturuyor ve kanalı silenden ||KANALLARI YÖNET|| yetkisini alıyor.')
            .addField('**⚡️Açılan Kanal Koruma**', '> Sunucunuzda açılan kanalları geri oluşturuyor ve kanalı açandan ||KANALLARI YÖNET|| yetkisini alıyor.')
            .addFields(
                //{ name: '\u200B', value: '\u200B' },
                { name: '**⚡️Silinen Kanal Koruma Komutları**', value: '``?kanal-koruma silinen aç``\n ``?kanal-koruma silinen kapat``\n ``?kanal-koruma silinen limit <sayı>``\n ``?kanal-koruma silinen limit sıfırla``\n ``?kanal-koruma silinen log #kanal``\n ``?kanal-koruma silinen log sıfırla``', inline: true },
                { name: '**⚡️Açılan Kanal Koruma Komutları**', value: '``?kanal-koruma açılan aç``\n `?kanal-koruma açılan kapat`\n ``?kanal-koruma açılan limit <sayı>``\n ``?kanal-koruma açılan limit sıfırla``\n ``?kanal-koruma açılan log #kanal``\n ``?kanal-koruma açılan log sıfırla``', inline: true },
            )
            .setColor("YELLOW")
        message.reply({ embeds: [embed] })
    }

    if (args[0] === "silinen") {
        if (!args[1]) {
            const embed = new MessageEmbed()
            .setTitle("__KANAL KORUMA SİSTEMİ__")
            .setAuthor({ name: "" })
            .setDescription(`Dunge Kanal Koruma Sistemi`, client.user.displayAvatarURL())
            .addField('**⚡️Silinen Kanal Koruma**', '> Sunucunuzda silinen kanalları geri oluşturuyor ve kanalı silenden ||KANALLARI YÖNET|| yetkisini alıyor.')
            .addField('**⚡️Açılan Kanal Koruma**', '> Sunucunuzda açılan kanalları geri oluşturuyor ve kanalı açandan ||KANALLARI YÖNET|| yetkisini alıyor.')
            .addFields(
                //{ name: '\u200B', value: '\u200B' },
                { name: '**⚡️Silinen Kanal Koruma Komutları**', value: '``?kanal-koruma silinen aç``\n ``?kanal-koruma silinen kapat``\n ``?kanal-koruma silinen limit <sayı>``\n ``?kanal-koruma silinen limit sıfırla``\n ``?kanal-koruma silinen log #kanal``\n ``?kanal-koruma silinen log sıfırla``', inline: true },
                { name: '**⚡️Açılan Kanal Koruma Komutları**', value: '``?kanal-koruma açılan aç``\n `?kanal-koruma açılan kapat`\n ``?kanal-koruma açılan limit <sayı>``\n ``?kanal-koruma açılan limit sıfırla``\n ``?kanal-koruma açılan log #kanal``\n ``?kanal-koruma açılan log sıfırla``', inline: true },
            )
            .setColor("YELLOW")
        message.reply({ embeds: [embed] })
        }

        if (args[1] === "aç") {
            if (channelDeleteBoolean) {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen kanal limit sistemi zaten açık durumda.`)] })
            } else {
                await Database.set(`channelDeleteBoolean.${message.guild.id}`, "open")
                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla silinen kanal limit sistemi açıldı.`)] })
            }
        }

        if (args[1] === "kapat") {
            if (channelDeleteBoolean) {
                await Database.delete(`channelDeleteBoolean.${message.guild.id}`)
                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla silinen kanal limit sistemi kapatıldı.`)] })
            } else {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen kanal limit sistemi zaten kapalı durumda.`)] })
            }
        }

        if (args[1] === "limit") {
            if (args[2] === "sıfırla") {
                if (channelDeleteNumber) {
                    await Database.delete(`channelDeleteNumber.${message.guild.id}`);

                    message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla silinen kanal limit sıfırlandı.`)] })
                } else {
                    message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen kanal limiti zaten ayarlanmamış.`)] })
                }

                return;
            }

            if (channelDeleteNumber) {
                message.reply({ embeds: [embed.setDescription(`Silinen kanal limiti zaten ayarlanmış. \n\nSıfırlamak İçin: ${prefix}kanal-koruma silinen limit sıfırla`)] })
            } else {
                if (!Number(args[2])) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen kanal limitini ayarlamak için bir sayı girmelisin.`)] })
                if (Number(args[2]) < 0) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen kanal limitini ayarlamak için pozitif bir sayı girmelisin.`)] })

                await Database.add(`channelDeleteNumber.${message.guild.id}`, Number(args[2]))

                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla silinen kanal limiti **${Number(args[2])}** olarak ayarlandı.`)] })
            }
        }

        if (args[1] === "log") {
            if (args[2] === "sıfırla") {
                if (channelDeleteLogChannel) {
                    await Database.delete(`channelDeleteLogChannel.${message.guild.id}`)

                    message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla silinen kanal limit log kanalı sıfırlandı.`)] })
                } else {
                    message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen kanal limit log kanalı zaten ayarlanmamış.`)] })
                }

                return;
            }

            if (channelDeleteLogChannel) {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen kanal limit log kanalı zaten ayarlanmış. \n\nSıfırlamak İçin: ${prefix}kanal-koruma silinen log sıfırla`)] })
            } else {
                const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]);

                if (!channel) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen kanal limit log kanalını ayarlamak için bir kanal etiketlemelisin.`)] })

                await Database.set(`channelDeleteLogChannel.${message.guild.id}`, channel.id)

                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla silinen kanal limit log kanalı ayarlandı. \n\nAyarlanan Kanal: ${channel ? channel : "bulunamadı."}`)] })
            }
        }
    }

    if (args[0] === "açılan") {
        if (!args[1]) {
            const embed = new MessageEmbed()
            .setTitle("__KANAL KORUMA SİSTEMİ__")
            .setAuthor({ name: "" })
            .setDescription(`Dunge Kanal Koruma Sistemi`, client.user.displayAvatarURL())
            .addField('**⚡️Silinen Kanal Koruma**', '> Sunucunuzda silinen kanalları geri oluşturuyor ve kanalı silenden ||KANALLARI YÖNET|| yetkisini alıyor.')
            .addField('**⚡️Açılan Kanal Koruma**', '> Sunucunuzda açılan kanalları geri oluşturuyor ve kanalı açandan ||KANALLARI YÖNET|| yetkisini alıyor.')
            .addFields(
                //{ name: '\u200B', value: '\u200B' },
                { name: '**⚡️Silinen Kanal Koruma Komutları**', value: '``?kanal-koruma silinen aç``\n ``?kanal-koruma silinen kapat``\n ``?kanal-koruma silinen limit <sayı>``\n ``?kanal-koruma silinen limit sıfırla``\n ``?kanal-koruma silinen log #kanal``\n ``?kanal-koruma silinen log sıfırla``', inline: true },
                { name: '**⚡️Açılan Kanal Koruma Komutları**', value: '``?kanal-koruma açılan aç``\n `?kanal-koruma açılan kapat`\n ``?kanal-koruma açılan limit <sayı>``\n ``?kanal-koruma açılan limit sıfırla``\n ``?kanal-koruma açılan log #kanal``\n ``?kanal-koruma açılan log sıfırla``', inline: true },
            )
            .setColor("YELLOW")
        message.reply({ embeds: [embed] })
        }

        if (args[1] === "aç") {
            if (channelCreateBoolean) {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Açılan kanal limit sistemi zaten açık durumda.`)] })
            } else {
                await Database.set(`channelCreateBoolean.${message.guild.id}`, "open")
                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla açılan kanal limit sistemi açıldı.`)] })
            }
        }

        if (args[1] === "kapat") {
            if (channelCreateBoolean) {
                await Database.delete(`channelCreateBoolean.${message.guild.id}`)
                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla açılan kanal limit sistemi kapatıldı.`)] })
            } else {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Açılan kanal limit sistemi zaten kapalı durumda.`)] })
            }
        }

        if (args[1] === "limit") {
            if (args[2] === "sıfırla") {
                if (channelCreateNumber) {
                    await Database.delete(`channelCreateNumber.${message.guild.id}`);

                    message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla açılan kanal limit sıfırlandı.`)] })
                } else {
                    message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Açılan kanal limiti zaten ayarlanmamış.`)] })
                }

                return;
            }

            if (channelCreateNumber) {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Açılan kanal limiti zaten ayarlanmış. \n\nSıfırlamak İçin: ${prefix}kanal-koruma açılan limit sıfırla`)] })
            } else {
                if (!Number(args[2])) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Açılan kanal limitini ayarlamak için bir sayı girmelisin.`)] })
                if (Number(args[2]) < 0) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Açılan kanal limitini ayarlamak için pozitif bir sayı girmelisin.`)] })

                await Database.add(`channelCreateNumber.${message.guild.id}`, Number(args[2]))

                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla açılan kanal limiti **${Number(args[2])}** olarak ayarlandı.`)] })
            }
        }

        if (args[1] === "log") {
            if (args[2] === "sıfırla") {
                if (channelCreateLogChannel) {
                    await Database.delete(`channelCreateLogChannel.${message.guild.id}`)

                    message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla açılan kanal limit log kanalı sıfırlandı.`)] })
                } else {
                    message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Açılan kanal limit log kanalı zaten ayarlanmamış.`)] })
                }

                return;
            }

            if (channelCreateLogChannel) {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  açılan kanal limit log kanalı zaten ayarlanmış. \n\nSıfırlamak İçin: ${prefix}kanal-koruma açılan log sıfırla`)] })
            } else {
                const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]);

                if (!channel) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  açılan kanal limit log kanalını ayarlamak için bir kanal etiketlemelisin.`)] })

                await Database.set(`channelCreateLogChannel.${message.guild.id}`, channel.id)

                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla açılan kanal limit log kanalı ayarlandı. \n\nAyarlanan Kanal: ${channel ? channel : "bulunamadı."}`)] })
            }
        }
    }
}

exports.conf = {
    aliases: ["kanalkoruma", "kanal-koruam", "kanalkoruam"]
}

exports.help = {
    name: 'kanal-koruma',
    description: 'Kanal limitlerini ayarlar.',
    usage: 'kanal-koruma <silinen/açılan> <aç/kapat/limit/log>',
    category: "koruma"
}
