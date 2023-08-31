const Discord = require("discord.js");

module.exports.run = async(client,message,args) => {
  const embed = new Discord.MessageEmbed()
   .setColor("YELLOW")

  if(!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek için \`Yönetici\` iznine sahip olmalısın!**`)] });
let csc = message.channel
  
 message.channel.clone({ name: csc.name, permissions: csc.withPermissions, topic: csc.topic, bitrate: this.bitrate })
  message.channel.delete();
  
};
module.exports.conf = {
aliases:['nuke', 'kanal-nuke']
};
module.exports.help = {
  name: 'nuke',
  description: 'Yazdığınız kanalı siler tekrar kurar.(Temizleme)',
  usage: 'nuke',
  category: "moderasyon"
};