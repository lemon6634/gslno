const Discord = require('discord.js')
const db = require("orio.db")

exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
   .setColor("YELLOW")
const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek için \`Yönetici\` iznine sahip olmalısın!**`)] }).catch(e => {})

  if(args[0] === "ayarla-kanal"){
await db.set('reklamkickkanal_'+message.guild.id+message.channel.id, "Online") 
message.channel.send({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Reklam yapanı 3 uyarıdan sonra kickleme sistemi <#${message.channel.id}> adlı kanalda açıldı!**`)] }).catch(e => {})
 
} else {
    if(args[0] === "ayarla-sunucu"){
        await db.set('reklamkick_'+message.guild.id, "Online") 
        message.channel.send({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Reklam yapanı 3 uyarıdan sonra kickleme sistemi tüm kanallarda açıldı!**`)] }).catch(e => {})
    } else {
if(args[0] === "sıfırla-kanal"){
message.channel.send({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Reklam yapanı 3 uyarıdan sonra kickleme sistemi <#${message.channel.id}> adlı kanalda kapatıldı!**`)] }).catch(e => {})
await db.delete('reklamkickkanal_'+message.guild.id+message.channel.id) 
  
} else {
    if(args[0] === "sıfırla-sunucu"){
        message.channel.send({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Reklam yapanı 3 uyarıdan sonra kickleme sistemi tüm kanallarda açıldı! **`)] }).catch(e => {})
        await db.delete('reklamkick_'+message.guild.id) 
          
} else {
   return message.reply({ embeds: [embed.setDescription("`"+prefix+"reklam-kick ayarla-kanal & "+prefix+"reklam-kick ayarla-sunucu` veya `"+prefix+"reklam-kick sıfırla-kanal & "+prefix+"reklam-kick sıfırla-sunucu` **yazmalısın!**")] }).catch(e => {})
}}}}
}    

exports.conf = {
    aliases: ["reklamkick"]
}

exports.help = {
    name: 'reklam-kick',
    description: 'Reklam Kickleme Sistemini Açar/Kapatır.',
    usage: 'reklam-kick ayarla-kanal & reklam-kick ayarla-sunucu & reklam-kick sıfırla-kanal & reklam-kick sıfırla-sunucu',
    category: 'moderasyon'
}
    