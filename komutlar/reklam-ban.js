const Discord = require('discord.js')
const db = require("orio.db")

exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
   .setColor("YELLOW")
const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek için \`YÖNETİCİ\` iznine sahip olmalısın!**`)] }).catch(e => {})

  if(args[0] === "ayarla-kanal"){
await db.set('reklambankanal_'+message.guild.id+message.channel.id, "Online") 
message.channel.send({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Reklam yapanı 3 uyarıdan sonra banlama sistemi <#${message.channel.id}> kanalında aktifleştirildi!**`)] }).catch(e => {})
 
} else {
    if(args[0] === "ayarla-sunucu"){
        await db.set('reklamban_'+message.guild.id, "Online") 
        message.channel.send({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Reklam yapanı 3 uyarıdan sonra banlama sistemi tüm kanallarda aktifleştirildi!**`)] }).catch(e => {})
    } else {
if(args[0] === "sıfırla-kanal"){
message.channel.send({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Reklam yapanı 3 uyarıdan sonra banlama sistemi <#${message.channel.id}> kanalında deaktifleştirildi!**`)] }).catch(e => {})
await db.delete('reklambankanal_'+message.guild.id+message.channel.id) 
  
} else {
    if(args[0] === "sıfırla-sunucu"){
        message.channel.send({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Reklam yapanı 3 uyarıdan sonra banlama sistemi tüm kanallarda deaktifleştirildi!**`)] }).catch(e => {})
        await db.delete('reklamban_'+message.guild.id) 
          
} else {
   return message.reply({ embeds: [embed.setDescription("`"+prefix+"reklam-ban ayarla-kanal & "+prefix+"reklam-ban ayarla-sunucu` veya `"+prefix+"reklam-ban sıfırla-kanal & "+prefix+"reklam-ban sıfırla-sunucu` **yazmalısın!**")] }).catch(e => {})
}}}}
}    

exports.conf = {
    aliases: ["reklamban"]
}

exports.help = {
    name: 'reklam-ban',
    description: 'Reklam Ban Sistemi',
    usage: 'reklam-ban ayarla-kanal & reklam-ban ayarla-sunucu',
    category: 'moderasyon'
}
    