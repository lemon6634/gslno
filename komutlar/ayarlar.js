const Discord = require('discord.js')
const db = require("orio.db")
const {JsonDatabase} = require("wio.db");
const db2 = new JsonDatabase({databasePath:"./croxydb/wiodb.json"});
const db3 = require("croxydb")

exports.run = async (client, message, args) => {

    const embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
    const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [embed.setDescription(`<:cross:980410756484956210>  **Bu komutu kullanabilmek için \`Yönetici\` iznine sahip olmalısın!**`)] }).catch(e => { })

    let reklamkk = db.get(`reklam_${message.guild.id}`)
    let küfürkk = db.get(`küfür_${message.guild.id}`)
    let linkk = db.get(`link_${message.guild.id}`)
    let etiketk = db3.get(`etiketengel_${message.guild.id}`)
    let everkk = db.get(`ever_${message.guild.id}`)
    let mod = db2.get(`modlog_${message.guild.id}`)
    const ayarlar = new Discord.MessageEmbed()
    .setColor('YELLOW')
    .setTitle("<:info:980410756145242133>  Ayarlar")
    .setThumbnail(message.guild.iconURL({dynamic: true}))
    .addField("**Reklam Engel**", reklamkk ? "<:right_switch:998603409248751696>" : "<:left_switch:998603407709442128>\n\u200b", true)
    .addField("**Küfür Engel**", küfürkk ? "<:right_switch:998603409248751696>" : "<:left_switch:998603407709442128>\n\u200b", true)
    .addField("**Link Engel**", linkk ? "<:right_switch:998603409248751696>" : "<:left_switch:998603407709442128>\n\u200b", true)
    .addField("**Etiket Engel**", etiketk ? "<:right_switch:998603409248751696>" : "<:left_switch:998603407709442128>", true)
    .addField("**Everyone Engel**", everkk ? "<:right_switch:998603409248751696>" : "<:left_switch:998603407709442128>", true)
    .addField("**Mod-Log Sistemi**", mod ? "<:right_switch:998603409248751696>" : "<:left_switch:998603407709442128>", true)


return message.reply({ embeds: [ayarlar] })
}    

exports.conf = {
    aliases: ["settings", "setting"]
}

exports.help = {
    name: 'ayarlar',
    description: 'Sistemlerin Açık/Kapalı Olduğunu Gösterir.',
    usage: 'ayarlar',
    category: 'moderasyon'
}