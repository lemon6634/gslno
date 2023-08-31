const Discord = require("discord.js");
const db = require("orio.db")
exports.run = async (client, message, args) => {
  const embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
if(!message.member.permissions.has("MANAGE_GUİLD" && "MANAGE_ROLES")) return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  Bu komutu kullana bilmek için \`Sunucuyu Yönet\` ve \`Rolleri Yönet\` yetkilerine sahip olman gerekli!**")] }).catch(e => {})
  
let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
if(!channel) return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  Bir kanal etiketlemen veya ID'sini yazman gerekli!**")] }).catch(e => {})
if(channel){
  if(channel.type === "GUILD_TEXT"){    
    
await db.set("channels-"+message.guild.id, channel.id)
 const cse = new Discord.MessageEmbed()
 .setTitle(message.guild.name+" Emoji Rol Sistemi")
 .setColor("BLUE")
 .setThumbnail(client.user.displayAvatarURL())
 .setDescription("> **<:correct:980410756187185172>  Başarılı Emoji Eklenecek Mesaj Kanalı Ayarlandı! <#"+channel.id+">**")
 .setTimestamp()
 .setFooter({text: "Dunge" })
  return message.channel.send({embeds : [cse]}).catch(e => {})
    
  } else {
    return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  Lütfen bir metin kanalı belirt!**")] }).catch(e => {})
  }
} else { 
return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  Bir kanal etiketlemen veya ID'sini yazman gerekli!**")] }).catch(e => {})
}}

exports.conf = {
  aliases: ["emojirol-kanal"]
}

exports.help = {
  name: "emoji-rol-kanal",
  description: "Emoji Rol Sistemi Ayarlarınızı Yapar.",
  usage: "emoji-rol-kanal <#kanal>",
  category: "emojirol"
}