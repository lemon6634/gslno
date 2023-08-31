const { Permissions, MessageEmbed } = require("discord.js");
const db = require("orio.db");

exports.run = async (bot, message, args) => {
  const prefix = bot.db.get(`prefix_${message.guild.id}`) || bot.ayarlar.prefix;
    

  if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
    return message
      .reply({
        content: `> <:cross:980410756484956210>  **Başarısız!** Bu komutu kullanamazsın **Yönetici** iznin bulunmuyor.`,
        allowedMentions: { repliedUser: false },
      })
      .catch((err) => {});

  let sayi = Number(args[1]);

  let member =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[0]);

  if (!member)
    return message
      .reply({
        content: `> <:cross:980410756484956210>  **Başarısız** Bir üye etiketlemelisin veya ID yazmalısın.`,
        allowedMentions: { repliedUser: false },
      })
      .catch((err) => {});

  if (!sayi)
    return message
      .reply({
        content: `> <:cross:980410756484956210>  **Başarısız** Lütfen silinecek davet sayısını belirtin! **Örnek:** \`${prefix}davet-sil @üye 10\``,
        allowedMentions: { repliedUser: false },
      })
      .catch((err) => {});

  if (sayi < 0)
    return message
      .reply({
        content: `> <:cross:980410756484956210>  **Başarısız!** Lütfen belirttiğiniz sayıda **(-)** kullanmayın.`,
        allowedMentions: { repliedUser: false },
      })
      .catch((err) => {});

  let check = db.get(`inviteNumber_${member.id}_${message.guild.id}`) || 0;
  if (check - sayi < 0)
    return message
      .reply({
        content: `> <:cross:980410756484956210>  **Başarısız!** Belirttiğiniz sayı kullanıcıdan çıkarılırsa kullanıcının **Davet Sayısı** 0'ın altına düşüyor. **Güncel Davet Sayısı:** \`${
          check ? check : 0
        }\``,
        allowedMentions: { repliedUser: false },
      })
      .catch((err) => {});

  db.add(`inviteNumber_${member.id}_${message.guild.id}`, -sayi);
  db.add(`bonusNumber_${member.id}_${message.guild.id}`, -sayi);

  let data = db.get(`inviteNumber_${member.id}_${message.guild.id}`) || 0;
  message
    .reply({
      content: `> <:correct:980410756187185172>  **Başarılı!** ${member} adlı kişiden **${sayi}** davet silindi! Toplam daveti: **${
        data ? data : 0
      }**`,
      allowedMentions: { repliedUser: false },
    })
    .catch((err) => {});

  try {
    let awards = db.get(`inviteAwards_${message.guild.id}`);
    awards &&
      awards.map((x) => {
        if (message.guild.roles.cache.get(x.roleID)) {
          if (data || 0 >= x.invite) {
            if (!member.roles.cache.get(x.roleID)) {
              member.roles.add(x.roleID).catch((err) => {});
            }
          }

          if (data || 0 < x.invite) {
            if (member.roles.cache.get(x.roleID)) {
              member.roles.remove(x.roleID).catch((err) => {});
            }
          }
        }
      });
  } catch (err) {
    return undefined;
  }
};
exports.conf = {
  aliases: [
    "davetçıkar",
    "davet-kaldır",
    "davet-çıkar",
    "davet-sil",
    "davetsil",
    "deleteinvite",
    "removeinvite",
    "removeInvite",
    "removeinvites",
    "removeInvites",
  ],
};

exports.conf = {
  aliases: ["davetsil", "davet-sil", "invite-sil", "invitesil"],
};

exports.help = {
  name: "deleteInvite",
  description: "Kullanıcının davet sayısını azaltır.",
  usage: "deleteInvite <@kullanıcı> <davet sayısı>",
  category: "invite"
};
