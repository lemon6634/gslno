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

  if (args[0] == "all" || args[0] == "herkes") {
    message
      .reply({
        content: `> <:settings:980410755960680508>  **Veriler Siliniyor**! Lütfen bekleyin!`,
        allowedMentions: { repliedUser: false },
      })
      .then(async (msg) => {
        message.guild.members.cache.map((x) => {
          db.delete(`inviteNumber_${x.id}_${message.guild.id}`);
          db.delete(`regularNumber_${x.id}_${message.guild.id}`);
          db.delete(`bonusNumber_${x.id}_${message.guild.id}`);
          db.delete(`fakeNumber_${x.id}_${message.guild.id}`);
          db.delete(`leaveNumber_${x.id}_${message.guild.id}`);
        });

        msg
          .edit({
            content: `> <:correct:980410756187185172>  **Başarılı!** Herkesin davet verileri silindi!`,
            allowedMentions: { repliedUser: false },
          })
          .catch((err) => {});
      })
      .catch((err) => {});

    return;
  }

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

  message
    .reply({
      content: `> <:settings:980410755960680508>  **Veriler Siliniyor**! Lütfen bekleyin!`,
      allowedMentions: { repliedUser: false },
    })
    .then(async (msg) => {
      let inviteData = db.get(`inviteNumber_${member.id}_${message.guild.id}`);
      let regularData = db.get(`regularNumber_${member.id}_${message.guild.id}`);
      let bonusData = db.get(`bonusNumber_${member.id}_${message.guild.id}`);
      let fakeData = db.get(`fakeNumber_${member.id}_${message.guild.id}`);
      let leaveData = db.get(`leaveNumber_${member.id}_${message.guild.id}`);

      msg
        .edit({
          content: `> <:correct:980410756187185172>  **Başarılı!** ${member} üyeden toplam **${
            fakeData + leaveData + inviteData
          }** davet silindi!`,
          allowedMentions: { repliedUser: false },
        })
        .catch((err) => {});

      db.delete(`inviteNumber_${member.id}_${message.guild.id}`);
      db.delete(`regularNumber_${member.id}_${message.guild.id}`);
      db.delete(`bonusNumber_${member.id}_${message.guild.id}`);
      db.delete(`fakeNumber_${member.id}_${message.guild.id}`);
      db.delete(`leaveNumber_${member.id}_${message.guild.id}`);

      try {
        let awards = db.get(`inviteAwards_${message.guild.id}`);
        awards &&
          awards.map((x) => {
            if (message.guild.roles.cache.get(x.roleID)) {
              if (member.roles.cache.get(x.roleID)) {
                member.roles.remove(x.roleID).catch((err) => {});
              }
            }
          });
      } catch (err) {
        return undefined;
      }
    })
    .catch((err) => {});
};
exports.conf = {
  aliases: [
    "davetsıfırla",
    "resetinvite",
    "resetinvites",
    "resetInvites",
    "davet-sıfırla",
    "davetlerisıfırla",
  ],
};

exports.conf = {
  aliases: ["davetsıfırla", "davet-sıfırla", "invite-reset", "reset-invite"],
};

exports.help = {
  name: "resetInvite",
  description: "Sunucudaki tüm davetleri sıfırlar.",
  usage: "resetInvite",
  category: "invite"
};
