const { Permissions, MessageEmbed } = require("discord.js");
const db = require("orio.db");

exports.run = async (bot, message, args) => {
  const prefix = bot.db.get(`prefix_${message.guild.id}`) || bot.ayarlar.prefix;
    

  let member =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[0]) ||
    message.member;

  let inviteData = db.get(`inviteNumber_${member.id}_${message.guild.id}`);
  let regularData = db.get(`regularNumber_${member.id}_${message.guild.id}`);
  let bonusData = db.get(`bonusNumber_${member.id}_${message.guild.id}`);
  let fakeData = db.get(`fakeNumber_${member.id}_${message.guild.id}`);
  let leaveData = db.get(`leaveNumber_${member.id}_${message.guild.id}`);

  let embed = new MessageEmbed()
    .setColor("YELLOW")
    .setThumbnail(member.user.avatarURL())
    .setTitle(member.user.tag)
    .setDescription(
      `**${inviteData ? inviteData : 0}** Davet ( **${
        regularData ? regularData : 0
      }** Normal, **${bonusData ? bonusData : 0}** Bonus, **${
        fakeData ? fakeData : 0
      }** Fake, **${leaveData ? leaveData : 0}** Çıktı)`
    )
    .setTimestamp();

  message
    .reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
    .catch((err) => {});

  try {
    let awards = db.get(`inviteAwards_${message.guild.id}`);
    awards &&
      awards.map((x) => {
        if (message.guild.roles.cache.get(x.roleID)) {
          if (inviteData || 0 >= x.invite) {
            if (!member.roles.cache.get(x.roleID)) {
              member.roles.add(x.roleID).catch((err) => {});
            }
          }

          if (inviteData || 0 < x.invite) {
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
  aliases: ["invites", "davetim"],
};

exports.help = {
  name: "rank",
  description: "Davet sayınızı gösterir.",
  usage: "rank <@kullanıcı>",
  category: "invite"
};
