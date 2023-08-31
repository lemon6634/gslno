const Discord = require("discord.js");
exports.run = async (client, message, args) => {

  let üyesayi = message.guild.memberCount;
  let botlar = message.guild.members.cache.filter(m => m.user.bot).size
  let kullanıcılar = üyesayi - botlar
  const embed = new Discord.MessageEmbed()
    .setColor(`BLUE`)
    .setTimestamp()
    .addField(`Toplam Üye`, `**${üyesayi}**`, true)
    .addField(`Kullanıcılar`, `**${kullanıcılar}**`, true)
    .addField(`Botlar`, `**${botlar}**`, true)
    .addField(`Üye Durumları`,`**${message.guild.members.cache.filter(o => o.presence?.status === "online").size}** Çevrimiçi
    **${message.guild.members.cache.filter(i => i.presence?.status === "idle").size}** Boşta
    **${message.guild.members.cache.filter(dnd => dnd.presence?.status === "dnd").size}** Rahatsız Etmeyin
    **${message.guild.members.cache.filter(off => off.presence?.status === "offline").size}** Çevrimdışı/Görünmez`, true)
    .setFooter({ text: `${message.author.username} tarafından istendi.`, iconURL: message.author.avatarURL() })
  message.channel.send({embeds: [embed]}).catch(e => {})
}

exports.conf = {
  aliases: ["üyedurumu", "üye"]
}

exports.help = {
  name: "üye-durumu",
  description: "Sunucuya ait üye sayısını gösterir.",
  usage: "üye-durumu",
  category: "kullanıcı"
}
