const Discord = require("discord.js");
const {JsonDatabase} = require("wio.db");
const db = new JsonDatabase({databasePath:"./croxydb/wiodb.json"});

module.exports.run = async (client, message, args) => {
  const embd = new Discord.MessageEmbed()
        .setColor("YELLOW")
let prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
if(!message.member.permissions.has("MANAGE_GUILD")) return message.reply({ embeds: [embd.setDescription("<:cross:980410756484956210>  **Bu komutu kullanabilmek için `Sunucuyu Yönet` yetkisine sahip olmalısın!**")] }).catch(e => {})

if(args[0] == "cezalı-rol") {
    let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
    if(!rol) return message.reply({ embeds: [embd.setDescription(`<:cross:980410756484956210>  **Cezalı rol belirtmen gerekli!**\nÖrnek: \`${prefix}jail cezalı-rol @rol\``)] }).catch(e => {})

    await db.set(`jailrole_${message.guild.id}`, rol.id)
    const embed = new Discord.MessageEmbed()
    .setTitle("Cezalı Rol Ayarlandı")
    .setDescription(`<:correct:980410756187185172>  **Cezalı rol ${rol} olarak ayarlandı!**`)
    .setColor("BLUE")
    .setTimestamp()
    return message.channel.send({embeds : [embed]}).catch(e => {})
} else {

if(args[0] == "log") {
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
    if(!channel) return message.reply({ embeds: [embd.setDescription(`<:cross:980410756484956210>  **Jail log kanalı belirtmen gerekli!**\nÖrnek: \`${prefix}jail log #kanal\`` )] }).catch(e => {})
  
    await db.set(`jaillog_${message.guild.id}`, channel.id)
    const embed = new Discord.MessageEmbed()  
    .setTitle("Jail Log Ayarlandı")
    .setDescription(`<:correct:980410756187185172>  **Jail log kanalı ${channel} olarak ayarlandı!**`)
    .setColor("BLUE")
    .setTimestamp()
    return message.channel.send({embeds : [embed]}).catch(e => {})
} else {

  if(args[0] == "sil") {

const role = message.guild.roles.cache.get(db.get(`jailrole_${message.guild.id}`))
if(!role) return message.reply({ embeds: [embd.setDescription(`<:cross:980410756484956210>  **Jail rolü ayarlanmamış!**\nÖrnek: \`${prefix}jail cezalı-rol @rol\`` )] }).catch(e => {})

const log = message.guild.channels.cache.get(db.get(`jaillog_${message.guild.id}`))
if(!log) return message.reply({ embeds: [embd.setDescription(`<:cross:980410756484956210>  **Jail log kanalı ayarlanmamış!**\nÖrnek: \`${prefix}jail log #kanal\`` )] }).catch(e => {})


    let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
    if(!member) return message.reply({ embeds: [embd.setDescription(`<:cross:980410756484956210>  **Jail silme için bir üye belirtmen gerekli!**\nÖrnek: \`${prefix}jail sil @kullanıcı\`` )] }).catch(e => {})

    let jail = await db.get(`csjail${member.id}${message.guild.id}`)
    if(!jail) return message.reply({ embeds: [embd.setDescription(`<:cross:980410756484956210>  **Bu üye jailli değil!**`)] }).catch(e => {})

             
    JSON.parse(jail.roller).forEach(async(id) => {
      await member.roles.add(id).catch(e => {})
      member.roles.remove(role).catch(e => {})
    })

    await db.delete(`csjail${member.id}${message.guild.id}`)
    const embed = new Discord.MessageEmbed()
    .setTitle("Jail Silindi")
    .setDescription(`Jail silindi!\nSilinen Jail: <@${member.id}>\nSilen Kişi: <@${message.author.id}>`)
    .setColor("BLUE")
    .setTimestamp()
    await message.channel.send({embeds : [embed]}).catch(e => {})
    await log.send({embeds : [embed]}).catch(e => {})
  } else {

const role = message.guild.roles.cache.get(db.get(`jailrole_${message.guild.id}`))
if(!role) return message.reply({ embeds: [embd.setDescription(`<:cross:980410756484956210>  **Jail rolü ayarlanmamış!**\nÖrnek: \`${prefix}jail cezalı-rol @rol\`` )] }).catch(e => {})

const log = message.guild.channels.cache.get(db.get(`jaillog_${message.guild.id}`))
if(!log) return message.reply({ embeds: [embd.setDescription(`<:cross:980410756484956210>  **Jail log kanalı ayarlanmamış!**\nÖrnek: \`${prefix}jail log #kanal\`` )] }).catch(e => {})


let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if(!member) return message.reply({ embeds: [embd.setDescription(`<:cross:980410756484956210> **Üye belirtmen gerekli!**\nÖrnek: \`${prefix}jail @kullanıcı sebep\`` )] }).catch(e => {})

let reason = args.slice(1).join(" ")
if(!reason) return message.reply({ embeds: [embd.setDescription(`<:cross:980410756484956210>  **Sebep belirtmen gerekli!**\nÖrnek: \`${prefix}jail @kullanıcı sebep\`` )] }).catch(e => {})

  let roller = member.roles.cache.map(mr => mr.id).join('","');
  db.set("csjail" + member.id+message.guild.id, {
    muteyiyen: member.id,
    muteatan: message.author.id,
    roller: `["${roller}"]`
  });

  
 
  await member.roles.cache.map(async mss => {
    await member.roles.remove(mss).catch(e => {})
  })

  setTimeout(async () => {
    await member.roles.add(role).catch(e => {})
  }, 6000)


const embed = new Discord.MessageEmbed()
      .setTitle(member.user.tag + " Jaile Atıldı!")
      .setThumbnail(message.guild.iconURL())
      .setColor("GREEN")
      .addField("Jail Yiyen", `<@${member.id}>`)
      .addField("Jail Atan", `<@${message.author.id}>`)
      .addField("Mute Sebebi", `\`${reason || "Yok"}\``)
      .setTimestamp()
await message.channel.send({embeds : [embed]}).catch(e => {})
await log.send({embeds : [embed]}).catch(e => {})

}}}
};
module.exports.conf = {
  aliases: []
};

module.exports.help = {
  name: "jail",
  description: "Jail atar.",
  usage: "jail <@kullanıcı> <sebep>",
  category: "moderasyon"
};