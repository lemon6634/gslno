const { MessageEmbed } = require("discord.js");
const Database = require("croxydb");

exports.run = async (client, message, args) => {
    const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
    const embed = new MessageEmbed()
        .setColor("YELLOW")

    if (message.author.id !== message.guild.ownerId) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek için \`SUNUCU SAHIBI\` yetkisine sahip olmanız gerekiyor.**`)] })

    const roleDeleteBoolean = await Database.get(`roleDeleteBoolean.${message.guild.id}`);
    const roleDeleteNumber = await Database.get(`roleDeleteNumber.${message.guild.id}`);
    const roleDeleteLogChannel = await Database.get(`roleDeleteLogChannel.${message.guild.id}`);

    const roleCreateBoolean = await Database.get(`roleCreateBoolean.${message.guild.id}`);
    const roleCreateNumber = await Database.get(`roleCreateNumber.${message.guild.id}`);
    const roleCreateLogChannel = await Database.get(`roleCreateLogChannel.${message.guild.id}`);

    if (!args[0]) {
        const embed = new MessageEmbed()
            .setTitle("__ROL KORUMA SİSTEMİ__")
            .setAuthor({ name: "" })
            .setDescription(`Dunge Rol Koruma Sistemi`, client.user.displayAvatarURL())
            .addField('**⚡️Silinen Rol Koruma**', '> Sunucunuzda silinen rolleri geri oluşturuyor ve rolü silenden ||ROLLERİ YÖNET|| yetkisini alıyor.')
            .addField('**⚡️Açılan Rol Koruma**', '> Sunucunuzda açılan rolleri geri oluşturuyor ve rolü açandan ||ROLLERİ YÖNET|| yetkisini alıyor.')
            .addFields(
                //{ name: '\u200B', value: '\u200B' },
                { name: '**⚡️Silinen Rol Koruma Komutları**', value: '``?rol-koruma silinen aç``\n ``?rol-koruma silinen kapat``\n ``?rol-koruma silinen limit <sayı>``\n ``?rol-koruma silinen limit sıfırla``\n ``?rol-koruma silinen log #kanal``\n ``?rol-koruma silinen log sıfırla``', inline: true },
                { name: '**⚡️Açılan Rol Koruma Komutları**', value: '``?rol-koruma açılan aç``\n `?rol-koruma açılan kapat`\n ``?rol-koruma açılan limit <sayı>``\n ``?rol-koruma açılan limit sıfırla``\n ``?rol-koruma açılan log #kanal``\n ``?rol-koruma açılan log sıfırla``', inline: true },
            )
            .setColor("YELLOW")
        message.reply({ embeds: [embed] })
    }

    if (args[0] === "silinen") {
        if (!args[1]) {
            const embed = new MessageEmbed()
                .setTitle("__ROL KORUMA SİSTEMİ__")
                .setAuthor({ name: "" })
                .setDescription(`Dunge Rol Koruma Sistemi`, client.user.displayAvatarURL())
                .addField('**⚡️Silinen Rol Koruma**', '> Sunucunuzda silinen rolleri geri oluşturuyor ve rolü silenden ||ROLLERİ YÖNET|| yetkisini alıyor.')
                .addField('**⚡️Açılan Rol Koruma**', '> Sunucunuzda açılan rolleri geri oluşturuyor ve rolü açandan ||ROLLERİ YÖNET|| yetkisini alıyor.')
                .addFields(
                    //{ name: '\u200B', value: '\u200B' },
                    { name: '**⚡️Silinen Rol Koruma Komutları**', value: '``?rol-koruma silinen aç``\n ``?rol-koruma silinen kapat``\n ``?rol-koruma silinen limit <sayı>``\n ``?rol-koruma silinen limit sıfırla``\n ``?rol-koruma silinen log #kanal``\n ``?rol-koruma silinen log sıfırla``', inline: true },
                    { name: '**⚡️Açılan Rol Koruma Komutları**', value: '``?rol-koruma açılan aç``\n `?rol-koruma açılan kapat`\n ``?rol-koruma açılan limit <sayı>``\n ``?rol-koruma açılan limit sıfırla``\n ``?rol-koruma açılan log #kanal``\n ``?rol-koruma açılan log sıfırla``', inline: true },
                )
                .setColor("YELLOW")
            message.reply({ embeds: [embed] })
        }

        if (args[1] === "aç") {
            if (roleDeleteBoolean) {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen rol limit sistemi zaten açık durumda.`)] })
            } else {
                await Database.set(`roleDeleteBoolean.${message.guild.id}`, "open")
                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla silinen rol limit sistemi açıldı.`)] })
            }
        }

        if (args[1] === "kapat") {
            if (roleDeleteBoolean) {
                await Database.delete(`roleDeleteBoolean.${message.guild.id}`)
                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla silinen rol limit sistemi kapatıldı.`)] })
            } else {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen rol limit sistemi zaten kapalı durumda.`)] })
            }
        }

        if (args[1] === "limit") {
            if (args[2] === "sıfırla") {
                if (roleDeleteNumber) {
                    await Database.delete(`roleDeleteNumber.${message.guild.id}`);

                    message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla silinen rol limit sıfırlandı.`)] })
                } else {
                    message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210> Silinen rol limiti zaten ayarlanmamış.`)] })
                }

                return;
            }

            if (roleDeleteNumber) {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen rol limiti zaten ayarlanmış. \n\nSıfırlamak İçin: ${prefix}rol-koruma silinen limit sıfırla`)] })
            } else {
                if (!Number(args[2])) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen rol limitini ayarlamak için bir sayı girmelisin.`)] })
                if (Number(args[2]) < 0) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen rol limitini ayarlamak için pozitif bir sayı girmelisin.`)] })

                await Database.add(`roleDeleteNumber.${message.guild.id}`, Number(args[2]))

                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla silinen rol limiti **${Number(args[2])}** olarak ayarlandı.`)] })
            }
        }

        if (args[1] === "log") {
            if (args[2] === "sıfırla") {
                if (roleDeleteLogChannel) {
                    await Database.delete(`roleDeleteLogChannel.${message.guild.id}`)

                    message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla silinen rol limit log kanalı sıfırlandı.`)] })
                } else {
                    message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen rol limit log kanalı zaten ayarlanmamış.`)] })
                }

                return;
            }

            if (roleDeleteLogChannel) {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen rol limit log kanalı zaten ayarlanmış. \n\nSıfırlamak İçin: ${prefix}rol-koruma silinen log sıfırla`)] })
            } else {
                const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]);

                if (!channel) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Silinen rol limit log kanalını ayarlamak için bir kanal etiketlemelisin.`)] })

                await Database.set(`roleDeleteLogChannel.${message.guild.id}`, channel.id)

                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla silinen rol limit log kanalı ayarlandı. \n\nAyarlanan Kanal: ${channel ? channel : "Bulunamadı."}`)] })
            }
        }
    }

    if (args[0] === "açılan") {
        if (!args[1]) {
            const embed = new MessageEmbed()
                .setTitle("__ROL KORUMA SİSTEMİ__")
                .setAuthor({ name: "" })
                .setDescription(`Dunge Rol Koruma Sistemi`, client.user.displayAvatarURL())
                .addField('**⚡️Silinen Rol Koruma**', '> Sunucunuzda silinen rolleri geri oluşturuyor ve rolü silenden ||ROLLERİ YÖNET|| yetkisini alıyor.')
                .addField('**⚡️Açılan Rol Koruma**', '> Sunucunuzda açılan rolleri geri oluşturuyor ve rolü açandan ||ROLLERİ YÖNET|| yetkisini alıyor.')
                .addFields(
                    //{ name: '\u200B', value: '\u200B' },
                    { name: '**⚡️Silinen Rol Koruma Komutları**', value: '``?rol-koruma silinen aç``\n ``?rol-koruma silinen kapat``\n ``?rol-koruma silinen limit <sayı>``\n ``?rol-koruma silinen limit sıfırla``\n ``?rol-koruma silinen log #kanal``\n ``?rol-koruma silinen log sıfırla``', inline: true },
                    { name: '**⚡️Açılan Rol Koruma Komutları**', value: '``?rol-koruma açılan aç``\n `?rol-koruma açılan kapat`\n ``?rol-koruma açılan limit <sayı>``\n ``?rol-koruma açılan limit sıfırla``\n ``?rol-koruma açılan log #kanal``\n ``?rol-koruma açılan log sıfırla``', inline: true },
                )
                .setColor("YELLOW")
            message.reply({ embeds: [embed] })
        }

        if (args[1] === "aç") {
            if (roleCreateBoolean) {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210> Açılan rol limit sistemi zaten açık durumda.`)] })
            } else {
                await Database.set(`roleCreateBoolean.${message.guild.id}`, "open")
                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla açılan rol limit sistemi açıldı.`)] })
            }
        }

        if (args[1] === "kapat") {
            if (roleCreateBoolean) {
                await Database.delete(`roleCreateBoolean.${message.guild.id}`)
                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla açılan rol limit sistemi kapatıldı.`)] })
            } else {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210> Açılan rol limit sistemi zaten kapalı durumda.`)] })
            }
        }

        if (args[1] === "limit") {
            if (args[2] === "sıfırla") {
                if (roleCreateNumber) {
                    await Database.delete(`roleCreateNumber.${message.guild.id}`);

                    message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla açılan rol limit sıfırlandı.`)] })
                } else {
                    message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Açılan rol limiti zaten ayarlanmamış.`)] })
                }

                return;
            }

            if (roleCreateNumber) {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Açılan rol limiti zaten ayarlanmış. \n\nSıfırlamak İçin: ${prefix}rol-koruma açılan limit sıfırla`)] })
            } else {
                if (!Number(args[2])) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  açılan rol limitini ayarlamak için bir sayı girmelisin.`)] })
                if (Number(args[2]) < 0) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  açılan rol limitini ayarlamak için pozitif bir sayı girmelisin.`)] })

                await Database.add(`roleCreateNumber.${message.guild.id}`, Number(args[2]))

                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla açılan rol limiti **${Number(args[2])}** olarak ayarlandı.`)] })
            }
        }

        if (args[1] === "log") {
            if (args[2] === "sıfırla") {
                if (roleCreateLogChannel) {
                    await Database.delete(`roleCreateLogChannel.${message.guild.id}`)

                    message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla açılan rol limit log kanalı sıfırlandı.`)] })
                } else {
                    message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Açılan rol limit log kanalı zaten ayarlanmamış.`)] })
                }

                return;
            }

            if (roleCreateLogChannel) {
                message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Açılan rol limit log kanalı zaten ayarlanmış. \n\nSıfırlamak İçin: ${prefix}rol-koruma açılan log sıfırla`)] })
            } else {
                const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]);

                if (!channel) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Açılan rol limit log kanalını ayarlamak için bir kanal etiketlemelisin.`)] })

                await Database.set(`roleCreateLogChannel.${message.guild.id}`, channel.id)

                message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Başarıyla açılan rol limit log kanalı ayarlandı. \n\nAyarlanan Kanal: ${channel ? channel : "bulunamadı."}`)] })
            }
        }
    }
}

exports.conf = {
    aliases: ["rolkoruma"]
}

exports.help = {
    name: 'rol-koruma',
    description: 'Rol Koruma Sistemi',
    usage: 'rol-koruma <komut>',
    category: "koruma"
}
