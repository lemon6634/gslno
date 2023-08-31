const Discord = require("discord.js");
exports.run = async (client, message, args) => {
  const embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
try {
const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
const permission = message.member.permissions.has("BAN_MEMBERS");
if(!permission) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Bu komutu kullanabilmek için `Üyeleri Yasakla` yetkisine sahip olmalısın!**")] }).catch(e => {})
if(!args[0]) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bir üye etiketlemen gerekli!**\nDoğru Kullanım: \`${prefix}ban @Kullanıcı\``)] }).catch(e => {})
if(!member) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Kullanıcı bulunamadı!**`)] }).catch(e => {})

    if (member.id === message.author.id) 
    return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Kendi kendini banlayamazsın!**`)] }).catch(e => {})

    if(message.member.roles.highest.position < member.roles.highest.position && !message.author.id === message.guild.ownerID)
    return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu kullanıcıyı banlayabilmek için onun üstünde olmalısın!**`)] }).catch(e => {})
    
    if(!member.bannable) 
    return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu kullanıcıyı banlayabilmem için ondan üstün olmam gerekli!**`)] }).catch(e => {})

    return (
      (await member.ban({ reason: `Sebep: ${args.slice(1).join(" ") || "yok"} (Banlayan: ${message.author.tag})`})) +
      message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  \`${member.user.username}\` **kullanıcısı başarıyla banlandı!**`)] }).catch(e => {})
    );
      } catch(err) {
        message.reply({ embeds: [embed.setDescription(`<:blocked:980410756099080202>  **Bir Hata Var:** ${err}`)] }).catch(e => {})
      }

};
exports.conf = {
  aliases: ["Ban"]
};

exports.help = {
  name: "ban",
  description: "İstediğiniz Kişiyi Sunucudan Banlar.",
  usage: "ban <kullanıcı> [sebep]",
  category: "moderasyon"
};
