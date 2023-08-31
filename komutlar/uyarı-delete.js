const Discord = require("discord.js");
const db = require('orio.db');
exports.run = async (client, message, args) => {
  const embed = new Discord.MessageEmbed()
   .setColor("YELLOW")

  if(!message.member.permissions.has("MANAGE_GUILD")) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Bu komutu kullanabilmek için `Sunucuyu Yönet` yetkisine sahip olmalısın!**")] }).catch(e => {})

  let user = message.mentions.users.first() || message.guild.members.cache.get(args[0])
  if(!user) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Uyarısını kaldıracağım üyeyi etiketle veya id belirt!**")] }).catch(e => {})
  let warnid = args[1]
  if(!warnid) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Silinecek uyarı numarası yazmalısın!**")] }).catch(e => {})
  if(isNaN(warnid)) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Uyarı numarası bir sayı olmalıdır!**")] }).catch(e => {})

let warnid2 = db.get(message.guild.id+user.id+".warns")
if(warnid2 && !warnid2 == 0){
  warnid2 = warnid.length
} else {
  warnid2 = 0
}
if(warnid2 == 0) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Bu kullanıcıya ait uyarı bulunmamaktadır!**")] }).catch(e => {})
if(warnid < warnid2) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Bu kullanıcının bu numarada uyarısı yok!**")] }).catch(e => {})
if(warnid < 1) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Uyarı numarası 1 den küçük olamaz!**")] }).catch(e => {})

  await db.unpush(`${message.guild.id}${user.id}.warns`, {
    id: "#"+warnid
  })

let warnid22 = db.get(message.guild.id+user.id+".warns")
if(warnid22){
  warnid22 = warnid22.length
} else {
  warnid22 = 0
}

    const embed2 = new Discord.MessageEmbed()
    .setTitle("Uyarı Silindi!")
    .setDescription(`<:correct:980410756187185172>  ${user} adlı kullanıcıya ait **${warnid}** numaralı uyarı silindi. Toplam uyarı sayısı **${warnid22}** oldu.`)
    .setColor("GREEN")
    .setTimestamp()
    return message.channel.send({embeds : [embed2]}).catch(e => {})

};
exports.conf = {
  aliases: ["warndelete","deletewarn","uyarısil"]
};

exports.help = {
  name: "uyarı-sil",
  description: "Kullanıcının uyarısını siler.",
  usage: "uyarı-sil <@kullanıcı> <uyarı numarası>",
  category: "moderasyon"
};
