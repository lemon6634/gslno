const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
module.exports.run = async (client, message, args) => {
  const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;

  let buton = new MessageButton()
    .setStyle("PRIMARY")
    .setLabel("Moderasyon")
    .setEmoji("🛠️")
    .setCustomId("moderasyon")

  let buton1 = new MessageButton()
    .setStyle("SUCCESS")
    .setLabel("Kullanıcı")
    .setEmoji("💎")
    .setCustomId("kullanıcı")

  let buton2 = new MessageButton()
    .setStyle("SECONDARY")
    .setLabel("Bot")
    .setEmoji("⚙️")
    .setCustomId("bot")

  let buton4 = new MessageButton()
    .setStyle("SUCCESS")
    .setLabel("Koruma")
    .setEmoji("⚔️")
    .setCustomId("koruma")

  let buton5 = new MessageButton()
    .setStyle("DANGER")
    .setLabel("Özel")
    .setEmoji("🤩")
    .setCustomId("özel")


  let embed = new MessageEmbed()
    .setTitle("Dunge Bot")
    .setDescription(`<:ok:980417189444198460> [Dunge](https://discord.com/api/oauth2/authorize?client_id=985954125365801030&permissions=8&scope=bot%20applications.commands), sunucunu düzene sokmak ve korumak için gereken tüm özellikleri içinde barındıran gelişmiş discord botudur. Botu **davet etmek** için [tıkla!](https://discord.com/api/oauth2/authorize?client_id=985954125365801030&permissions=8&scope=bot%20applications.commands)\n\u200b`)
    .setColor("BLUE")
    .setFooter({text: `Developed by Lourity`, iconURL: client.user.displayAvatarURL()})
    .addFields(
      { name: "<:tac:980410756157833237> Moderasyon", value: "Yetkili komutlarını görüntülersiniz.\n\u200b", inline: true },
      { name: "<:member:980410754769502268> Kullanıcı", value: "Kullanıcı komutlarını gösterir.\n\u200b", inline: true },
      { name: "<:tac2:987095979436179517> Bot", value: "Bot hakkında bilgi alırsınız.", inline: true },
      { name: "<:guard:980410755461545985> Koruma", value: "Sunucunu güvene almanı sağlayan komutlar!", inline: true },
      { name: "<:star:980410756308799548> Özel", value: "Sunucunu özelleştirebileceğin komutlar!", inline: true }
    )

  message.channel.send({ embeds: [embed], components: [new MessageActionRow({ components: [buton, buton1, buton2, buton4, buton5,] })] }).then(async msg => {

    const filter = x => x.user.id === message.author.id
    let collector = msg.createMessageComponentCollector({ filter, time: 300000 })

    collector.on("collect", async button => {
      if (button.customId === "moderasyon") {

        let moderasyon = new MessageEmbed()
          .setTitle(`> Botun moderasyon komutları hakkında bilgi alırsınız!`)
          .setDescription(`\n${client.commands.filter(mr => mr.help.category === "moderasyon").map(cmd => `> **\`${prefix}${cmd.help.name}\`: \`${cmd.help.description}\`**`).join("\n")}`)
          .setColor("ORANGE")
        msg.edit({ embeds: [moderasyon], components: [new MessageActionRow({ components: [buton1, buton2, buton4, buton5,] })] }).catch(e => { })

      }

      if (button.customId === "kullanıcı") {

        let kullanıcı = new MessageEmbed()
          .setTitle(`> Botun kullanıcı komutları hakkında bilgi alırsınız!`)
          .setDescription(`\n${client.commands.filter(mr => mr.help.category === "kullanıcı").map(cmd => `> **\`${prefix}${cmd.help.name}\`: \`${cmd.help.description}\`**`).join("\n")}`)
          .setColor("ORANGE")

        msg.edit({ embeds: [kullanıcı], components: [new MessageActionRow({ components: [buton, buton2, buton4, buton5,] })] }).catch(e => { })

      }

      if (button.customId === "bot") {

        let bot = new MessageEmbed()
          .setTitle(`> Botun kendi özel komutları hakkında bilgi alırsınız!`)
          .setDescription(`\n${client.commands.filter(mr => mr.help.category === "bot").map(cmd => `> **\`${prefix}${cmd.help.name}\`: \`${cmd.help.description}\`**`).join("\n")}`)
          .setColor("ORANGE")

        msg.edit({ embeds: [bot], components: [new MessageActionRow({ components: [buton, buton1, buton4, buton5,] })] }).catch(e => { })

      }

      if (button.customId === "koruma") {

        let bot = new MessageEmbed()
          .setTitle(`> Botun sunucu koruma komutları hakkında bilgi alırsınız!`)
          .setDescription(`\n${client.commands.filter(mr => mr.help.category === "koruma").map(cmd => `> **\`${prefix}${cmd.help.name}\`: \`${cmd.help.description}\`**`).join("\n")}`)
          .setColor("ORANGE")

        msg.edit({ embeds: [bot], components: [new MessageActionRow({ components: [buton, buton1, buton2, buton5,] })] }).catch(e => { })

      }

      if (button.customId === "özel") {

        let bot = new MessageEmbed()
          .setTitle(`> Botun İnvite, Çekiliş ve Emoji Rol komutları hakkında bilgi alırsınız!`)
          // .addField("Seviye Komutları <:loading:980410754387816469>", `${client.commands.filter(mr => mr.help.category === "seviye").map(cmd => `> **\`${prefix}${cmd.help.name}\`: \`${cmd.help.description}\`**`).join("\n")}`)
          .addField("İnvite Komutları <:add:980410755453161523>", `${client.commands.filter(mr => mr.help.category === "invite").map(cmd => `> **\`${prefix}${cmd.help.name}\`: \`${cmd.help.description}\`**`).join("\n")}`)
          .setDescription(`**Emoji Rol Komutları** <:star:980410756308799548>\n${client.commands.filter(mr => mr.help.category === "emojirol").map(cmd => `> **\`${prefix}${cmd.help.name}\`: \`${cmd.help.description}\`**`).join("\n")}`)
          .addField("Çekiliş Komutları <:gift:982667082896392232> (Slash Komutları)", `${client.commandss.map(cmd => `> **\`/${cmd.name}\`: \`${cmd.description}\`**`).join("\n")}`)
          .setColor("ORANGE")

        msg.edit({ embeds: [bot], components: [new MessageActionRow({ components: [buton, buton1, buton2, buton4,] })] }).catch(e => { })

      }

      button.deferUpdate();
    })

  }).catch(e => { })
};
module.exports.conf = {
  aliases: ["help", "yadrım", "yardim", "yardm"]
};
module.exports.help = {
  name: "yardım"
};