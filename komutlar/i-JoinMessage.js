const { Permissions, MessageEmbed } = require("discord.js");
const moment = require("moment");
const db = require("orio.db");

exports.run = async (bot, message, args) => {
  const prefix = bot.db.get(`prefix_${message.guild.id}`) || bot.ayarlar.prefix;
    

  let joinData = db.get(`inviteJoinMessage_${message.guild.id}`)
  let mesaj = args.slice(0).join(" ");

  if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
    return message
      .reply({
        content: `> <:cross:980410756484956210>  **Başarısız!** Bu komutu kullanamazsın **Yönetici** iznin bulunmuyor.`,
        allowedMentions: { repliedUser: false },
      })
      .catch((err) => {});

  if (mesaj == "sıfırla" || mesaj == "reset") {
    if (!joinData)
      return message
        .reply({
          content: `> <:cross:980410756484956210>  **Başarısız!** Zaten davet girdi mesaj ayarlanmamış.`,
          allowedMentions: { repliedUser: false },
        })
        .catch((err) => {});

    message
      .reply({
        content: `> <:correct:980410756187185172>  **Başarılı!** Davet girdi mesaj sıfırlandı!`,
        allowedMentions: { repliedUser: false },
      })
      .catch((err) => {});

    db.delete(`inviteJoinMessage_${message.guild.id}`)

    return;
  }

  let uyarı = new MessageEmbed()
    .setTitle(`<:cross:980410756484956210>  Başarısız!`)
    .setDescription(`> Ayarlamak istedğiniz mesajı belirtin. Örnekler;`)
    .addField(
      `Kullanım ↷`,
      `\`\`\`${prefix}davetgirdimesaj <mesaj>\n${prefix}davetgirdimesaj sıfırla\`\`\``
    )
    .addField(
      `Argümanlar ↷`,
      `
  \`-üye_sayısı-\`    : Üye sayısını yazar.
  \`-kuruluş-\`       : Kullanıcının hesabını kurduğu zamanı yazar.
  \`-davet_kod-\`     : Kullanıcının girdiği davet kodunu yazar. 
  \`-davet_url-\`     : Kullanıcının girdiği davet url yazar. 
  \`-davetçi_tag-\`   : Kullanıcıyı davet eden üyeyinin taglı şekliyle yazar.
  \`-davetçi_name\`-  : Kullanıcıyı davet eden üyeyinin ismini yazar.
  \`-davetçi-\`       : Kullanıcıyı davet eden üyeyi yazar. 
  \`-ayrılan_davet-\` : Kullanıcıyı davet edenin Ayrılan davet sayısını yazar. 
  \`-fake_davet-\`    : Kullanıcıyı davet edenin Fake davet sayısını yazar.
  \`-toplam_davet-\`  : Kullanıcıyı davet edenin Toplam davet sayısını yazar.
  \`-üye_tag-\`       : Kullanıcıyı taglı şekilde yazar. 
  \`-üye_name-\`      : Kullanıcını ismini yazar.
  \`-üye-\`           : Kullanıcıyı yazar. `
    )
    .setColor("AQUA");

  if (!mesaj)
    return message
      .reply({
        embeds: [uyarı],
        allowedMentions: { repliedUser: false },
      })
      .catch((err) => {});

  if (mesaj.length < 10 || mesaj.length > 1000)
    return message
      .reply({
        content: `> <:cross:980410756484956210>  **Başarısız!** En az 10 karakter, en fazla 1000 karakter belirtebilirsin. **Örnek:** \`${prefix}giriş-mesaj -üye- Hoşgeldin! Seni davet eden -davetçi-\``,
        allowedMentions: { repliedUser: false },
      })
      .catch((err) => {});

  let embed = new MessageEmbed()
    .setTitle(`<:correct:980410756187185172>  Başarılı!`)
    .setDescription(
      `> Davet girdi mesaj ayarlandı. Artık kullanıcı sunucuya girdiğiniz zaman ayarladığınız mesaj gönderilcek.`
    )
    .addField(
      "Mesaj ↷",
      "```" +
        (mesaj.length >= 1020 ? mesaj.slice(0, 1020) + "..." : mesaj) +
        "```"
    )
    .addField(
      "Örnek ↷",
      mesaj
        .replace("-uye-", `${message.author}`)
        .replace("-üye_sayısı-", `${message.guild.memberCount}`)
        .replace(
          "-kuruluş-",
          `${moment
            .utc(
              message.guild.members.cache.get(message.author.id).user.createdAt
            )
            .format("DD/MM/YYYY")}`
        )
        .replace("-davet_kod-", `hhgnamWkZp`)
        .replace("-davet_url-", `https://discord.gg/hhgnamWkZp`)
        .replace("-davetçi_tag-", `${bot.user.tag}`)
        .replace("-davetçi-", `${bot.user}`)
        .replace("-davetçi_name-", `${bot.user.username}`)
        .replace("-ayrılan_davet-", `1`)
        .replace("-fake_davet-", `0`)
        .replace("-toplam_davet-", `10`)
        .replace("-üye_tag-", `${message.author.tag}`)
        .replace("-üye_name-", `${message.author.username}`)
        .replace("-user-", `${message.author}`)
        .replace("-memberCount-", `${message.guild.memberCount}`)
        .replace(
          "-createdAt-",
          `${moment
            .utc(
              message.guild.members.cache.get(message.author.id).user.createdAt
            )
            .format("DD/MM/YYYY")}`
        )
        .replace("-invite_code-", `hhgnamWkZp`)
        .replace("-invite_url-", `https://discord.gg/hhgnamWkZp`)
        .replace("-inviter_tag-", `${bot.user.tag}`)
        .replace("-inviter-", `${bot.user}`)
        .replace("-inviter_name-", `${bot.user.username}`)
        .replace("-leave_invite-", `1`)
        .replace("-fake_invite-", `0`)
        .replace("-total_invite-", `10`)
        .replace("-user_tag-", `${message.author.tag}`)
        .replace("-user_name-", `${message.author.username}`)
        .slice(0, 1020) + "..."
    )
    .setColor("RANDOM");

  message
    .reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
    .catch((err) => {});

  db.set(`inviteJoinMessage_${message.guild.id}`, mesaj)
};
exports.conf = {
  aliases: [
    "davet-girdi-mesaj",
    "davet-giriş-mesaj",
    "davet-hg-mesaj",
    "davethgmesaj",
    "invitegirişmesaj",
    "invite-giriş-mesaj",
    "invite-join-message",
    "invitejoinmessage",
    "invitejoinmsg",
    "giriş-mesaj",
    "girişmesaj",
  ],
};
exports.conf = {
  aliases: ["davetgirdi-mesaj", "davet-girdimesaj", "invite-girdi-mesaj", "invitegirdi-mesaj", "invitegirdimesaj"],
};

exports.help = {
  name: "davetgirdimesaj",
  description: "Davet girdi mesajını ayarlar.",
  usage: "davetgirdimesaj <mesaj>",
  category: "invite"
};
