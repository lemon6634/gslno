const { MessageEmbed } = require("discord.js");
const {JsonDatabase} = require("wio.db");
const db = new JsonDatabase({databasePath:"./croxydb/wiodb.json"});

module.exports.run = async (client, message, args) => {
  const embed = new MessageEmbed()
        .setColor("YELLOW")
  var sebep = args.slice(0).join("  ");
  
  let dcs15 = new MessageEmbed()
  .setTitle(`<:cross:980410756484956210>  AFK moduna geçmek için sebep belirtin!`)
  .setColor("RED")
  .setTimestamp()
  .setFooter({ text: message.guild.name });
    if (!sebep) return message.channel.send({ embeds: [dcs15] }).catch(e => {})



    await message.react("<:correct:980410756187185172>")
  
    db.set(`afk_${message.author.id}${message.guild.id}`, {
      sebep: sebep,
      oldName: message.member.displayName,
      time: Date.now(),
      server: message.guild.id
      })

         message.member.setNickname(`[AFK] ${message.member.displayName}`).catch(e => {})

         let dcs16 = new MessageEmbed()
        .setTitle(`<:correct:980410756187185172>  AFK moduna girdiniz!`)
        .setColor("GREEN")
        .setTimestamp()
        .setFooter({ text: message.guild.name });
       message.channel.send({ embeds: [dcs16] }).catch(e => {})
    

};
module.exports.conf = {
  aliases: []
};

module.exports.help = {
  name: "afk",
  description: "AFK Moduna Geçersiniz.",
  usage: "afk <sebep>",
  category: "kullanıcı"
};