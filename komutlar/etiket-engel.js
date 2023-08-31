const Discord = require('discord.js')
const db = require("croxydb")

exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek için \`YÖNETİCİ\` iznine sahip olmalısın!**`)] }).catch(e => {})

  if(args[0] === "ayarla"){
    const data = db.get(`etiketengel_${message.guild.id}`)
    if(data){
    return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Yetkililere etiket atınca uyarma sistemi zaten ayarlı!**`)] }).catch(e => {})
    }

    
await db.set('etiketengel_'+message.guild.id, "Online") 
message.channel.send({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Yetkililere etiket atınca uyarma sistemi bu sunucuda açıldı!**`)] }).catch(e => {})
 
} else {
  
if(args[0] === "sıfırla"){
const data = db.get(`etiketengel_${message.guild.id}`)
if(!data){
return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Yetkililere etiket atınca uyarma sistemi zaten ayarlı değil!**`)] }).catch(e => {})
}

message.channel.send({ embeds: [embed.setDescription('<:correct:980410756187185172>  **Yetkililere etiket atınca uyarma sistemi sıfırlandı!**')] }).catch(e => {})
await db.delete('etiketengel_'+message.guild.id)
  
} else {
   return message.reply({ embeds: [embed.setDescription("`"+prefix+"etiket-engel ayarla` veya `"+prefix+"etiket-engel sıfırla` yazmalısın!")] }).catch(e => {})
}}}    

exports.conf = {
    aliases: ["etiketengel"]
}

exports.help = {
    name: 'etiket-engel',
    description: 'Sunucuya Etiket Atınca Uyarma Sistemini Ayarlar.',
    usage: 'etiket-engel ayarla',
    category: 'moderasyon'
}
    