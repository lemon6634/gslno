const { MessageEmbed } = require("discord.js");
const Database = require("croxydb");

exports.run = async (client, message, args) => {
    const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
    const embed = new MessageEmbed()
        .setColor("YELLOW")

    if (message.author.id !== message.guild.ownerId) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Yetersiz izin, sistemi sadece \`SUNUCU SAHIBI\` kullanabilir.`)] })

    const botGuardBoolean = await Database.get(`botGuardBoolean.${message.guild.id}`);
    const botGuardLogChannel = await Database.get(`botGuardLogChannel.${message.guild.id}`);

    if (!args[0]) {
        const embed = new MessageEmbed()
            .setTitle("__BOT KORUMA SİSTEMİ__")
            .setAuthor({ name: "" })
            .setDescription(`Dunge Bot Koruma Sistemi`, client.user.displayAvatarURL())
            .addField('**⚡️Bot Koruma**', '> Sunucunuzda sizden izinsiz eklenen botları kickler.')
            .addFields(
                //{ name: '\u200B', value: '\u200B' },
                { name: '**⚡️Peki Nasıl Ayarlarım?**', value: '``?bot-koruma aç``\n ``?bot-koruma izin ver @bot``\n ``?bot-koruma log #kanal``', inline: true },
                { name: '**⚡️Peki Nasıl Kapatacağım?**', value: '``?bot-koruma kapat``\n `?bot-koruma izin kaldır @bot`\n ``?bot-koruma log sıfırla``', inline: true },
            )
            .setColor("YELLOW")
        message.reply({ embeds: [embed] })
    }

    if (args[0] === "aç") {
        if (botGuardBoolean) {
            message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210> Bot koruma sistemi zaten açık durumda.`)] })
        } else {
            await Database.set(`botGuardBoolean.${message.guild.id}`, "open")
            message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla bot koruma sistemi açıldı.`)] })
        }
    }

    if (args[0] === "kapat") {
        if (botGuardBoolean) {
            await Database.delete(`botGuardBoolean.${message.guild.id}`)
            message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla bot koruma sistemi kapatıldı.`)] })
        } else {
            message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Bot koruma sistemi zaten kapalı durumda.`)] })
        }
    }

    if (args[0] === "izin") {
        if (args[1] === "kaldır") {
            try {
                let bot = await client.users.fetch(args[2]);

                if (!bot) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  zinini kaldıracağın botun ID'sini yazmalısın.`)] })

                if (bot.bot === false) {
                    message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Belirttiğin ID bir botun ID'si değil, bot ID'si belirt.`)] })
                } else {
                    const botGuardPerm = await Database.get(`botGuardPerm.${message.guild.id}${bot.id}`);

                    if (!botGuardPerm) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Belirttiğin bot sistemde zaten izinli değil.`)] })

                    await Database.delete(`botGuardPerm.${message.guild.id}${bot.id}`)

                    message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla \`${bot.username}\` adlı botun izinini kaldırdın.`)] })
                }
            } catch (err) {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  İzinini kaldıracağın botun ID'sini yazmalısın.`)] })
            }
        }

        if (args[1] === "ver") {
            try {
                let bot = await client.users.fetch(args[2]);

                if (!bot) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  İzin vereceğin botun ID'sini yazmalısın.`)] })

                if (bot.bot === false) {
                    message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Belirttiğin ID bir botun ID'si değil, bot ID'si belirt.`)] })
                } else {
                    const botGuardPerm = await Database.get(`botGuardPerm.${message.guild.id}${bot.id}`);

                    if (botGuardPerm) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Belirttiğin bot sistemde zaten izinli.`)] })

                    await Database.set(`botGuardPerm.${message.guild.id}${bot.id}`, "izin")

                    message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla \`${bot.username}\` adlı bota izin verdin.`)] })
                }
            } catch (err) {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  İzin vereceğin botun ID'sini yazmalısın.`)] })
            }
        }
    }

    if (args[0] === "log") {
        if (args[1] === "sıfırla") {
            if (botGuardLogChannel) {
                await Database.delete(`botGuardLogChannel.${message.guild.id}`)

                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla bot koruma log kanalı sıfırlandı.`)] })
            } else {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen bot koruma log kanalı zaten ayarlanmamış.`)] })
            }

            return;
        }

        if (botGuardLogChannel) {
            message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Bot koruma log kanalı zaten ayarlanmış. \n\nSıfırlamak İçin: ${prefix}bot-koruma silinen log sıfırla`)] })
        } else {
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]);

            if (!channel) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Bot koruma log kanalını ayarlamak için bir kanal etiketlemelisin.`)] })

            await Database.set(`botGuardLogChannel.${message.guild.id}`, channel.id)

            message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla bot koruma log kanalı ayarlandı. \n\nAyarlanan Kanal: ${channel ? channel : "Bulunamadı."}`)] })
        }
    }
}

exports.conf = {
    aliases: ["botkoruma"]
}

exports.help = {
    name: 'bot-koruma',
    description: 'Bot koruma sistemini açıp kapatır.',
    usage: 'bot-koruma [aç/kapat]',
    category: "koruma"
}
