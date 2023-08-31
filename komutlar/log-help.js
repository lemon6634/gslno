const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args) => {

    const embed = new MessageEmbed()
            .setTitle("__MOD LOG SİSTEMİ__")
            .setAuthor({ name: "" })
            .setDescription(`Dunge Mod Log Sistemi`, client.user.displayAvatarURL())
            .addField('**⚡️Mod Log**', '> Sunucunuzda olan bitenleri kayıt alır.')
            .addFields(
                //{ name: '\u200B', value: '\u200B' },
                { name: '**⚡️Peki Nasıl Ayarlarım?**', value: '``?modlog ayarla #kanal``\n ``?kanallog ayarla #kanal``\n ``?rollog ayarla #kanal``\n ``?seslog ayarla #kanal``\n ``?mesajlog ayarla #kanal``', inline: true },
                { name: '**⚡️Peki Nasıl Kapatacağım?**', value: '``?modlog sıfırla``\n ``?kanallog sıfırla``\n ``?rollog sıfırla``\n ``?seslog sıfırla``\n ``?mesajlog sıfırla``', inline: true },
            )
            .setColor("YELLOW")
        message.reply({ embeds: [embed] })

}
module.exports.conf = {
  aliases: ["logyardım"]
};

module.exports.help = {
  name: "log-yardım",
  description: "Mod-Log kanalını ayarlar.",
  usage: "modlog",
  category: "moderasyon"
};