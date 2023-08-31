const Discord = require("discord.js");
exports.run = async (client, message, args) => {
  const embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
try {
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
const permission = message.member.permissions.has("KICK_MEMBERS");
if(!permission) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Bu komutu kullanmak için `Üyeleri Yasakla` yetkisine sahip olmalısın!**")] }).catch(e => {})
if(!args[0]) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bir üye etiketlemen gerekli!**\nDoğru Kullanım: \`${prefix}kick @kullanıcı\``)] }).catch(e => {})
if(!member) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu kullanıcı bulunamadı!**`)] }).catch(e => {})

    if (member.id === message.author.id) 
    return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Kendi kendini atamazsın!**`)] }).catch(e => {})

    if(message.member.roles.highest.position < member.roles.highest.position && !message.author.id === message.guild.ownerID)
    return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu kullanıcıyı kicklemek için ondan üstte olmalısın!**`)] }).catch(e => {})
    
    if(!member.bannable) 
    return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu kullanıcıyı kicklemek için ondan üstte olmalısın!**`)] }).catch(e => {})

    return (
      (await member.kick([`Sebep: ${args.slice(1).join(" ") || "Yok"} (Kickleyen ${message.author.tag})`])) +
      message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  \`${member.user.username}\` **kullanıcısı başarıyla kicklendi!**`)] }).catch(e => {})
    )
      } catch(err) {
        message.reply(`Bir hata var: ${err}`).catch(e => {})
      }

};
exports.conf = {
  aliases: ["Kick"]
};

exports.help = {
  name: "kick",
  description: "İstediğiniz Kişiyi Sunucudan Atar.",
  usage: "kick <kullanıcı> [sebep]",
  category: "moderasyon"
};
