const Discord = require("discord.js");
const db = require("orio.db")
exports.run = async (client, message, args) => {
  const embed = new Discord.MessageEmbed()
    .setColor("YELLOW")
  if (!message.member.permissions.has("MANAGE_GUİLD" && "MANAGE_ROLES")) return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  Bu komutu kullana bilmek için \`Sunucuyu Yönet\` ve \`Rolleri Yönet\` yetkilerine sahip olman gerekli!**")] }).catch(e => { })

  const channel = db.get("channels-" + message.guild.id)
  if (channel) {
    if (message.guild.channels.cache.get(channel)) {
      const msg = db.get("messages-" + message.guild.id)
      if (msg) {
        message.guild.channels.cache.get(channel).messages.fetch(msg).then(async msj => {
          const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
          if (role) {

            let emoji = args[1]
            let emojiID
            if (!emoji) return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  Hangi emojiye basınca rol verileceğini yazmalısın!**\n> **Örnek: \`" + client.prefix + "emoji-rol-ayarla @rol :heart:\`**")] }).catch(e => { })

            try {
              await msj.react(emoji).then(mr => {
                if (mr.emoji.id) {
                  emojiID = mr.emoji.id
                }
                emoji = mr.emoji.name
              })
            } catch (err) {
              return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210> Belirtilen mesaja reaksiyon ekleyemedim `" + emoji + "` emoji bu sunucuya ait değil!**")] }).catch(e => { })
            }

            if (db.get("reactions." + message.guild.id)) {
              let data = Object.entries(db.get("reactions." + message.guild.id)).filter(mr => mr[1].channel == channel).map(me => me[1].channel)
              if (!data.length == 0) {
                let data2 = Object.entries(db.get("reactions." + message.guild.id)).filter(mr => mr[1].message == msj.id).map(me => me[1].message)
                if (!data2.length == 0) {
                  let data3 = Object.entries(db.get("reactions." + message.guild.id)).filter(mr => mr[1].role == role.id).map(me => me[1]).filter(ms => ms.emoji == emoji)
                  if (!data3.length == 0) {
                    return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  Zaten belirtilen mesaja aynı emojide aynı rol atanmış!**")] }).catch(e => { })
                  }
                }
              }
            }

            await db.push("reactions." + message.guild.id, {
              message: msg,
              channel: channel,
              guild: message.guild.id,
              role: role.id,
              emoji: emoji,
              emojiID: emojiID,
              author: message.author.id,
              time: Date.now()
            })

            const cse = new Discord.MessageEmbed()
              .setTitle(message.guild.name + " Emoji Rol Sistemi")
              .setColor("BLUE")
              .setThumbnail(client.user.displayAvatarURL())
              .setDescription("> **<:correct:980410756187185172>  Başarılı, Rol: \`" + role.name + "\`, Emoji: " + emoji + " olarak ayarlandı! ([Mesaja Git](" + msj.url + "))**")
              .setTimestamp()
              .setFooter({ text: "Bir Lourity harikası.." })
            return message.channel.send({ embeds: [cse] }).catch(e => { })


          } else {
            return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  Verilecek rolü etiketlemelisin veya ID'sini yazmalısın**\n> **Örnek: \`" + client.prefix + "emoji-rol-ayarla @rol :heart:\`**")] }).catch(e => { })
          }
        }).catch(e => {
          return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  İlk önce emoji eklenecek Mesajın ID'sini ayarlamanız gerekir!**\n> **Örnek: \`" + client.prefix + "emoji-rol-mesaj <mesaj-id>\`**")] }).catch(e => { })
        })

      } else {
        return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  İlk önce emoji eklenecek mesajın ID'sini ayarlamanız gerekir!**\n> **Örnek: \`" + client.prefix + "emoji-rol-mesaj <mesaj-id>\`**")] }).catch(e => { })
      }
    } else {
      return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  İlk önce emoji eklenecek mesajın bulunduğu kanalı ayarlamanız gerekir!**\n> **Örnek: \`" + client.prefix + "emoji-rol-kanal <#kanal>\`**")] }).catch(e => { })
    }
  } else {
    return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  İlk önce emoji eklenecek mesajın bulunduğu kanalı ayarlamanız gerekir!**\n> **Örnek: \`" + client.prefix + "emoji-rol-kanal <#kanal>\`**")] }).catch(e => { })
  }
}

exports.conf = {
  aliases: ["emojirol-ayarla"]
}

exports.help = {
  name: "emoji-rol-ayarla",
  description: "Emojiye Rol Ekler.",
  usage: "emoji-rol-ayarla @rol :heart:",
  category: "emojirol"
}