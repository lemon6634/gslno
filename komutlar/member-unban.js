const Discord = require("discord.js");
const request = require("request");
exports.run = async (client, message, args) => {
  const embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
try {
let member = args[0]
const permission = message.member.permissions.has("BAN_MEMBERS");
if(!permission) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Bu komutu kullanmak için `Üyeleri Yasakla` yetkisine sahip olmalısın!**")] }).catch(e => {})
if(!args[0]) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bir üye ID'si yazman gerekli!**\nDoğru Kullanım: \`${prefix}unban <kullanıcı-id>\``)] }).catch(e => {})

request(
  {
    url: `https://discordapp.com/api/v8/users/${member}`,
    headers: {
      Authorization: `Bot ${client.ayarlar.token}`
    }
  },
  function(error, response, body) {
    if (error) return 
    else if (!error) {
      member = JSON.parse(body);

      if (!member.id) {
        return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Belirtilen ID'ye sahip bir discord kullanıcısı yok!**")] }).catch(e => {})
      }

    if (member.id === message.author.id) 
    return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Kendi kendine unban atamazsın!**`)] }).catch(e => {})

    message.guild.members.unban(member.id).then(cs => {
    return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  \`${member.username}\` **isimli kullanıcının yasağı başarıyla kaldırıldı!**`)] }).catch(e => {})
    }).catch(e => { message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210> **Bu kullanıcı zaten sunucudan yasaklı değil veya bu işlemi yapmaya yetkim yok!**")] }).catch(e => {})})
  
  }})
} catch(err) {
        message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bir hata var:** ${err}`)] }).catch(e => {})
      }
    
};
exports.conf = {
  aliases: ["un-ban"]
};

exports.help = {
  name: "unban",
  description: "İstediğiniz Kişiyi Sunucudan Unbanlar.",
  usage: "unban <kullanıcı>",
  category: "moderasyon"
};
