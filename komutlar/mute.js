const Discord = require('discord.js')
const {JsonDatabase} = require("wio.db");
const db = new JsonDatabase({databasePath:"./croxydb/wiodb.json"});
const ms = require("ms")
exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
    .setColor("YELLOW")
const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
if(!message.member.permissions.has("BAN_MEMBERS")) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Bu komutu kullanmak için `Üyeleri Yasakla` yetkisine sahip olmalısın!**")] }).catch(e => {})

if(args[0] === "log"){
let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
if(!channel) return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bir kanal etiketlemen gerekli!**\nDoğru Kullanım: \`${prefix}mute log #kanal\``)] }).catch(e => {})

await db.set('mutelog_'+message.guild.id, channel.id) 
message.channel.send({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Mute Sistemi bu sunucuda açıldı!**`)] }).catch(e => {})

} else {

if(args[0] === "rol"){
const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
if(!role) return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bir Rol Etiketlemen Gerekli!**\nDoğru Kullanım: \`${prefix}mute rol @rol\``)] }).catch(e => {})

await db.set('muterol_'+message.guild.id, role.id)
message.channel.send({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Mute cezalı rolü bu sunucuda ayarlandı!**`)] }).catch(e => {})

} else {

const log = db.get('mutelog_'+message.guild.id)
if(!log && !message.guild.channels.cache.get(log)) return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Mute atmak için önce bir log kanalı ayarla!**\nKullanım: \`${prefix}mute log #kanal\``)] }).catch(e => {})
const rol = db.get('muterol_'+message.guild.id)
if(!rol && !message.guild.roles.cache.get(rol)) return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Mute atmak için cezalı rolü ayarla!**\nKullanım: \`${prefix}mute rol @rol\``)] }).catch(e => {})

const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if(!member) return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bir üye etiketlemen gerekli!**\nDoğru Kullanım: \`${prefix}mute @kullanıcı 1m sebep\``)] }).catch(e => {})

let time = args[1]
if(!time) return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bir süre belirtmen gerekli!**\nDoğru Kullanım: \`${prefix}mute @kullanıcı 1m sebep\``)] }).catch(e => {})

const reason = args.slice(2).join(" ") || "belirtilmemiş"

time = ms(time) / 1000
const slowmodeError3 = new Discord.MessageEmbed()
.setDescription(`<:cross:980410756484956210>  **Lütfen geçerli bir zaman yaz!**\n\nZaman Kavramları - h(saat), m(dakika), s(saniye)\n(Örnek -  ${prefix}mute @kullanıcı 1m)`)
.setColor('RED')
if (isNaN(time)) {
return message.channel.send({embeds: [slowmodeError3]}).catch(e => {})
}

await member.roles.add(rol).catch(e => {
return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu üyeye cezalı rolü verilemedi, yeterli yetkiye sahip değilim!**`)] }).catch(e => {})
})
await member.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Size **${message.guild.name}** adlı sunucuda **${time} saniye** Boyunca,  **${reason}** nedeniyle mute atıldı!`)] }).catch(e => {})
await db.set(`muted_${message.guild.id}${member.id}`, {
date: Date.now(),
time: time*1000,
author: message.author.id,
role: rol,
log: log
})

const embed2 = new Discord.MessageEmbed()
.setColor('ORANGE')
.setTitle('Mute Atıldı!')
.setDescription(`<:correct:980410756187185172>  **${member.user.tag}** adlı üyeye **${time} saniye** boyunca, **${reason}** nedeniyle mute atıldı!`)
.setFooter({ text: `${message.author.tag} tarafından işlem yapıldı!` })
.setTimestamp()
message.guild.channels.cache.get(log).send({embeds: [embed2]}).catch(e => {})

}
}
}
exports.conf = {
    aliases: []
}
exports.help = {
    name: 'mute',
    description: 'İstediğiniz Kişiyi Mute Atar.',
    usage: 'mute @kullanıcı <süre> <sebep>',
    category: "moderasyon"
}