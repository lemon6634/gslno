const Discord = require('discord.js')

exports.run = async (client, message, args) => {

    let button = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
            .setStyle("SUCCESS")
            .setLabel("Güncelle")
            .setCustomId("rel"),
        new Discord.MessageButton()
            .setStyle("DANGER")
            .setLabel("Sil")
            .setCustomId("del"))

    const start = Date.now();
    const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle(client.user.username + " Bot")
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
            { name: `> Mesaj Pingi`, value: `  \`${Date.now() - start}ms\` 🛰️`, inline: true },
            { name: `> Mesaj Yanıt Süresi`, value: `  \`${message.createdTimestamp - start}ms\` 🛰️`, inline: true },
            { name: `> Api Pingi`, value: `  \`${Math.round(client.ws.ping)}ms\` 🛰️`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: '❤️', iconURL: message.author.avatarURL({ dynamic: true }) });
    message.reply({ embeds: [embed], components: [button] }).then(async Message => {

        const filter = i => i.user.id === message.author.id
        let col = await Message.createMessageComponentCollector({ filter, time: 1200000 });

        col.on('collect', async (button) => {
            if (button.user.id !== message.author.id) return

            switch (button.customId) {
                case 'rel':
                    const embedd = new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(client.user.username + " Bot")
                    .setThumbnail(client.user.displayAvatarURL())
                    .addFields(
                        { name: `> Mesaj Pingi`, value: `  \`${Date.now() - start}ms\` 🛰️`, inline: true },
                        { name: `> Mesaj Yanıt Süresi`, value: `  \`${message.createdTimestamp - start}ms\` 🛰️`, inline: true },
                        { name: `> Api Pingi`, value: `  \`${Math.round(client.ws.ping)}ms\` 🛰️`, inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: '❤️', iconURL: message.author.avatarURL({ dynamic: true }) });

                    await Message.edit({ embeds: [embedd] })
                    button.reply({ content: "> **<:correct:980410756187185172>  Başarılı:** Bot pingi güncellendi!", ephemeral: true }).catch(e => { });

                    break
                case 'del':
                    col.stop(true)
                    await message.delete().catch(e => { });
                    await Message.delete().catch(e => { });
                    button.reply({ content: "> **<:correct:980410756187185172>  Başarılı:** Bot ping mesajı silindi!", ephemeral: true }).catch(e => { });
                    break

            }
        })
        col.on('end', async (button) => {

            button = new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton()
                    .setStyle("SUCCESS")
                    .setLabel("Güncelle")
                    .setCustomId("rel")
                    .setDisabled(true),
                new Discord.MessageButton()
                    .setStyle("DANGER")
                    .setLabel("Sil")
                    .setCustomId("del")
                    .setDisabled(true))

            const embeddd = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle(client.user.username + " Bot")
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: `> Mesaj Pingi`, value: `  \`${Date.now() - start}ms\` 🛰️`, inline: true },
                { name: `> Mesaj Yanıt Süresi`, value: `  \`${message.createdTimestamp - start}ms\` 🛰️`, inline: true },
                { name: `> Api Pingi`, value: `  \`${Math.round(client.ws.ping)}ms\` 🛰️`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: '❤️', iconURL: message.author.avatarURL({ dynamic: true }) });

            await Message.edit({ embeds: [embeddd], components: [button] })
        })
    }).catch(e => { });
}
exports.conf = {
    aliases: ["ms"]
}

exports.help = {
    name: 'ping',
    description: 'Pingimi Gösterir.',
    usage: 'ping',
    category: 'bot'
}
