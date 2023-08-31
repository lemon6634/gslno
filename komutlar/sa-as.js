const Discord = require('discord.js')
const db = require("croxydb")

exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
   .setColor("YELLOW")
const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek için \`Yönetici\` iznine sahip olmalısın!**`)] }).catch(e => {})

  if(args[0] === "aç"){
    const data = db.get(`saas_${message.guild.id}`)
    if(data){
    return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Selam alma sistemi zaten açık!**`)] }).catch(e => {})
    }
    
await db.set('saas_'+message.guild.id, "Online")
message.channel.send({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Selam alma sistemi başarıyla açıldı!**`)] }).catch(e => {})
 
} else {
  
if(args[0] === "kapat"){
const data = db.get(`saas_${message.guild.id}`)
if(!data){
return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Selam alma sistemi zaten ayarlı değil!**`)] }).catch(e => {})
}

message.channel.send({ embeds: [embed.setDescription('<:correct:980410756187185172>  **Selam alma sistemi sıfırlandı!**')] }).catch(e => {})
await db.delete('saas_'+message.guild.id)
  
} else {
   return message.reply({ embeds: [embed.setDescription("`"+prefix+"sa-as aç` veya `"+prefix+"sa-as kapat` **yazmalısın!**")] }).catch(e => {})
}}}    

exports.conf = {
    aliases: ["saas"]
}

exports.help = {
    name: 'sa-as',
    description: 'Sunucuya Otomatik Selam Alma ve Verme Sistemini Ayarlar.',
    usage: 'sa-as ayarla #kanal',
    category: 'moderasyon'

}
    