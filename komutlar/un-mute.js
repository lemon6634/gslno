const Discord = require('discord.js')
const {JsonDatabase} = require("wio.db");
const db = new JsonDatabase({databasePath:"./croxydb/wiodb.json"});

exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
   .setColor("YELLOW")
const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
if(!message.member.permissions.has("BAN_MEMBERS")) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Bu komutu kullanmak için `Üyeleri Yasakla` yetkisine sahip olmalısın!**")] }).catch(e => {})

const log = db.get('mutelog_'+message.guild.id)
if(!log && !message.guild.channels.cache.get(log)) return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Mute atmak için önce log kanalı ayarla!**\nKullanım: \`${prefix}mute log #kanal\``)] }).catch(e => {})
let rol = db.get('muterol_'+message.guild.id)
if(!rol && !message.guild.roles.cache.get(rol)) return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Mute atmak için önce cezalı rolü ayarla!**\nKullanım: \`${prefix}mute rol @rol\``)] }).catch(e => {})


const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if(!member) return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bir üye etiketlemen gerekli!**\nDoğru Kullanım: \`${prefix}un-mute @kullanıcı\``)] }).catch(e => {})

const reason = args.slice(2).join(" ") || "Sebep Belirtilmedi!"
rol = message.guild.roles.cache.get(rol)

const data = db.get(`muted_${message.guild.id}${member.id}`)
if(!data && !member.roles.cache.has(rol.id)) return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu üyenin mute durumu yok!**`)] }).catch(e => {})

await member.roles.remove(rol.id).catch(e => {
return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **İşlemi gerçekleştiremedim çünkü yetkim yok.**`)] }).catch(e => {})
})

await member.send({ embeds: [embed.setDescription(`<:correct:980410756187185172>  Size **${message.guild.name}** adlı sunucuda verilen ceza \`${message.author.tag}\` tarafından kaldırıldı!`)] }).catch(e => {})
await db.delete(`muted_${message.guild.id}${member.id}`)

const embed2 = new Discord.MessageEmbed()
.setColor('ORANGE')
.setTitle('Mute Kaldırıldı!')
.setDescription(`<:correct:980410756187185172>  **${member.user.tag}** adlı üyeye verilen ceza <@${message.author.id}> tarafından kaldırıldı!`)
.setFooter({ text: `${message.author.tag} Tarafından İşlem Yapıldı!` })
.setTimestamp()
message.guild.channels.cache.get(log).send({embeds: [embed2]}).catch(e => {})


}
exports.conf = {
    aliases: ["unmute"]
}
exports.help = {
    name: 'un-mute',
    description: 'Mute Kaldırır.',
    usage: 'un-mute', 
    category: 'moderasyon'
}