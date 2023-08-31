const { MessageButton, MessageEmbed, MessageActionRow } = require('discord.js');
const db = require('orio.db');
exports.run = async (client, message, args) => {
  const embed = new MessageEmbed()
   .setColor("YELLOW")

  let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.author
  if(!user) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Uyarısını kaldıracağım üyeyi etiketle veya id belirt!**")] })
 const warns = await db.get(`${message.guild.id}${user.id}.warns`)
 if(!warns) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Bu kullanıcıya ait uyarı bulunmamaktadır!**")] })
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

const emoji = [...warns.values()]

let kaçtane = 6
let page = 1
let a = emoji.length / kaçtane
let b = `${a +1}`
let toplam = b.charAt(0)

const generateEmbed = async (start) => {
    
let sayı = page === 1 ? 1: page * kaçtane - kaçtane + 1
const current = await emoji.slice(start, start + kaçtane)
 return new MessageEmbed()
.setFooter({text: `Sayfa ${page} / ${toplam}` })
.setDescription(`${user} adlı kullanıcıya ait uyarı listesi:`) 
.setThumbnail(client.user.displayAvatarURL({dynamic: true}))
.addFields(await Promise.all(current.map(async (data) => ({
name: `\`${sayı++}\` ↷`,
value: `${data ? `**${data.id}** Sebep: __${data.reason}__ | <t:` + Math.floor(data.time / 1000) + `:F> | (Mod: <@${data.moderator}>)`: "**Bu kullanıcıya ait uyarı bulunmamaktadır!**"}`,
inline: true
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

};
exports.conf = {
  aliases: ["uyarı-kontrol", "warns"]
};

exports.help = {
  name: "uyarılar",
  description: "Uyarılarınızı kontrol eder.",
  usage: "uyarılar [@kullanıcı]",
  category: "moderasyon"
};
