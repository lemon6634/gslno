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

  let data = db.get(`inviteAwards_${message.guild.id}`);
  let role =
    message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
  let ödül = Number(args[2]);

  let komut = args[0] ? args[0].toLowerCase() : args[0];

  if (
    komut === "sil" ||
    komut === "kaldır" ||
    komut === "remove" ||
    komut === "reset"
  ) {
    if (!role)
      return message
        .reply({
          content: `> <:cross:980410756484956210>  **Başarısız!** Silmek istediğiniz rolü belirtmeniz gerekiyor.`,
          allowedMentions: { repliedUser: false },
        })
        .catch((err) => {});

    if (!data.map(x => x.roleID).includes(role.id))
      return message
        .reply({
          content: `> <:cross:980410756484956210>  **Başarısız!** Belirttiğiniz rol sistemde yok! **Ödüller:** \`${prefix}ranks top\``,
          allowedMentions: { repliedUser: false },
        })
        .catch((err) => {});

    db.unpush(`inviteAwards_${message.guild.id}`, { roleID: role.id });

    message
      .reply({
        content: `> <:correct:980410756187185172>  **Başarılı!** Ödül başarıylı silindi! **Rol:** \`${role}\``,
        allowedMentions: { repliedUser: false },
      })
      .catch((err) => {});

    return;
  }

  if (komut === "ekle" || komut === "add" || komut === "set") {
    if (!role)
      return message
        .reply({
          content: `> <:cross:980410756484956210>  **Başarısız!** Ayarlamak istediğiniz rolü belirtin! **Örnek:** \`${prefix}ranks ekle @rol <davet sayısı>\``,
          allowedMentions: { repliedUser: false },
        })
        .catch((err) => {});

    if (role.managed !== false)
      return message
        .reply({
          content: `> <:cross:980410756484956210>  **Başarısız!** Ayarlamak istediğiniz rol entegrasyon rolü, entegrasyon rolleri ödül olarak ayarlanamaz!`,
          allowedMentions: { repliedUser: false },
        })
        .catch((err) => {});

    if (data && data.map(x => x.roleID).includes(role.id)) {
      return message
        .reply({
          content: `> <:cross:980410756484956210>  **Başarısız!** Belirttiğiniz rol zaten sistemde bulunuyor.`,
          allowedMentions: { repliedUser: false },
        })
        .catch((err) => {});
    }

    if (!ödül)
      return message
        .reply({
          content: `> <:cross:980410756484956210>  **Başarısız!** Kullanıcı kaç davet sayısına gelince rolü alıcak belirtin! **Örnek:** \`${prefix}ranks ekle @rol <davet sayısı>\``,
          allowedMentions: { repliedUser: false },
        })
        .catch((err) => {});

    if (ödül < 0)
      return message
        .reply({
          content: `> <:cross:980410756484956210>  **Başarısız!** Lütfen **Pozitif(+)** bir sayı belirtin.`,
          allowedMentions: { repliedUser: false },
        })
        .catch((err) => {});

    db.push(`inviteAwards_${message.guild.id}`, {
      roleID: role.id,
      invite: ödül,
    });

    const embed = new MessageEmbed()
      .setTitle(`<:correct:980410756187185172>  Başarılı!`)
      .setDescription(
        `> Kullanıcı **${ödül}** davet sayısına gelince ${role} rolünü alacak.`
      )
      .addField(`Rol ↷`, "```" + role.name + " | " + role.id + "```")
      .addField(`Davet Sayısı ↷`, "```" + ödül + "```")
      .setColor("AQUA");

    message
      .reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      })
      .catch((err) => {});

    return;
  }

  if (komut === "top" || komut === "liste" || komut === "listele") {
    try {
      let ranks =
        data &&
        data.map(
          (data, index) =>
            `\`${index + 1}.\` Rol: <@&${data.roleID}> Invite: **${
              data.invite
            }**`
        );

      const embed = new MessageEmbed()
        .setTitle("Ödül Listesi")
        .setColor("AQUA")
        .setDescription(ranks.join("\n"));

      message
        .reply({
          embeds: [embed],
          allowedMentions: { repliedUser: false },
        })
        .catch((err) => {});
    } catch (err) {
      message.reply({
        content: `> <:cross:980410756484956210>  **Başarısız!** Sistemde gösterilecek davet ödülü bulunmuyor.`,
        allowedMentions: { repliedUser: false },
      });
    }

    return;
  }

  let embed = new MessageEmbed()
    .setTitle(`<:cross:980410756484956210>  Başarısız`)
    .setDescription(`> Lütfen ne yapmak istediğinizi belirtin. Örnekler;`)
    .addField(
      `Ödül Ekle/Sil ↷`,
      `\`\`\`${prefix}ranks ekle @rol <davetsayısı>\n${prefix}ranks kaldır @rol\`\`\``
    )
    .addField(`Ödül Liste ↷`, `\`\`\`${prefix}ranks top\`\`\``)
    .setColor("AQUA");

  message
    .reply({
      embeds: [embed],
      allowedMentions: { repliedUser: false },
    })
    .catch((err) => {});
};
exports.conf = {
  aliases: ["davetödül", "davet-ödül", "invite-ödül", "inviteödül"],
};

exports.help = {
  name: "ranks",
  description: "Davet ödülü ayarlar.",
  usage: "ranks <ekle/kaldır/top/liste>",
  category: "invite"
};
