const { MessageEmbed } = require("discord.js");
module.exports.run = async (client, message, args) => {
  let csm = message.mentions.members.first() || message.member

  const a = "`"
  let csd = message.guild.members.cache.filter(mr => mr.joinedTimestamp < csm.joinedTimestamp).size + 1

  let cse = new MessageEmbed()
    .setTitle(a + csm.user.tag + a + " Hakkında")
    .setThumbnail(csm.user.avatarURL())
    .setColor("BLUE")
    .addField("Kullanıcı İsmi", a + csm.user.username + a)
    .addField("ID", a + csm.user.id + a)
    .addField("Hesap Oluşturulma Tarihi", "<t:" + Math.floor(csm.user.createdTimestamp / 1000) + ":F>")
    .addField("Sunucuya Katılma Tarihi", "<t:" + Math.floor(csm.joinedTimestamp / 1000) + ":F>")
    .addField("Sunucuya Katılma Sırası", a + csd + a)
    .addField("Roller", `**Rol Sayısı: ${a + csm.roles.cache.size + a}\nRol İsimleri: ${csm.roles.cache.map(cs => cs).join(", ")}**`)
    .setTimestamp()
  message.channel.send({ embeds: [cse] }).catch(e => { })

}
module.exports.conf = {
  aliases: ["kullanıcıbilgi"]
}

module.exports.help = {
  name: "kullanıcı-bilgi",
  description: "Kullanıcının Bilgilerini Gösterir!",
  usage: "kullanıcı-bilgi",
  category: "kullanıcı"
}
