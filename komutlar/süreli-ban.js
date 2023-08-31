const Discord = require('discord.js')
const {JsonDatabase} = require("wio.db");
const db = new JsonDatabase({databasePath:"./croxydb/wiodb.json"});
const ms = require("ms")
exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
   .setColor("YELLOW")
const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
if(!message.member.permissions.has("BAN_MEMBERS")) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Bu komutu kullanmak için `Üyeleri Yasakla` yetkisine sahip olmalısın!**")] }).catch(e => {})

const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if(!member) return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bir üye etiketlemen gerekli!**\nDoğru Kullanım: \`${prefix}süreli-ban @kullanıcı 1m sebep\``)] }).catch(e => {})

let time = args[1]
if(!time) return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bir süre belirtmen gerekli!**\nDoğru Kullanım: \`${prefix}süreli-ban @kullanıcı 1m sebep\``)] }).catch(e => {})

let reason = args.slice(2).join(" ") 
if(!reason) return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bir sebep belirtmen gerekli!**\nDoğru Kullanım: \`${prefix}süreli-ban @kullanıcı 1m sebep\``)] }).catch(e => {})


time = ms(time) / 1000
const slowmodeError3 = new Discord.MessageEmbed()
.setDescription(`<:cross:980410756484956210>  **Lütfen geçerli bir zaman yaz!**\n\nZaman Kavramları - h(saat), m(dakika), s(saniye)\n(Örnek -  ${prefix}süreli-ban @kullanıcı 1m sebep)`)
.setColor('RED')
if (isNaN(time)) {
return message.channel.send({embeds: [slowmodeError3]}).catch(e => {})
}

if (member.id === message.author.id) 
return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Kendi kendini banlayamazsın!**`)] }).catch(e => {})

if(message.member.roles.highest.position < member.roles.highest.position && !message.author.id === message.guild.ownerID)
return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu kullanıcıyı banlayabilmek için onun üstünde olmalısın!**`)] }).catch(e => {})

if(!member.bannable) 
return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu kullanıcıyı banlayabilmem için ondan üstün olmam gerekli!**`)] }).catch(e => {})


await member.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  Size **${message.guild.name}** adlı sunucuda **${time} süre** boyunca,  ** ${reason || "belirtilmemiş"} ** nedeniyle süreli ban atıldı!`)] }).catch(e => {})

await db.set(`banned.${message.guild.id}${member.id}`, {
date: Date.now(),
time: time*1000,
user: member.id,
guild: message.guild.id
})

await member.ban({ reason: `Sebep: ${reason || "Yok"} (Banlayan: ${message.author.tag})`}).catch(e => {})
const embed2 = new Discord.MessageEmbed()
.setColor('YELLOW')
.setTitle('Ban Atıldı!')
.setDescription(`<:correct:980410756187185172>  **${member.user.tag}** adlı üyeye **${time} süre** boyunca, **${reason}** nedeniyle ban atıldı!`)
.setFooter({ text: `${message.author.tag} Tarafından işlem yapıldı!` })
.setTimestamp()
message.channel.send({embeds: [embed2]}).catch(e => {})


}
exports.conf = {
    aliases: ["forceban", "forceban"]
}
exports.help = {
    name: 'süreli-ban',
    description: 'İstediğiniz Kişiyi Süreli Banlar.',
    usage: 'süreli-ban @kullanıcı <süre> <sebep>',
    category: 'moderasyon'
}