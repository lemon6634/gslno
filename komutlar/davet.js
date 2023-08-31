const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args) => {
    const row = new MessageActionRow()
    
    .addComponents(
        new MessageButton()
        .setLabel('Davet Et')
        .setEmoji("🤖")
        .setStyle('LINK')
        .setURL('https://discord.com/api/oauth2/authorize?client_id=985954125365801030&permissions=8&scope=bot%20applications.commands')
    )
    .addComponents(
        new MessageButton()
        .setStyle('LINK')
        .setEmoji("📞")
        .setURL("https://discord.gg/xt3uya3qYP")
        .setLabel('Destek Sunucusu')
    )
    .addComponents(
        new MessageButton()
        .setStyle('LINK')
        .setEmoji("🗳️")
        .setURL("https://discord.gg/xt3uya3qYP")
        .setLabel('Oy Ver')
    )
            const embed = new MessageEmbed()
            .setTitle("Dunge Bot")
            .setDescription(`<:ok:980417189444198460> [Dunge](https://discord.com/api/oauth2/authorize?client_id=985954125365801030&permissions=8&scope=bot%20applications.commands), sunucunu düzene sokmak ve korumak için gereken tüm özellikleri içinde barındıran özelleştirilebilir discord botudur.`)
            .setColor("YELLOW")
            message.reply({embeds:[embed],components: [row]})

};
module.exports.conf = {
  aliases: ["invite", "ekle"]
};

module.exports.help = {
  name: "davet",
  description: "Botun davet linkini atar.",
  usage: "davet",
  category: "bot"
};