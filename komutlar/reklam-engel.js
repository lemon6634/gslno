const Discord = require('discord.js')
const db = require("orio.db")

exports.run = async (client, message, args) => {

    const embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek için \`Yönetici\` iznine sahip olmalısın!**`)] }).catch(e => { })

  if(args[0] === "ayarla-kanal"){
await db.set('reklamkanal_'+message.guild.id+message.channel.id, "Online") 
message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Reklam engelleme sistemi <#${message.channel.id}> kanalında açıldı! **`)] }).catch(e => { }) 
} else {
    if(args[0] === "ayarla-sunucu"){
        await db.set('reklam_'+message.guild.id, "Online") 
        message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Reklam engelleme sistemi tüm kanallarda açıldı! **`)] }).catch(e => { })
    } else {
if(args[0] === "sıfırla-kanal"){
    message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Reklam engelleme sistemi <#${message.channel.id}> kanalında kapatıldı!**`)] }).catch(e => { })
await db.delete('reklamkanal_'+message.guild.id+message.channel.id) 
  
} else {
    if(args[0] === "sıfırla-sunucu"){
        message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Reklam engelleme sistemi tüm kanallarda kapatıldı! **`)] }).catch(e => { })
        await db.delete('reklam_'+message.guild.id) 
          
} else {
    let reklamkk = db.get(`reklam_${message.guild.id}`)
    const tntmmesj = new Discord.MessageEmbed()
    .setColor('YELLOW')
    .setTitle("<:cross:980410756484956210>  **Bir ayar belirtmelisin!**")
    .setDescription(`Bilgi: **?reklam-engel ayarla-kanal** komutu, komutu kullandığınız kanalda sistemi aktif eder.`)
    .addFields(
        { name: "**⚡️Peki Nasıl Ayarlarım?**", value: "`?reklam-engel ayarla-kanal\n?reklam-engel ayarla-sunucu`", inline: true },
        { name: "**⚡️Peki Nasıl Kapatacağım?**", value: "`?reklam-engel sıfırla-kanal\n?reklam-engel sıfırla-sunucu`", inline: true },
    )
return message.reply({ embeds: [tntmmesj] })}}}}
}    

exports.conf = {
    aliases: ["reklamengel"]
}

exports.help = {
    name: 'reklam-engel',
    description: 'Sunucuya Reklam Atınca Uyarma Sistemini Ayarlar.',
    usage: 'reklam-engel ayarla-kanal & reklam-engel ayarla-sunucu & reklam-engel sıfırla-kanal & reklam-engel sıfırla-sunucu',
    category: 'moderasyon'
}
    