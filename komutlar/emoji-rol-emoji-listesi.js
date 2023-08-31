const { MessageButton, MessageEmbed, MessageActionRow } = require("discord.js")
const db = require("orio.db")
exports.run = async (client, message, args) => {
  const embed = new MessageEmbed()
    .setColor("YELLOW")
  let data = db.get(`reactions.${message.guild.id}`)
  if (!data) return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  Bu sunucuda zaten hiç emoji rol ayarlanmamış!**")] }).catch(e => { })

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

  const emoji = [...await db.get(`reactions.${message.guild.id}`).values()]
  let kaçtane = 6
  let page = 1
  let a = emoji.length / kaçtane
  let b = `${a + 1}`
  let toplam = b.charAt(0)

  const generateEmbed = async (start) => {

    let sayı = page === 1 ? 1 : page * kaçtane - kaçtane + 1
    const current = await emoji.slice(start, start + kaçtane)
    return new MessageEmbed()
      .setFooter({ text: `Sayfa ${page} / ${toplam}` })
      .setDescription(`Emoji rollerini silmek için \`${client.prefix}emoji-rol-sil <mesaj-id>\` yazabilirsiniz.`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .addFields(await Promise.all(current.map(async (data) => ({
        name: `\`${sayı++}\` ↷`,
        value: `Rol: ${message.guild.roles.cache.get(data.role) ? "<@&" + data.role + ">" : "`Rol Bulunamadı`"}
Emoji: ${data.emojiID ? (client.emojis.cache.get(data.emojiID) ? "`:" + data.emoji + ":`" : "`:" + data.emoji + ":`") : "" + data.emoji + ""}
Kanal: ${client.channels.cache.get(data.channel) ? "<#" + data.channel + ">" : "`Kanal Bulunamadı`"}
Mesaj: [mesaja git](https://discord.com/channels/${data.guild}/${data.channel}/${data.message})`,
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
    if (interaction.customId === backId) {
      page--
    }
    if (interaction.customId === forwardId) {
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
}

exports.conf = {
  aliases: ["emojirol-liste"]
}

exports.help = {
  name: "emoji-rol-liste",
  description: "Emoji Rol Listesi",
  usage: "emoji-rol-liste",
  category: "emojirol"
}
