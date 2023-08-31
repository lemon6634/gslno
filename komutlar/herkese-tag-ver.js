const { MessageEmbed } = require("discord.js");
exports.run = async (client, message, args) => {
  const embed = new MessageEmbed()
        .setColor("YELLOW")
if (!message.member.permissions.has("MANAGE_NICKNAMES")) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Bu komutu kullanabilmek için `İsimleri Yönet` yetkisine sahip olmalısın!**")] }).catch(e => {});

let tag = args.slice(0).join(" ");
if (!tag) return message.reply({ embeds: [embed.setDescription("<:cross:980410756484956210>  **Bir tag belirtmelisin!**")] }).catch(e => {});

 
let sayi = 1
message.reply({ embeds: [embed.setDescription(`<:correct:980410756187185172>  **Tag verme işlemi başlıyor...**`)] }).then(async msg => {
message.guild.members.cache.map(async cs => {
    sayi = sayi + 1
    setTimeout(async () => {
        if(cs.displayName.includes(tag)) return
        await cs.setNickname(`${tag} | ${cs.displayName}`).then(async mr => {
            return msg.edit(`**${sayi}.** Son Tag Verilen: **${cs.user.tag}**`).catch(e => {});
        }).catch(e => {
            return msg.edit({ embeds: [embed.setDescription("<:cross:980410756484956210>  Tag verme işlemi başarısız oldu! ("+cs.user.tag+")")] }).catch(e => {});
        });
    }, 3000)
    if(sayi == message.guild.memberCount) return msg.edit({ embeds: [embed.setDescription("<:cross:980410756484956210> Tag verme işlemi sonlandı. Toplam tag verilen üye sayısı: "+sayi)] }).catch(e => {});
  })
}).catch(e => {});
};
exports.conf = {
  aliases: ["herkesetag-ver", "herkese-tagver", "herkesetagver"]
}

exports.help = {
  name: "herkese-tag-ver",
  description: "Tag verir.",
  usage: "herkese-tag-ver <tag>",
  category: "moderasyon"
}
