const Discord = require('discord.js')
const db = require("croxydb")

exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
   .setColor("YELLOW")
const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek için \`Yönetici\` iznine sahip olmalısın!**`)] }).catch(e => {})

  if(args[0] === "ayarla"){
    const data = db.get(`rggiris_${message.guild.id}`)
    if(data){
    return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Resimli güvenlik sistemi zaten ayarlı!`)] }).catch(e => {})
    }
    
  let channel = message.mentions.channels.first()
    if (!channel) {
        message.channel.send({ embeds: [embed.setDescription('<:cross:980410756484956210>  Kullanım: `'+prefix+'resimli-güvenlik ayarla #kanal`')] }).catch(e => {})
    } else {
    
await db.set('rggiris_'+message.guild.id, channel.id) 
message.channel.send({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Resimli güvenlik kanalı ${channel} olarak ayarlandı!**`)] }).catch(e => {})
    }
} else {
  
if(args[0] === "sıfırla"){
    const data = db.get(`rggiris_${message.guild.id}`)
if(!data){
return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Resimli güvenlik sistemi zaten ayarlı değil!`)] }).catch(e => {})
}

message.channel.send({ embeds: [embed.setDescription('<:correct:980410756187185172>  **Resimli güvenlik giriş kanalı sıfırlandı!**')] }).catch(e => {})
await db.delete('rggiris_'+message.guild.id)
  
} else {
   return message.reply({ embeds: [embed.setDescription("`"+prefix+"resimli-güvenlik ayarla #kanal` veya `"+prefix+"resimli-güvenlik sıfırla` Yazmalısın!")] }).catch(e => {})
}}}    

exports.conf = {
    aliases: ["resimligüvenlik", "güvenlik"]
}

exports.help = {
    name: 'resimli-güvenlik',
    description: 'Sunucuya Girenlerin Güvenliğini Gösterir.',
    usage: 'resimli-güvenlik ayarla',  
    category: 'moderasyon'
}
    