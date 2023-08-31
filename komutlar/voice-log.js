const Discord = require('discord.js');
const {JsonDatabase} = require("wio.db");
const db = new JsonDatabase({databasePath:"./croxydb/wiodb.json"});
exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
   .setColor("YELLOW")
let prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
if(!message.member.permissions.has("MANAGE_GUILD")) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Bu komutu kullanabilmek için `Sunucuyu Yönet` yetkisine sahip olman gerekli!**")] }).catch(e => {})

if(args[0] === "ayarla") {
const data = await db.get(`seslog_${message.guild.id}`)
if(data && message.guild.channels.cache.get(data)){
return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Ses-log kanalı zaten ayarlanmış!` )] }).catch(e => {})
} 
let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
if(!channel) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Ses-log kanalı belirtmen gerekli!**\nÖrnek: \`${prefix}rol-log ayarla #kanal\`` )] }).catch(e => {})

    await db.set(`seslog_${message.guild.id}`, channel.id)
    const embed = new Discord.MessageEmbed()
    .setTitle("Ses-log Ayarlandı")
    .setDescription(`<:correct:980410756187185172>  **Ses-log kanalı ${channel} olarak ayarlandı!**`)
    .setColor("BLUE")
    .setTimestamp()
    return message.channel.send({embeds : [embed]}).catch(e => {})

} else {

if(args[0] === "sıfırla"){
const data = await db.get(`seslog_${message.guild.id}`)
if(!data) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Ses-log kanalı zaten ayarlanmamış!**` )] }).catch(e => {})

    await db.delete(`seslog_${message.guild.id}`)
    const embed = new Discord.MessageEmbed()
    .setTitle("Ses-log Kanalı Sıfırlandı")
    .setDescription(`<:correct:980410756187185172>  **Ses-log kanalı başarıyla sıfırlandı!**`)
    .setColor("BLUE")
    .setTimestamp()
    return message.channel.send({embeds : [embed]}).catch(e => {})

} else {
    return message.reply({ embeds: [embed.setDescription(`Ses-log kanalı ayarlamak için \`${prefix}ses-log ayarla #kanal\` veya \`${prefix}ses-log sıfırla\`` )] }).catch(e => {})
}}

}
exports.conf = {
    aliases: ["seslog"]
}
exports.help = {
    name: "ses-log",
    description: "Ses-log kanalını ayarlar.",
    usage: "ses-log <#kanal>",
}