const {
  MessageEmbed,
  MessageButton,
  MessageSelectMenu,
  MessageActionRow,
  Permissions,
} = require("discord.js");
const db = require("orio.db");

module.exports.run = async (client, message, args) => {
  const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
    

  if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
    return message
      .reply({
        content: `> <:cross:980410756484956210>  **Başarısız!** Bu komutu kullanamazsın **Yönetici** iznin bulunmuyor.`,
        allowedMentions: { repliedUser: false },
      })
      .catch((err) => {});

  let giriş = db.get("inviteJoinLog__" + message.guild.id);
  let çıkış = db.get("inviteLeaveLog__" + message.guild.id);

  let log;
  const etiket = message.mentions.channels.first();
  const id = message.guild.channels.cache.get(args[0]);
  const isim = message.guild.channels.cache.find(
    (m) => m.name === args.slice(0).join(" ")
  );
  if (etiket) {
    log = etiket;
  }
  if (id) {
    log = id;
  }
  if (isim) {
    log = isim;
  }

  let embed = new MessageEmbed()
    .setTitle("<:cross:980410756484956210>  Başarısız")
    .setDescription(`> Lütfen ne yapmak istediğnizi belirtin. Örnekler;`)
    .addField(
      "Davet Giriş ↷",
      `\`\`\`${prefix}davetlog giriş #kanal\n${prefix}davetlog giriş sıfırla\`\`\``
    )
    .addField(
      "Davet Çıkış ↷",
      `\`\`\`${prefix}davetlog çıkış #kanal\n${prefix}davetlog çıkış sıfırla\`\`\``
    )
    .setColor("AQUA");

  if (!args[0])
    return message
      .reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
      .catch((err) => {});

  if (args[0] === "giriş") {
    if (args[1] === "sıfırla" || args[1] === "reset") {
      if (!giriş)
        return message
          .reply({
            content: `> <:cross:980410756484956210>  **Başarasız!** Zaten davet giriş kanalı ayarlanmamış. **Ayarlamak için:** \`${prefix}davetlog giriş #kanal\``,
            allowedMentions: { repliedUser: false },
          })
          .catch((err) => {});

      message
        .reply({
          content: `> <:correct:980410756187185172>  **Başarılı!** Davet giriş kanal sıfırlandı! **Tekrar ayarlamak için:** \`${prefix}davetlog giriş #kanal\``,
          allowedMentions: { repliedUser: false },
        })
        .catch((err) => {});
      await db.delete("inviteJoinLog__" + message.guild.id);

      return;
    }

    if (giriş)
      return message
        .reply({
          content: `> <:cross:980410756484956210>  **Başarasız!** Davet giriş kanalı zaten ayarlamış. **Sıfırlamak için:** \`${prefix}davetlog giriş sıfırla\``,
          allowedMentions: { repliedUser: false },
        })
        .catch((err) => {});

    if (!log)
      return message
        .reply({
          content: `> <:cross:980410756484956210>  **Başarasız!** Bir kanal belirtmelisin yada kanal ID girmelisin! **Örnek:** \`${prefix}davetlog giriş #kanal\``,
          allowedMentions: { repliedUser: false },
        })
        .catch((err) => {});

    await db.set("inviteJoinLog__" + message.guild.id, log.id);
    return message
      .reply({
        content: `> <:correct:980410756187185172>  **Başarılı!** Davet giriş kanalı ayarlandı! **Kanal:** ${log}`,
        allowedMentions: { repliedUser: false },
      })
      .catch((err) => {});
  }

  if (args[0] === "çıkış") {
    if (args[1] === "sıfırla" || args[1] === "reset") {
      if (!çıkış)
        return message
          .reply({
            content: `> <:cross:980410756484956210>  **Başarısız!** Zaten davet çıkış kanalı ayarlanmamış. **Ayarlamak için:** \`${prefix}davetlog çıkış #kanal\``,
            allowedMentions: { repliedUser: false },
          })
          .catch((err) => {});

      message
        .reply({
          content: `> <:correct:980410756187185172>  **Başarılı!** Davet çıkış kanal sıfırlandı! **Tekrar ayarlamak için:** \`${prefix}davetlog çıkış #kanal\``,
          allowedMentions: { repliedUser: false },
        })
        .catch((err) => {});
      await db.delete("inviteLeaveLog__" + message.guild.id);

      return;
    }

    if (çıkış)
      return message
        .reply({
          content: `> <:cross:980410756484956210>  **Başarısız!** Davet çıkış kanalı zaten ayarlamış. **Sıfırlamak için:** \`${prefix}davetlog çıkış sıfırla\``,
          allowedMentions: { repliedUser: false },
        })
        .catch((err) => {});

    if (!log)
      return message
        .reply({
          content: `> <:cross:980410756484956210>  **Başarısız!** Bir kanal belirtmelisin yada kanal ID girmelisin! **Örnek:** \`${prefix}davetlog çıkış #kanal\``,
          allowedMentions: { repliedUser: false },
        })
        .catch((err) => {});

    await db.set("inviteLeaveLog__" + message.guild.id, log.id);
    return message
      .reply({
        content: `> <:correct:980410756187185172>  **Başarılı!** Davet çıkış kanalı ayarlandı! **Kanal:** ${log}`,
        allowedMentions: { repliedUser: false },
      })
      .catch((err) => {});
  }
};

module.exports.conf = {
  aliases: ["inviteLog", "invitelog", "davet-log"],
};

module.exports.help = {
  name: "davetlog",
  description: "Davet log ayarlarını yapar.",
  usage: "davetlog [giriş/çıkış] [#kanal/kanal ID]",
  category: "invite"
};
