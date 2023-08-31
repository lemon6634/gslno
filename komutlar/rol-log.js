const Discord = require('discord.js');
const {JsonDatabase} = require("wio.db");
const db = new JsonDatabase({databasePath:"./croxydb/wiodb.json"});
exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
   .setColor("YELLOW")
let prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
if(!message.member.permissions.has("MANAGE_GUILD")) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Bu komutu kullanabilmek için `Sunucuyu Yönet` yetkisine sahip olman gerekli!**")] }).catch(e => {})

if(args[0] === "ayarla") {
const data = await db.get(`rollog_${message.guild.id}`)
if(data && message.guild.channels.cache.get(data)){
return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Rol-log kanalı zaten ayarlanmış!**` )] }).catch(e => {})
} 
let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
if(!channel) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Rol-log kanalı belirtmen gerekli!**\nÖrnek: \`${prefix}rol-log ayarla #kanal\`` )] }).catch(e => {})

    await db.set(`rollog_${message.guild.id}`, channel.id)
    const embedone = new Discord.MessageEmbed()
    .setTitle("Rol-log Ayarlandı")
    .setDescription(`<:correct:980410756187185172>  **Rol-log kanalı ${channel} olarak ayarlandı!**`)
    .setColor("BLUE")
    .setTimestamp()
    return message.channel.send({embeds : [embedone]}).catch(e => {})

} else {

if(args[0] === "sıfırla"){
const data = await db.get(`rollog_${message.guild.id}`)
if(!data) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Rol-log kanalı zaten ayarlanmamış!**` )] }).catch(e => {})

    await db.delete(`rollog_${message.guild.id}`)
    const embedtwo = new Discord.MessageEmbed()
    .setTitle("Rol-log Kanalı Sıfırlandı")
    .setDescription(`<:correct:980410756187185172>  **Rol-log kanalı başarıyla sıfırlandı!**`)
    .setColor("BLUE")
    .setTimestamp()
    return message.channel.send({embeds : [embedtwo]}).catch(e => {})

} else {
    return message.reply({ embeds: [embed.setDescription(`**Rol-log kanalı ayarlamak için** \`${prefix}rol-log ayarla #kanal\` veya \`${prefix}rol-log sıfırla\`` )] }).catch(e => {})
}}

}
exports.conf = {
    aliases: ["rollog"]
}
exports.help = {
    name: "rol-log",
    description: "Rol-log kanalını ayarlar.",
    usage: "rol-log <#kanal>",
}