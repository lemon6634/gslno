const Discord = require('discord.js')
const db = require("orio.db")

exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek için \`Yönetici\` iznine sahip olmalısın!**`)] }).catch(e => { })

  if(args[0] === "ayarla-kanal"){
await db.set('everkanal_'+message.guild.id+message.channel.id, "Online") 
message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Everyone engelleme sistemi <#${message.channel.id}> kanalında açıldı! **`)] }).catch(e => { })
 
} else {
    if(args[0] === "ayarla-sunucu"){
        await db.set('ever_'+message.guild.id, "Online") 
        message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Everyone engelleme sistemi tüm kanallarda açıldı! **`)] }).catch(e => { })
    } else {
if(args[0] === "sıfırla-kanal"){
    message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Everyone engelleme sistemi <#${message.channel.id}> kanalında kapatıldı!**`)] }).catch(e => { })
await db.delete('everkanal_'+message.guild.id+message.channel.id) 
  
} else {
    if(args[0] === "sıfırla-sunucu"){
        message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Everyone engelleme sistemi tüm kanallarda kapatıldı! **`)] }).catch(e => { })
        await db.delete('ever_'+message.guild.id) 
          
} else {
    const tntmmesj = new Discord.MessageEmbed()
    .setColor('YELLOW')
    .setTitle("<:cross:980410756484956210>  Bir ayar belirtmelisin!")
    .setDescription(`Bilgi: **?everyone-engel ayarla-kanal** komutu, komutu kullandığınız kanalda sistemi aktif eder.`)
    .addFields(
        { name: "**⚡️Peki Nasıl Ayarlarım?**", value: "`?everyone-engel ayarla-kanal\n?everyone-engel ayarla-sunucu`", inline: true },
        { name: "**⚡️Peki Nasıl Kapatacağım?**", value: "`?everyone-engel sıfırla-kanal\n?everyone-engel sıfırla-sunucu`", inline: true }
    )
return message.reply({ embeds: [tntmmesj] })}}}}
}    

exports.conf = {
    aliases: ["everyoneengel", "everengel", "ever-engel", "ever-hereengel", "everhere-engel", "hereengel", "here-engel"]
}

exports.help = {
    name: 'everyone-engel',
    description: 'Sunucuda EverAtılınca Uyarma Sistemini Ayarlar.',
    usage: 'everyone-engel ayarla-kanal & everyone-engel ayarla-sunucu & everyone-engel sıfırla-kanal & everyone-engel sıfırla-sunucu',
    category: 'moderasyon'
}
    