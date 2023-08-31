const Discord = require('discord.js')
exports.run = async (client, message, args) => {
  const embed = new Discord.MessageEmbed()
   .setColor("YELLOW")

  const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;

  if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek için \`SUNUCUYU YÖNET\` iznine sahip olmalısın!**`)] }).catch(e => { })

  let voteChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
  if (!voteChannel) return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bir kanal etiketlemen gerekli!**\n\n<:info:980410756145242133>  **Doğru Kullanım:** \`${prefix}oylama #kanal <oylama-metni>\``)] }).catch(e => { })

  let voteContent = args.slice(1).join(' ');
  if (!voteContent) return message.channel.send({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bir oylama metni belirt!**\n\n<:info:980410756145242133>  **Doğru Kullanım:** \`${prefix}oylama #kanal <oylama-metni>\``)] }).catch(e => { })

  const embed2 = new Discord.MessageEmbed()
    .setColor('BLUE')
    .setTitle('Oylama Zamanı!')
    .setDescription(voteContent)
    .setFooter({ text: `Oylama Başladı!` })
  voteChannel.send({ embeds: [embed2] }).then(async cs => {
    await cs.react('<:correct:980410756187185172>').catch(e => { })
    await cs.react('<:cross:980410756484956210>').catch(e => { })
    await cs.react('🤷').catch(e => { })
  }).catch(e => { })

}

exports.conf = {
  aliases: ['oyla']
}

exports.help = {
  name: 'oylama',
  description: 'Oylama Yapar.',
  usage: 'oylama <#kanal> <oylama-metni>',
  category: 'moderasyon'
}
