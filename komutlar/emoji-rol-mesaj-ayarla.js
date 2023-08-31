const Discord = require("discord.js");
const db = require("orio.db")
exports.run = async (client, message, args) => {
  const embed = new Discord.MessageEmbed()
    .setColor("YELLOW")
if(!message.member.permissions.has("MANAGE_GUİLD" && "MANAGE_ROLES")) return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  Bu komutu kullana bilmek için \`Sunucuyu Yönet\` ve \`Rolleri Yönet\` yetkilerine sahip olman gerekli!**")] }).catch(e => {})

const channel = db.get("channels-"+message.guild.id)
if(channel){
if(message.guild.channels.cache.get(channel)){
  
message.guild.channels.cache.get(channel).messages.fetch(args[0]).then(async msg => {
if(!msg) return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  Geçerli bir mesaj ID'si yazman gerekli, girilen mesaj <#"+channel+"> isimli kanalda bulunamadı!**")] }).catch(e => {})
if(msg){
  
await db.set("messages-"+message.guild.id, msg.id)
  const cse = new Discord.MessageEmbed()
 .setTitle(message.guild.name+" Emoji Rol Sistemi")
 .setColor("BLUE")
 .setThumbnail(client.user.displayAvatarURL())
 .setDescription("> **<:correct:980410756187185172>  Başarılı emoji eklenecek mesaj ayarlandı! ([Mesaja Git]("+msg.url+"))**")
 .setTimestamp()
 .setFooter({text: "Bir Lourity harikası.." })
  return message.channel.send({embeds : [cse]}).catch(e => {})
    
} else {
return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  Geçerli bir mesaj ID'si yazman gerekli, girilen mesaj <#"+channel+"> isimli kanalda bulunamadı!**")] }).catch(e => {})
}}).catch(e => {
   return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  Geçerli bir mesaj ID'si yazman gerekli, girilen mesaj <#"+channel+"> isimli kanalda bulunamadı!**")] }).catch(e => {})
})
} else {
return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  İlk önce emoji eklenecek mesajın bulunduğu kanalı ayarlamanız gerekir!**\n> **Örnek: \`"+client.prefix+"emoji-rol-kanal <#kanal>\`**")] }).catch(e => {})
}} else {
return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  İlk önce emoji eklenecek mesajın bulunduğu kanalı ayarlamanız gerekir!**\n> **Örnek: \`"+client.prefix+"emoji-rol-kanal <#kanal>\`**")] }).catch(e => {})
}}

exports.conf = {
  aliases: ["emojirol-mesaj"]
}

exports.help = {
  name: "emoji-rol-mesaj",
  description: "Emoji Rol Sistemi Ayarlarınızı Yapar.",
  usage: "emoji-rol-mesaj <mesaj-id>",
  category: "emojirol"
}