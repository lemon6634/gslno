const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports.run = async (client, message, args) => {

    let button = new MessageActionRow().addComponents(
        new MessageButton()
            .setStyle("SUCCESS")
            .setLabel("Güncelle")
            .setCustomId("rel"),
        new MessageButton()
            .setStyle("DANGER")
            .setLabel("Sil")
            .setCustomId("del"))

    let embed = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(client.user.username + " Bot")
        .addFields(
            { name: `> Sunucular`, value: `» \`${client.guilds.cache.size}\``, inline: true },
            { name: `> Kullanıcılar`, value: `» \`${Math.ceil(client.guilds.cache.reduce((a, b) => a + b.memberCount, 0))}\``, inline: true },
            { name: `> Kanallar`, value: `» \`${client.channels.cache.size}\``, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: '❤️', iconURL: message.author.avatarURL({ dynamic: true }) });
        

    message.channel.send({ embeds: [embed], components: [button] }).then(async Message => {

        const filter = i => i.user.id === message.author.id
        let col = await Message.createMessageComponentCollector({ filter, time: 1200000 });

        col.on('collect', async (button) => {
            if (button.user.id !== message.author.id) return

            switch (button.customId) {
                case 'rel':
                    const embedd = new MessageEmbed()
                        .setColor("YELLOW")
                        .setTimestamp()
                        .setThumbnail(client.user.displayAvatarURL())
                        .setTitle(client.user.username + " Bot <:database:980419226483433482>")
                        .addFields(
                            { name: `> Sunucular`, value: `» \`${client.guilds.cache.size}\``, inline: true },
                            { name: `> Kullanıcılar`, value: `» \`${Math.ceil(client.guilds.cache.reduce((a, b) => a + b.memberCount, 0))}\``, inline: true },
                            { name: `> Kanallar`, value: `» \`${client.channels.cache.size}\``, inline: true }
                        )
                        .setTimestamp()
                        .setFooter({ text: '❤️', iconURL: message.author.avatarURL({ dynamic: true }) });

                    await Message.edit({ embeds: [embedd] })
                    button.reply({ content: "> **<:correct:980410756187185172>  Başarılı:** Bot istatistikleri güncellendi!", ephemeral: true }).catch(e => { });

                    break
                case 'del':
                    col.stop(true)
                    await message.delete().catch(e => { });
                    await Message.delete().catch(e => { });
                    button.reply({ content: "> **<:correct:980410756187185172>  Başarılı** Bot istatistikleri silindi!", ephemeral: true }).catch(e => { });
                    break

            }
        })
        col.on('end', async (button) => {

            button = new MessageActionRow().addComponents(
                new MessageButton()
                    .setStyle("SUCCESS")
                    .setLabel("Güncelle")
                    .setCustomId("rel")
                    .setDisabled(true),
                new MessageButton()
                    .setStyle("DANGER")
                    .setLabel("Sil")
                    .setCustomId("del")
                    .setDisabled(true))

            const embedd = new MessageEmbed()
                .setColor("BLUE")
                .setThumbnail(client.user.displayAvatarURL())
                .setTitle(client.user.username + " Komut Süresi Doldu!")
                .addFields(
                    { name: `> Sunucular`, value: `» \`${client.guilds.cache.size}\``, inline: true },
                    { name: `> Kullanıcılar`, value: `» \`${Math.ceil(client.guilds.cache.reduce((a, b) => a + b.memberCount, 0))}\``, inline: true },
                    { name: `> Kanallar`, value: `» \`${client.channels.cache.size}\``, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: '❤️', iconURL: message.author.avatarURL({ dynamic: true }) });

            await Message.edit({ embeds: [embedd], components: [button] })
        })
    }).catch(e => { });

}
exports.conf = {
    aliases: ["stat", "botbilgi", "bot-bilgi"]
}

exports.help = {
    name: 'istatistik',
    description: 'Bot istatistiklerini gösterir.',
    usage: 'istatistik',
    category: 'bot'
}
