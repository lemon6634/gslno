const Discord = require('discord.js')
const db = require("croxydb")

exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
   .setColor("YELLOW")
const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek İçin \`YÖNETİCİ\` iznine sahip olmalısın!**`)] }).catch(e => {})

  if(args[0] === "ayarla"){
    const data = db.get(`ototag_${message.guild.id}`)
    if(data){
    return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Otomatik isme tag ekleme sistemi zaten ayarlı!`)] }).catch(e => {})
    }
    
  let channel = message.mentions.channels.first()
    if (!channel) {
        return message.channel.send({ embeds: [embed.setDescription('<:cross:980410756484956210>  **Log kanalı belirt!**\nKullanım: `'+prefix+'oto-tag ayarla #kanal <tag>`')] }).catch(e => {})
    }
    let tag = args[2]
    if(!tag) return message.channel.send({ embeds: [embed.setDescription('<:cross:980410756484956210>  **Tag belirt!**\nKullanım: `'+prefix+'oto-tag ayarla #kanal <tag>`')] }).catch(e => {})

await db.set('ototag_'+message.guild.id, { 
    log: channel.id,
    tag: tag
    }) 
message.channel.send({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Otomatik isme tag ekleme kanalı ${channel} olarak ayarlandı ve oto tag \`${tag}\` olarak seçildi!**`)] }).catch(e => {})
 
} else {
  
if(args[0] === "sıfırla"){
    const data = db.get(`ototag_${message.guild.id}`)
if(!data){
return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Otomatik isme tag ekleme sistemi zaten ayarlı değil!**`)] }).catch(e => {})
}

message.channel.send({ embeds: [embed.setDescription('Otomatik İsme Tag Ekleme Sıfırlandı!')] }).catch(e => {})
await db.delete('ototag_'+message.guild.id)
  
} else {
   return message.reply({ embeds: [embed.setDescription("`"+prefix+"oto-tag ayarla #kanal *(tagınız)` veya `"+prefix+"oto-tag sıfırla` **yazmalısın!**")] }).catch(e => {})
}}}    

exports.conf = {
    aliases: ["ototag"]
}

exports.help = {
    name: 'oto-tag',
    description: 'Sunucuya Otomatik İsme Tag Ekleme Sistemini Ayarlar.',
    usage: 'oto-tag ayarla #kanal *(tagınız)',
    category: 'moderasyon'
}
    