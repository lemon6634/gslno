const Discord = require('discord.js')
const { MessageButton, MessageEmbed, MessageActionRow } = require('discord.js');
exports.run = async(client, message, args) => {
    const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
    if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply({ embeds: [embed.setDescription(`Bu komutu kullanabilmek için **Kullanıcıları Yasakla** iznine sahip olmalısın!`)] }).catch(e => {})
    const bans = new Map();
    message.guild.bans.fetch().then(async g => {
        bans[g.id] = g  
let sonuç = bans[g.id].length
        if(sonuç === 0){
            let noembed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setDescription(`<:cross:980410756484956210>  Bu sunucuda yasaklı kullanıcı bulunmuyor.`)
            .setTitle(message.guild.name)
            .setTimestamp()
            return message.channel.send({embeds: [noembed]}).catch(e => {})
        }

        const backId = "emojiBack"
        const forwardId = "emojiForward"
        const backButton = new MessageButton({
        style: "SECONDARY",
        emoji: "⬅️",
        customId: backId
        });
        
        const forwardButton = new MessageButton({
        style: "SECONDARY",
        emoji: "➡️",
        customId: forwardId
        });
        
        const emoji = [...bans[g.id].values()]
        let kaçtane = 4
        let page = 1
        let a = emoji.length / kaçtane
        let b = `${a +1}`
        let toplam = b.charAt(0)
        
        const generateEmbed = async (start) => {
            
        let sayı = page === 1 ? 1: page * kaçtane - kaçtane + 1
        const current = await emoji.slice(start, start + kaçtane)
         return new MessageEmbed()
         .setTitle(`${message.guild.name} Sunucusu - Ban Listesi`)
        .setFooter({text: `Sayfa ${page} / ${toplam}` })
        .setDescription(`Bir banı kaldırmak için \`${prefix}unban <kullanıcı-id>\` yazabilirsiniz.`)
        .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
        .addFields(await Promise.all(current.map(async (data) => ({
        name: `\`${sayı++}\` ↷`,
        value: `**İsim: \`${data.user.tag}\`\nID: \`${data.user.id}\`\nBanlanma Sebebi: \`${data.reason || "Belirtilmemiş"}\`**`,
        inline: false
        }))))
        .setColor("BLUE")
        }
        
            const canFitOnOnePage = emoji.length <= kaçtane
            const embedMessage = await message.channel.send({
              embeds: [await generateEmbed(0)],
              components: canFitOnOnePage
                ? []
                : [new MessageActionRow({ components: [forwardButton] })],
            }).catch(e => { });
        
            if (canFitOnOnePage) return
        
            const collector = embedMessage.createMessageComponentCollector({
              filter: ({ user }) => user.id === message.author.id,
            });
        
         
            let currentIndex = 0
            collector.on("collect", async (interaction) => {
              if(interaction.customId === backId) {
                  page--
              }
              if(interaction.customId === forwardId) {
                  page++
              }
        
              interaction.customId === backId
                ? (currentIndex -= kaçtane)
                : (currentIndex += kaçtane)
        
              await interaction.update({
                embeds: [await generateEmbed(currentIndex)],
                components: [
                  new MessageActionRow({
                    components: [
                      ...(currentIndex ? [backButton] : []),
                      ...(currentIndex + kaçtane < emoji.length ? [forwardButton] : []),
                    ],
                  }),
                ],
              }).catch(e => { })
            })


}).catch(e => {})
}
module.exports.conf = {
aliases: ["ban-list"]
}
module.exports.help = {
name: 'banlist',
description: 'Ban Listesisini Gösterir.',
usage: 'banlist',
category: 'moderasyon'
}
