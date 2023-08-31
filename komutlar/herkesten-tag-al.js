const { MessageEmbed } = require("discord.js");
exports.run = async (client, message, args) => {
  const embed = new MessageEmbed()
        .setColor("YELLOW")
if (!message.member.permissions.has("MANAGE_NICKNAMES")) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Bu komutu kullanabilmek için `İsimleri Yönet` yetkisine sahip olmalısın!**")] }).catch(e => {});

let tag = args.slice(0).join(" ");
if (!tag) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Bir tag belirtmelisin!**")] }).catch(e => {});

 
let sayi = 0
message.reply({ embeds: [embed.setDescription(`<:loading:980410754387816469> **Tag alma işlemi başlıyor...**`)] }).then(async msg => {
message.guild.members.cache.map(async cs => {
    sayi = sayi + 1
    setTimeout(async () => {
        if(!cs.displayName.includes(tag)) return
        await cs.setNickname(`${cs.displayName.replace(tag, "")}`).then(async mr => {
            return msg.edit(`**${sayi}.** Son Tag Alınan: **${cs.user.tag}**`).catch(e => {})
        }).catch(e => {
            return msg.edit({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Tag alma işlemi başarısız oldu!** ("+cs.user.tag+")")] }).catch(e => {});
        });
        if(sayi == message.guild.memberCount) return msg.edit({ embeds: [embed.setDescription("<:correct:980410756187185172>  **Tag alma işlemi sonlandı!**\nToplam tagı alınan üye sayısı: "+sayi)] }).catch(e => {});
    }, 3000)
  })
}).catch(e => {});
};
exports.conf = {
  aliases: ["herkestentag-al", "herkesten-tagal", "herkestentagal"]
}

exports.help = {
  name: "herkesten-tag-al",
  description: "Tag alır.",
  usage: "herkesten-tag-al <tag>",
  category: "moderasyon"
}
