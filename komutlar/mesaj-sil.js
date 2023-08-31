const Discord = require('discord.js');

exports.run = async(client, message, args) => {
  const embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
  if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek için \`Mesajları Yönet\` iznine sahip olmalısın!**`)] }).catch(e => {})

  const sayi = args[0]

  if (!sayi) {
    return message.reply({ embeds: [embed.setDescription("En az `1 - 100` arasında bir tam sayı değeri girmelisiniz." )] }).catch(e => {})
  }

  if(isNaN(sayi)) return message.reply({ embeds: [embed.setDescription("Bir sayı değeri girmelisiniz." )] }).catch(e => {})
  if (sayi > 101) return message.reply({ embeds: [embed.setDescription("En az `1 - 100` arasında bir tam sayı değeri girmelisiniz." )] }).catch(e => {})


  await message.channel.messages.fetch({limit: sayi}).then(messages => {
    message.channel.bulkDelete(messages).catch(e => {})
});
  
setTimeout(() => {
    message.channel.send({ embeds: [embed.setDescription(`<@${message.author.id}> **${sayi}** adet mesaj boşluğa atıldı. :rocket:`)] }).then(cs => {
      cs.delete().catch(e => {})
    }).catch(e => {})
  }, 2000)
};

exports.conf = {
  aliases: ["mesaj-sil","temizle", "clear"]
};

exports.help = {
  name: 'sil',
  description: 'Belirlenen Mesaj Sayısını Siler.',
  usage: 'mesaj-sil <sayı>',
  category: "moderasyon"
};