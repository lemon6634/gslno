const {MessageEmbed} = require(`discord.js`)
exports.run = async (client, message, args) => {

  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
  let gify = member.displayAvatarURL({ dynamic: true }).includes(".gif") ? `**gif** [[512]](https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.gif?size=512) [[1024]](https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.gif?size=1024) [[2048]](https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.gif?size=2048)\n`  : ``
  let embed = new MessageEmbed()
  .setColor(`BLUE`)
  .setTitle(`${member.user.tag} Kullanıcısının Avatarı`)
  .setImage(member.displayAvatarURL({dynamic: true, size: 1024}))
  await message.reply({embeds: [embed] }).catch(e => {})


  }

exports.conf = {
    aliases: []
}

exports.help = {
    name: 'avatar',
    description: 'Kullanıcının Avatarını Gösterir!',
    usage: 'avatar',
    category: 'kullanıcı'

}