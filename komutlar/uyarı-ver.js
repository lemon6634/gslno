const Discord = require("discord.js");
const db = require('orio.db');
exports.run = async (client, message, args) => {
  const embed = new Discord.MessageEmbed()
   .setColor("YELLOW")

  if(!message.member.permissions.has("MANAGE_GUILD")) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Bu komutu kullanabilmek için `Sunucuyu Yönet` yetkisine sahip olmalısın!**")] }).catch(e => {})

  let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
  if(!user) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Uyarı vereceğim üyeyi etiketle veya id belirt!**")] }).catch(e => {})
  let reason = args.slice(1).join(' ');
  if(!reason) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Uyarılacak kişinin uyarılma sebebini yazmalısın!**")] }).catch(e => {})

let warnid = db.get(message.guild.id+user.id+".warns")
if(warnid && !warnid == 0){
  warnid = warnid.length+1
} else {
  warnid = 1
}

await db.push(`${message.guild.id}${user.id}.warns`, {
  id: "#"+warnid,
  user: user.id,
  reason: reason,
  time: Date.now(),
  moderator: message.author.id
})



    const embed2 = new Discord.MessageEmbed()
    .setTitle("Uyarı Atıldı!")
    .setDescription(`<:correct:980410756187185172>  ${user} adlı kullanıcıya **${reason}** sebebi ile uyarı verildi. Toplam uyarı sayısı **${db.get(message.guild.id+user.id+".warns").length || 1}** oldu.`)
    .setColor("GREEN")
    .setTimestamp()
    return message.channel.send({embeds : [embed2]}).catch(e => {})

};
exports.conf = {
  aliases: ["warn"]
};

exports.help = {
  name: "uyar",
  description: "Kullanıcıyı uyarır.",
  usage: "uyar <@kullanıcı> <sebep>",
  category: "moderasyon"
};
