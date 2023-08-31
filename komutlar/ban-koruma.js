const { MessageEmbed } = require("discord.js");
const Database = require("croxydb");

exports.run = async (client, message, args) => {
    const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
    const embed = new MessageEmbed()
        .setColor("YELLOW")

    if (message.author.id !== message.guild.ownerId) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek için \`Sunucu Sahibi\` iznine sahip olmalısın!**`)] })

    const banGuardBoolean = await Database.get(`banGuardBoolean.${message.guild.id}`);
    const banGuardNumber = await Database.get(`banGuardNumber.${message.guild.id}`);
    const banGuardLogChannel = await Database.get(`banGuardLogChannel.${message.guild.id}`);

    if (!args[0]) {
        const embed = new MessageEmbed()
            .setTitle("__BAN KORUMA SİSTEMİ__")
            .setAuthor({ name: "" })
            .setDescription(`Dunge Ban Koruma Sistemi`, client.user.displayAvatarURL())
            .addField('**⚡️Ban Koruma**', '> Sunucunuzda ban atılmasını engeller.')
            .addFields(
                //{ name: '\u200B', value: '\u200B' },
                { name: '**⚡️Peki Nasıl Ayarlarım?**', value: '``?ban-koruma aç``\n ``?ban-koruma limit <sayı>``\n ``?ban-koruma log #kanal``', inline: true },
                { name: '**⚡️Peki Nasıl Kapatacağım?**', value: '``?ban-koruma kapat``\n `?ban-koruma limit sıfırla`\n ``?ban-koruma log sıfırla``', inline: true },
            )
            .setColor("YELLOW")
        message.reply({ embeds: [embed] })
    }

    if (args[0] === "aç") {
        if (banGuardBoolean) {
            message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Ban limit sistemi zaten açık durumda.`)] })
        } else {
            await Database.set(`banGuardBoolean.${message.guild.id}`, "open")
            message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla ban limit sistemi açıldı.`)] })
        }
    }

    if (args[0] === "kapat") {
        if (banGuardBoolean) {
            await Database.delete(`banGuardBoolean.${message.guild.id}`)
            message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla ban limit sistemi kapatıldı.`)] })
        } else {
            message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Ban limit sistemi zaten kapalı durumda.`)] })
        }
    }

    if (args[0] === "limit") {
        if (args[1] === "sıfırla") {
            if (banGuardNumber) {
                await Database.delete(`banGuardNumber.${message.guild.id}`);

                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla ban limit sıfırlandı.`)] })
            } else {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Ban limiti zaten ayarlanmamış.`)] })
            }

            return;
        }

        if (banGuardNumber) {
            message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen ban limiti zaten ayarlanmış. \n\nSıfırlamak İçin: ${prefix}ban-koruma limit sıfırla`)] })
        } else {
            if (!Number(args[1])) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Ban limitini ayarlamak için bir sayı girmelisin.`)] })
            if (Number(args[1]) < 0) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Ban limitini ayarlamak için pozitif bir sayı girmelisin.`)] })

            await Database.add(`banGuardNumber.${message.guild.id}`, Number(args[1]))

            message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla ban limiti **${Number(args[1])}** olarak ayarlandı. `)] })
        }
    }

    if (args[0] === "log") {
        if (args[1] === "sıfırla") {
            if (banGuardLogChannel) {
                await Database.delete(`banGuardLogChannel.${message.guild.id}`)

                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla ban limit log kanalı sıfırlandı.`)] })
            } else {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen ban limit log kanalı zaten ayarlanmamış.`)] })
            }

            return;
        }

        if (banGuardLogChannel) {
            message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Ban limit log kanalı zaten ayarlanmış. \n\nSıfırlamak İçin: ${prefix}ban-koruma silinen log sıfırla`)] })
        } else {
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]);

            if (!channel) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Ban limit log kanalını ayarlamak için bir kanal etiketlemelisin.`)] })

            await Database.set(`banGuardLogChannel.${message.guild.id}`, channel.id)

            message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla ban limit log kanalı ayarlandı.\n\nAyarlanan Kanal: ${channel ? channel : "Bulunamadı."}`)] })
        }
    }
}

exports.conf = {
    aliases: ["bankoruma", "bansecurity"]
}

exports.help = {
    name: 'ban-koruma',
    description: 'Ban limit sistemi açıp kapatır.',
    usage: 'ban-koruma <aç/kapat>',
    category: 'koruma'
}
