const Discord = require("discord.js");
const db = require("orio.db")
exports.run = async (client, message, args) => {
  const embed = new Discord.MessageEmbed()
    .setColor("YELLOW")
if(!message.member.permissions.has("MANAGE_GUİLD" && "MANAGE_ROLES")) return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  Bu komutu kullana bilmek için \`Sunucuyu Yönet\` ve \`Rolleri Yönet\` yetkilerine sahip olman gerekli!**")] }).catch(e => {})
if(db.get("reactions")){
if(args[0]){
let data = Object.entries(db.get("reactions."+message.guild.id)).filter(mr => mr[1].message == args[0]).map(me => me[1].message)
if(data){
await db.unpush("reactions."+message.guild.id,{message: args[0]})
if(db.get("reactions")){
if(Object.keys(db.get("reactions")).length == 0){
  await db.delete("reactions")
}}
return message.reply({ embeds: [embed.setDescription("> **<:correct:980410756187185172>  Belirtilen mesajdaki emojilere tıklayınca artık kimseye rol verilmeyecek veya alınmayacak!**")] }).catch(e => {})
} else {
return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  Belirtilen mesaj ID'si zaten sistemde yok!**")] }).catch(e => {})
}} else {
return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  Bir mesaj ID'si yazman gerekli!**\n> **Örnek: `"+client.prefix+"emoji-rol-sil <mesaj-id>`**")] }).catch(e => {})
}} else {
return message.reply({ embeds: [embed.setDescription("> **<:cross:980410756484956210>  Zaten hiç emoji rol verisi ayarlanmamış!**")] }).catch(e => {})
}
};
exports.conf = {
  aliases: ["emojirol-sil"]
};

exports.help = {
  name: "emoji-rol-sil",
  description: "Emoji Rol Verilerini Siler",
  usage: "emoji-rol-sil <mesaj-id>",
  category: "emojirol"
};
