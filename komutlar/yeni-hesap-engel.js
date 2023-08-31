const Discord = require('discord.js')
const db = require("croxydb")

exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
   .setColor("YELLOW")
const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek için \`YÖNETİCİ\` iznine sahip olmalısın!**`)] }).catch(e => {})

  if(args[0] === "ayarla"){
    const data = db.get(`newaccount_${message.guild.id}`)
    if(data){
    return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Yeni hesap engel sistemi zaten ayarlı!**`)] }).catch(e => {})
    }
    
  let channel = message.mentions.channels.first()
    if (!channel) {
        return message.channel.send({ embeds: [embed.setDescription('<:cross:980410756484956210>  **Bir log kanalı belirtin!**\nKullanım: `'+prefix+'yeni-hesap-engel ayarla #kanal @rol`')] }).catch(e => {})
    }
    
let role = message.mentions.roles.first()
    if (!role) {
        return message.channel.send({ embeds: [embed.setDescription('<:cross:980410756484956210>  **Bir rol belirtin!**\nKullanım: `'+prefix+'yeni-hesap-engel ayarla #kanal @rol`')] }).catch(e => {})
    }

await db.set('newaccount_'+message.guild.id, {
    log: channel.id,
    role: role.id
}) 
return message.channel.send({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Yeni hesap engel log kanalı ${channel} olarak ayarlandı, verilecek rolse ${role} olarak ayarlandı!**`)] }).catch(e => {})
 
} else {
  
if(args[0] === "sıfırla"){
    const data = db.get(`newaccount_${message.guild.id}`)
if(!data){
return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Yeni hesap engel sistemi zaten ayarlı değil!**`)] }).catch(e => {})
}

message.channel.send({ embeds: [embed.setDescription('<:cross:980410756484956210>  **Yeni hesap engel sistemi başarıyla sıfırlandı!**')] }).catch(e => {})
await db.delete('newaccount_'+message.guild.id)
  
} else {
   return message.reply({ embeds: [embed.setDescription("`"+prefix+"yeni-hesap-engel ayarla #kanal @rol` veya `"+prefix+"yeni-hesap-engel sıfırla` **yazmalısın!**")] }).catch(e => {})
}}}    

exports.conf = {
    aliases: ["yenihesap-engel", "yeni-hesapengel", "yenihesapengel"]
}

exports.help = {
    name: 'yeni-hesap-engel',
    description: 'Yeni Hesap Engelleme Sistemini Ayarlar.',
    usage: 'yeni-hesap-engel ayarla #kanal @rol',
    category: "moderasyon"
}
    