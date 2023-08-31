const Discord = require('discord.js')
const db = require("orio.db")

exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek için \`Yönetici\` iznine sahip olmalısın!**`)] }).catch(e => { })

  if(args[0] === "ayarla-kanal"){
await db.set('linkkanal_'+message.guild.id+message.channel.id, "Online") 
message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Link engelleme sistemi <#${message.channel.id}> kanalında açıldı! **`)] }).catch(e => { })

} else {
    if(args[0] === "ayarla-sunucu"){
        await db.set('link_'+message.guild.id, "Online") 
        message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Link engelleme sistemi tüm kanallarda açıldı! **`)] }).catch(e => { })
    } else {
if(args[0] === "sıfırla-kanal"){
    message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Link engelleme sistemi <#${message.channel.id}> kanalında kapatıldı!**`)] }).catch(e => { })
    await db.delete('linkkanal_'+message.guild.id+message.channel.id) 
  
} else {
    if(args[0] === "sıfırla-sunucu"){
        message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Link engelleme sistemi tüm kanallarda kapatıldı! **`)] }).catch(e => { })
        await db.delete('link_'+message.guild.id) 
          
} else {
    const tntmmesj = new Discord.MessageEmbed()
    .setColor('YELLOW')
    .setTitle("<:cross:980410756484956210>  Bir ayar belirtmelisin!")
    .setDescription(`Bilgi: **?link-engel ayarla-kanal** komutu, komutu kullandığınız kanalda sistemi aktif eder.`)
    .addFields(
        { name: "**⚡️Peki Nasıl Ayarlarım?**", value: "`?link-engel ayarla-kanal\n?link-engel ayarla-sunucu`", inline: true },
        { name: "**⚡️Peki Nasıl Kapatacağım?**", value: "`?link-engel sıfırla-kanal\n?link-engel sıfırla-sunucu`", inline: true }
    )
return message.reply({ embeds: [tntmmesj] })
}}}}
}    

exports.conf = {
    aliases: ["linkengel"]
}

exports.help = {
    name: 'link-engel',
    description: 'Sunucuya Link Atınca Uyarma Sistemini Ayarlar.',
    usage: 'link-engel ayarla-kanal & link-engel ayarla-sunucu',
    category: 'moderasyon'
}
    