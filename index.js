const { Client, Message, MessageEmbed, MessageAttachment, Collection, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const token = config.token;
const db1 = require("orio.db");
const db2 = require("croxydb");
const { JsonDatabase } = require("wio.db");
const db3 = new JsonDatabase({ databasePath: "./croxydb/wiodb.json" });
const Jimp = require("jimp")

const client = new Client({
  messageCacheLifetime: 60,
  fetchAllMembers: true,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  shards: "auto",
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: 32767,
})
module.exports = client;

require("./events/message.js")
require("./çekiliş-events/interactionCreate.js")
require("./events/ready.js")
require("./events/roleGuard.js")
require("./events/channelGuard.js")
require("./events/memberGuard.js")
require("./events/botGuard.js")

client.prefix = config.prefix
client.ayarlar = config
client.db = db3
client.commands = new Collection();
client.aliases = new Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  console.log(`Toplamda ${files.length} Komut Var!`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    console.log(`${props.help.name} İsimli Komut Aktif!`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});


const synchronizeSlashCommands = require('discord-sync-commands-v14');

const { GiveawaysManager } = require('discord-giveaways');
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./giveaways.json",
  default: {
    botsCanWin: false,
    embedColor: "RED",
    reaction: "🎉",
    lastChance: {
      enabled: true,
      content: '⚠️ **KATILMAK İÇİN SON ŞANS!** ⚠️',
      threshold: 5000,
      embedColor: 'RED'
    }
  }
});


client.commandss = new Collection();
fs.readdir("./çekiliş-cmd/", (_err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./çekiliş-cmd/${file}`);
    let commandName = file.split(".")[0];
    client.commandss.set(commandName, {
      name: commandName,
      ...props
    });
    console.log(`👌 Yüklendi slash komutu: ${commandName}`);
  });
  synchronizeSlashCommands(client, client.commandss.map((c) => ({
    name: c.name,
    description: c.description,
    options: c.options,
    type: 'CHAT_INPUT'
  })), {
    debug: false
  });
});

fs.readdir("./çekiliş-events/", (_err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(`./çekiliş-events/${file}`);
    let eventName = file.split(".")[0];
    console.log(`👌 Yüklendi slash eventi: ${eventName}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./çekiliş-events/${file}`)];
  });
});

client.login(token);

const logs = require("discord-logs");
const { truncate } = require("fs");
logs(client, {
  debug: false
});


//RESİMLİ GÜVENLİK 
client.on("guildMemberAdd", async member => {
  let gkanal = await db2.get('rggiris_' + member.guild.id)
  const gözelkanal = member.guild.channels.cache.get(gkanal)
  if (!gözelkanal) return
  if (gözelkanal.type === "GUILD_TEXT") {
    const kontrol = new Date().getTime() - member.user.createdAt.getTime();
    if (kontrol > 2592000000) gif = "https://media.discordapp.net/attachments/936963263093161984/999421457882951772/guvenli.png"
    if (kontrol < 2592000000) gif = "https://media.discordapp.net/attachments/936963263093161984/999422580731674724/guvensiz.png"

    const bg = await Jimp.read(gif)
    const userimg = await Jimp.read(member.user.displayAvatarURL({ format: "png" }))
    var font
    await userimg.resize(300, 300)
    await bg.composite(userimg, 25, 30).write("./img/sec/" + member.id + ".png")
    setTimeout(function () {
      gözelkanal.send({ files: [new MessageAttachment("./img/sec/" + member.id + ".png")] }).catch(e => { })
      setTimeout(() => {
        fs.unlink("./img/sec/" + member.id + ".png", (err) => {
          if (err)
            throw err;
        })
      }, 5000)
    }, 1000)
  }

})

client.on("guildMemberAdd", async member => {

  const autorole = await db2.fetch(`autorole_${member.guild.id}`)
  if (autorole) {
    const role = member.guild.roles.cache.get(autorole.role)
    if (role) {
      await member.roles.add(autorole.role).catch(e => { })
      const channel = member.guild.channels.cache.get(autorole.log)
      if (channel) {
        let otorolbutton = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("Başarılı!")
            .setStyle("SUCCESS")
            .setCustomId("otorolbutton")
            .setDisabled(true)
            .setEmoji("<:correct:980410756187185172>")
        )
        const embed = new MessageEmbed()
          .setColor("YELLOW")
          .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL() })
          .setDescription(`<:kelebek:995988300403839078>  <@${member.id}> adlı kullanıcıya otomatik rol verildi.`)
          .setTimestamp()
        return channel.send({ embeds: [embed], components: [otorolbutton] }).catch(e => { })
      }
    }
  }

})


client.on("guildMemberAdd", async member => {

  const newaccount = await db2.get(`newaccount_${member.guild.id}`)
  if (newaccount) {
    const role = member.guild.roles.cache.get(newaccount.role)
    if (role) {
      const user = client.users.cache.get(member.id);
      const kurulus = new Date().getTime() - user.createdAt.getTime();
      if (kurulus < 1296000000) {
        await member.roles.add(newaccount.role).catch(e => { })
        const channel = member.guild.channels.cache.get(newaccount.log)
        if (channel) {
          const embed = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL() })
            .setDescription(`<:correct:980410756187185172>  <@${member.id}> adlı kullanıcı yeni hesap olduğu için <@&${newaccount.role}> rolü verildi.`)
            .setTimestamp()
          return channel.send({ embeds: [embed] }).catch(e => { })
        }
      }
    }
  }

})


client.on("guildMemberAdd", async member => {

  const ototag = await db2.fetch(`ototag_${member.guild.id}`)
  if (ototag) {
    await member.setNickname(`${ototag.tag} | ${member.user.username}`).then(cs => {
      const channel = member.guild.channels.cache.get(ototag.log)
      if (channel) {
        const embed = new MessageEmbed()
          .setColor("PURPLE")
          .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL() })
          .setDescription(`<:correct:980410756187185172>  <@${member.id}> adlı kullanıcıya otomatik tag verildi. (Tagınız: ${ototag.tag})`)
          .setTimestamp()
        return channel.send({ embeds: [embed] }).catch(e => { })
      }
    }).catch(e => { })
  }

})

//sayaç sistemi
client.on("guildMemberAdd", async member => {

  let sayaç = await db3.get(`sayaç_${member.guild.id}`)
  if (sayaç) {
    let channel = member.guild.channels.cache.get(sayaç.log)
    if (!channel) return
    let sonuc = await db3.fetch(`sayaçsonuc_${member.guild.id}`)
    if (member.guild.memberCount > sayaç.sayı || member.guild.memberCount == sayaç.sayı) {
      sonuc = `<:gift:982667082896392232>  \`${member.user.tag}\`  Hedef üye sayımız olan \`${sayaç.sayı}\` kişiye ulaştık tebrikler! <:gift:982667082896392232>`
      await db3.delete(`sayaç_${member.guild.id}`)
    } else {
      sonuc = `<:giris:995786135001382964>  ${member.user.tag} aramıza katıldı **${sayaç.sayı}** üye olmamıza **${sayaç.sayı - member.guild.memberCount}** üye kaldı!`
    }
    let embed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle("Birisi Sunucuya Katıldı!")
      .setTimestamp()
      .setThumbnail(member.user.avatarURL())
      .setDescription(sonuc)
    channel.send({ embeds: [embed] }).catch(e => { })
  }
})

client.on("guildMemberRemove", async member => {
  let sayaç = await db3.get(`sayaç_${member.guild.id}`)
  if (sayaç) {
    let channel = member.guild.channels.cache.get(sayaç.log)
    if (!channel) return
    let cikissonuc = await db3.fetch(`sayaçsonuc_${member.guild.id}`)
    if (member.guild.memberCount > sayaç.sayı || member.guild.memberCount == sayaç.sayı) {
      cikissonuc = `<:gift:982667082896392232>  \`${member.user.tag}\`  Hedef üye sayımız olan \`${sayaç.sayı}\` kişiye ulaştık tebrikler! <:gift:982667082896392232>`
      await db3.delete(`sayaç_${member.guild.id}`)
    } else {
      cikissonuc = `<:cikis:995786141204754572>  ${member.user.tag} aramızdan ayrıldı **${sayaç.sayı}** üye olmamıza **${sayaç.sayı - member.guild.memberCount}** üye kaldı!`
    }
    let embed = new MessageEmbed()
      .setColor("RED")
      .setTitle("Birisi Sunucudan Ayrıldı!")
      .setTimestamp()
      .setThumbnail(member.user.avatarURL())
      .setDescription(cikissonuc)
    channel.send({ embeds: [embed] }).catch(e => { })
  }
})

//resimli girişçıkış sistemi
client.on("guildMemberRemove", async member => {

  let giris = await db2.fetch(`rgiris_${member.guild.id}`)
  if (giris) {
    let channel = member.guild.channels.cache.get(giris)
    if (!channel) return

    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(640, 360);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage('https://media.discordapp.net/attachments/1076546621585764513/1079013626771423254/Lourity_Media_Banner.png?width=960&height=540');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }))
    context.drawImage(avatar, 44, 163, 90, 90)


    const applyText = (canvas, text) => {
      const context = canvas.getContext('2d');
      let fontSize = 43;
      do {
        context.font = `${fontSize -= 10}px sans-serif`;
      } while (context.measureText(text).width > canvas.width - 85);
      return context.font;
    }

    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.font = applyText(canvas, `${member.displayName}`);
    context.fillStyle = '#FFF';
    context.fillText(`${member.displayName}`, canvas.width / 2.6, canvas.height / 1.80);

    const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image-dunge-b.png');

    channel.send({ files: [attachment] }).catch(e => { })

  }

})

client.on("guildMemberAdd", async member => {
  // resimli giriş sistemi
  let giris = await db2.fetch(`rgiris_${member.guild.id}`)
  if (giris) {
    let channel = member.guild.channels.cache.get(giris)
    if (!channel) return

    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas(640, 360);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage('https://media.discordapp.net/attachments/1076546621585764513/1079013626771423254/Lourity_Media_Banner.png?width=960&height=540');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }))
    context.drawImage(avatar, 44, 163, 90, 90)


    const applyText = (canvas, text) => {
      const context = canvas.getContext('2d');
      let fontSize = 43;
      do {
        context.font = `${fontSize -= 10}px sans-serif`;
      } while (context.measureText(text).width > canvas.width - 85);
      return context.font;
    }

    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.font = applyText(canvas, `${member.displayName}`);
    context.fillStyle = '#FFF';
    context.fillText(`${member.displayName}`, canvas.width / 2.6, canvas.height / 1.80);

    const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image-dunge-b.png');

    channel.send({ files: [attachment] }).catch(e => { })
  }
})
//resimsiz giriş çıkış
client.on("guildMemberRemove", async member => {

  let rsgiris = await db2.fetch(`rsgiris_${member.guild.id}`)
  if (rsgiris) {
    let channel = member.guild.channels.cache.get(rsgiris)
    if (!channel) return
    let cksMetni = await db2.fetch(`cksmetin_${member.guild.id}`)
    if (cksMetni) {
      cksMetni = cksMetni.replace("{kullanıcı}", `${member.user.tag}`).replace("{sunucu}", `${member.guild.name}`).replace("{kişisayısı}", `${member.guild.memberCount}`).replace("{kullanıcı_etiket}", `${member}`)
    } else {
      cksMetni = `<:cikis:995786141204754572>  \`${member.user.tag}\` adlı kullanıcı sunucumuzdan ayrıldı. Burası \`${member.guild.name}\`, toplam üye sayımız \`${member.guild.memberCount}\`!`
    }
    channel.send({ content: cksMetni }).catch(e => { })
  }
})

client.on("guildMemberAdd", async member => {

  let rsgiris = await db2.fetch(`rsgiris_${member.guild.id}`)
  if (rsgiris) {
    let channel = member.guild.channels.cache.get(rsgiris)
    if (!channel) return
    let grsmetni = await db2.fetch(`grsmetni_${member.guild.id}`)
    if (grsmetni) {
      grsmetni = grsmetni.replace("{kullanıcı}", `${member.user.tag}`).replace("{sunucu}", `${member.guild.name}`).replace("{kişisayısı}", `${member.guild.memberCount}`).replace("{kullanıcı_etiket}", `${member}`)
    } else {
      grsmetni = `<:giris:995786135001382964>  \`${member.user.tag}\` sunucumuza hoşgeldin! Burası \`${member.guild.name}\`, toplam üye sayımız \`${member.guild.memberCount}\`!`
    }
    channel.send({ content: grsmetni }).catch(e => { })
  }
})


client.on("messageCreate", async message => {
  if (!message.guild) return
  if (message.author.bot) return
  const data1 = await db1.get(`reklam_${message.guild.id}`)
  const data2 = await db1.get(`küfür_${message.guild.id}`)
  const data3 = await db1.get(`link_${message.guild.id}`)
  const data4 = await db2.get(`saas_${message.guild.id}`)
  const data5 = await db1.get(`reklamkick_${message.guild.id}`)
  const data6 = await db1.get(`reklamban_${message.guild.id}`)
  const data7 = await db1.get(`ever_${message.guild.id}`)
  const data1channel = await db1.get(`reklamkanal_${message.guild.id}${message.channel.id}`)
  const data2channel = await db1.get(`küfürkanal_${message.guild.id}${message.channel.id}`)
  const data3channel = await db1.get(`linkkanal_${message.guild.id}${message.channel.id}`)
  const data4channel = await db1.get(`reklamkickkanal_${message.guild.id}${message.channel.id}`)
  const data5channel = await db1.get(`reklambankanal_${message.guild.id}${message.channel.id}`)
  const data6channel = await db1.get(`everkanal_${message.guild.id}${message.channel.id}`)

  if (!message.member.permissions.has("ADMINISTRATOR")) {
  if (data7) {
    if ((["@everyone", "@here"]).some(word => message.content.toLowerCase().includes(word))) {
      message.delete().catch(e => { })
      message.channel.send(`<:cross:980410756484956210>  <@${message.author.id}> etiket içerikli mesaj yazmamalısın!`).catch(e => { })
    }
  } else {
    if (data6channel) {
      if ((["@everyone", "@here"]).some(word => message.content.toLowerCase().includes(word))) {
        message.delete().catch(e => { })
        message.channel.send(`<:cross:980410756484956210>  <@${message.author.id}> etiket içerikli mesaj yazmamalısın!`).catch(e => { })
      }
    }
  }

}

  if (!message.member.permissions.has("ADMINISTRATOR")) {
    if (!data3) {
      if (data1) {
        if ((["discord.gg", "discordapp.com/invite", "discord.me", "discord.io", "discord.com/invite"]).some(word => message.content.toLowerCase().includes(word))) {
          message.delete().catch(e => { })
          message.channel.send(`<:cross:980410756484956210>  <@${message.author.id}> reklam yapmamalısın!`).catch(e => { })
        }
      } else {
        if (data1channel) {
          if ((["discord.gg", "discordapp.com/invite", "discord.me", "discord.io", "discord.com/invite"]).some(word => message.content.toLowerCase().includes(word))) {
            message.delete().catch(e => { })
            message.channel.send(`<:cross:980410756484956210>  <@${message.author.id}> reklam yapmamalısın!`).catch(e => { })
          }
        }
      }
    }

    if (data2) {
      let küfürler = ["sik", "aq", "sikik", "sikko", "yarrak", "yarak", "oç", "oruspu", "orospu", "piç", "allahsız", "anneni sikeyim", "sikeyim", "amk", "mk", "malak", "kahbe", "kahpe"]
      if (küfürler.some(word => message.content.toLowerCase().includes(word))) {
        message.delete().catch(e => { })
        message.channel.send(`<:cross:980410756484956210>  <@${message.author.id}> küfür içerikli mesaj yazmamalısın!`).catch(e => { })
      }
    } else {
      if (data2channel) {
        let küfürler = ["sik", "aq", "sikik", "sikko", "yarrak", "yarak", "oç", "oruspu", "orospu", "piç", "allahsız", "anneni sikeyim", "sikeyim", "amk", "mk", "malak", "kahbe", "kahpe"]
        if (küfürler.some(word => message.content.toLowerCase().includes(word))) {
          message.delete().catch(e => { })
          message.channel.send(`<:cross:980410756484956210>  <@${message.author.id}> küfür içerikli mesaj yazmamalısın!`).catch(e => { })
        }
      }
    }

    if (data3) {
      if ((["http", "https", "http://", "https://", ".com", ".org", ".net", ".xyz", "discord.gg", "discordapp.com/invite", "discord.me", "discord.io", "discord.com/invite"]).some(word => message.content.toLowerCase().includes(word))) {
        message.delete().catch(e => { })
        message.channel.send(`<:cross:980410756484956210>  <@${message.author.id}> link içerikli mesaj yazmamalısın!`).catch(e => { })
      }
    } else {
      if (data3channel) {
        if ((["http", "https", "http://", "https://", ".com", ".org", ".net", ".xyz", "discord.gg", "discordapp.com/invite", "discord.me", "discord.io", "discord.com/invite"]).some(word => message.content.toLowerCase().includes(word))) {
          message.delete().catch(e => { })
          message.channel.send(`<:cross:980410756484956210>  <@${message.author.id}> link içerikli mesaj yazmamalısın!`).catch(e => { })
        }
      }
    }

  }

  if (data4) {

    if (["sa", "sea", "Sa", "SA", "Sea"].includes(message.content)) {
      message.reply("**Aleykümselam hoşgeldin!** <a:alks:989165053280399441>").catch(e => { })
    }
  }

  if (!message.member.permissions.has("ADMINISTRATOR")) {
    if (!data6) {
      if (data5) {
        if ((["discord.gg", "discordapp.com/invite", "discord.me", "discord.io", "discord.com/invite"]).some(word => message.content.toLowerCase().includes(word))) {
          await db2.add(`reklamkickuser_${message.author.id}`, 1)
          const adscount = await db2.fetch(`reklamkickuser_${message.author.id}`)
          message.delete().catch(e => { })
          if (adscount > 3) {
            await message.member.kick().then(async cs => {
              await db2.delete(`reklamkickuser_${message.author.id}`)
              await message.channel.send(`<:cross:980410756484956210>  \`${message.author.tag}\` çok fazla reklam yaptığın için sunucudan atıldın!`).catch(e => { })
            }).catch(e => {
              return message.channel.send(`<:cross:980410756484956210>  <@${message.author.id}> çok fazla reklam yaptı, onu atmak için yetkim yetmiyor!`).catch(e => { })
            })

          } else {
            message.channel.send(`<:cross:980410756484956210>  <@${message.author.id}> reklam yapmamalısın, eğer yapmaya devam edersen sunucudan atılacaksın!`).catch(e => { })
          }
        }
      } else {
        if (data4channel) {
          if ((["discord.gg", "discordapp.com/invite", "discord.me", "discord.io", "discord.com/invite"]).some(word => message.content.toLowerCase().includes(word))) {
            await db2.add(`reklamkickuser_${message.author.id}`, 1)
            const adscount = await db2.fetch(`reklamkickuser_${message.author.id}`)
            message.delete().catch(e => { })
            if (adscount > 3) {
              await message.member.kick().then(async cs => {
                await db2.delete(`reklamkickuser_${message.author.id}`)
                await message.channel.send(`<:cross:980410756484956210>  \`${message.author.tag}\` çok fazla reklam yaptığın için sunucudan atıldın!`).catch(e => { })
              }).catch(e => {
                return message.channel.send(`<:cross:980410756484956210>  <@${message.author.id}> çok fazla reklam yaptı, onu atmak için yetkim yetmiyor!`).catch(e => { })
              })
            } else {
              message.channel.send(`<:cross:980410756484956210>  <@${message.author.id}> reklam yapmamalısın, eğer yapmaya devam edersen sunucudan atılacaksın!`).catch(e => { })
            }
          }
        }
      }
    }


    if (data6) {
      if ((["discord.gg", "discordapp.com/invite", "discord.me", "discord.io", "discord.com/invite"]).some(word => message.content.toLowerCase().includes(word))) {
        await db2.add(`reklambanuser_${message.author.id}`, 1)
        const adscount = await db2.fetch(`reklambanuser_${message.author.id}`)
        message.delete().catch(e => { })
        if (adscount > 3) {
          await message.member.ban().then(async cs => {
            await db2.delete(`reklambanuser_${message.author.id}`)
            await message.channel.send(`<:cross:980410756484956210>  \`${message.author.tag}\` çok fazla reklam yaptığın için sunucudan yasaklandın!`).catch(e => { })
          }).catch(e => {
            return message.channel.send(`<:cross:980410756484956210>  <@${message.author.id}> çok fazla reklam yaptı, onu yasaklamak için yetkim yetmiyor!`).catch(e => { })
          })

        } else {
          message.channel.send(`<:cross:980410756484956210>  <@${message.author.id}> reklam yapmamalısın, eğer yapmaya devam edersen sunucudan yasaklanacaksın!`).catch(e => { })
        }
      }
    } else {
      if (data5channel) {
        if ((["discord.gg", "discordapp.com/invite", "discord.me", "discord.io", "discord.com/invite"]).some(word => message.content.toLowerCase().includes(word))) {
          await db2.add(`reklambanuser_${message.author.id}`, 1)
          const adscount = await db2.fetch(`reklambanuser_${message.author.id}`)
          message.delete().catch(e => { })
          if (adscount > 3) {
            await message.member.ban().then(async cs => {
              await db2.delete(`reklambanuser_${message.author.id}`)
              await message.channel.send(`<:cross:980410756484956210>  \`${message.author.tag}\` çok fazla reklam yaptığın için sunucudan yasaklandın!`).catch(e => { })
            }).catch(e => {
              return message.channel.send(`<:cross:980410756484956210>  <@${message.author.id}> çok fazla reklam yaptı, onu yasaklamak için yetkim yetmiyor!`).catch(e => { })
            })
          } else {
            message.channel.send(`<:cross:980410756484956210>  <@${message.author.id}> reklam yapmamalısın, eğer yapmaya devam edersen sunucudan yasaklanacaksın!`).catch(e => { })
          }
        }
      }
    }
  }

})

client.on("messageCreate", async message => {
  if (!message.guild) return
  if (message.author.bot) return
  const data7 = await db1.get(`otocevap.${message.guild.id}`)
  const data8 = await db3.get(`afk_${message.author.id}${message.guild.id}`)
  const data10 = await db2.get(`etiketengel_${message.guild.id}`)

  if (data8) {
    const csms = require("pretty-ms")
    let süre = data8.time
    let zaman = csms(Date.now() - süre);
    await db3.delete(`afk_${message.author.id}${message.guild.id}`);
    message.member.setNickname(data8.oldName).catch(e => { })

    const afk_cikis = new MessageEmbed()
      .setColor("BLUE")
      .setDescription(
        `**<@${message.author.id}>,  \`${zaman}\` süre boyunca AFK modundaydın!**`
      );
    message.channel.send({ embeds: [afk_cikis] }).catch(e => { })
  }

  var kullanıcı = message.mentions.users.first()
  if (kullanıcı) {
    const data9 = await db3.fetch(`afk_${kullanıcı.id}${message.guild.id}`);
    if (data9) {
      const csms = require("pretty-ms")
      var sebep = data9.sebep

      if (sebep) {
        let süre = data9.time
        let zaman = csms(Date.now() - süre);

        const afk_uyarı = new MessageEmbed()
          .setColor("BLUE")
          .setDescription(
            `**<@${kullanıcı.id}> adlı kullanıcı \`${sebep}\` sebebiyle; \`${zaman}\` süredir AFK!**`
          );
        message.reply({ embeds: [afk_uyarı] }).catch(e => { })
      }
    }
  }


  if (data10) {
    if (message.member.permissions.has("MANAGE_GUILD")) return
    const user = message.mentions.members.first()
    if (user) {
      if (user.permissions.has("ADMINISTRATOR")) {
        await message.delete().catch(e => { })
        await message.member.timeout(60000, { reason: "Yöneticileri etiketlemek yasak! Bu yüzden **1 dakika** boyunca susturuldun!" }).catch(e => { })
        message.channel.send(`<:cross:980410756484956210>  <@${message.author.id}>, Yöneticileri etiketlemek yasak! Bu yüzden **1 dakika** boyunca susturuldun!`).catch(e => { })
      }
    }
  }

  if (data7) {
    data7.map(async r => {
      if (r.message.includes(message.content.toLowerCase())) {
        message.reply(`` + r.reply + ``).catch(e => { })
      }
    })
  }

})

client.on("guildCreate", async guild => {
  const data = await db1.get("sea_" + client.user.id)
  if (data) {
    const channel = client.channels.cache.get(data)
    if (channel) {

      const embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("Sunucuya Eklendi!")
        .setDescription(`**Sunucu Adı: \`${guild.name}\`\nSunucu ID: \`${guild.id}\`\nSunucu Sahibi: \`${client.users.cache.get(guild.ownerId).tag}\`\nSunucu Sahibi ID: \`${guild.ownerId}\`\nSunucu Üye Sayısı: \`${guild.memberCount}\`**`)
        .setFooter({ text: `${client.user.username} | Sunucuya Eklendi!` })
        .setTimestamp()
      channel.send({ embeds: [embed] })
    }
  }
})

client.on("guildDelete", async guild => {
  const data = await db1.get("sea_" + client.user.id)
  if (data) {
    const channel = client.channels.cache.get(data)
    if (channel) {

      const embed = new MessageEmbed()
        .setColor("RED")
        .setTitle("Sunucudan Atıldı!")
        .setDescription(`**Sunucu Adı: \`${guild.name}\`\nSunucu ID: \`${guild.id}\`\nSunucu Sahibi: \`${client.users.cache.get(guild.ownerId).tag}\`\nSunucu Sahibi ID: \`${guild.ownerId}\`\nSunucu Üye Sayısı: \`${guild.memberCount}\`**`)
        .setFooter({ text: `${client.user.username} | Sunucudan Atıldı!` })
        .setTimestamp()
      channel.send({ embeds: [embed] })
    }
  }
})



client.on("ready", async () => {
  setInterval(async () => {
    client.guilds.cache.map(async guild => {
      guild.members.cache.map(async member => {
        const data = await db3.get(`muted_${guild.id}${member.id}`)
        if (data) {
          if (data.date + data.time < Date.now()) {
            await member.roles.remove(data.role).catch(e => { })
            await db3.delete(`muted_${guild.id}${member.id}`)
            const channel = guild.channels.cache.get(data.log)
            if (channel) {
              await member.send(`<:time:980410756036169758>  \`${guild.name}\` adlı sunucudaki cezanız sona erdi!`).catch(e => { })
              const embed = new MessageEmbed()
                .setColor('BLUE')
                .setTitle('Mute Kalktı!')
                .setDescription(`<:time:980410756036169758>  **${member.user.tag}** adlı kullanıcının mute süresi doldu!`)
                .setFooter({ text: `${guild.members.cache.get(data.author).user.tag} tarafından işlem yapıldı!` })
                .setTimestamp()
              await channel.send({ embeds: [embed] }).catch(e => { })
            }
          } else {
            await member.roles.add(data.role).catch(e => { })
          }
        }
      })
    })



    let data2 = await db3.get(`banned`)
    if (data2) {
      data2 = Object.keys(data2)
      data2.map(async mr => {
        const dayta = await db3.get(`banned.${mr}`)
        if (dayta) {
          if (dayta.date + dayta.time < Date.now()) {
            const guild = client.guilds.cache.get(dayta.guild)
            if (guild) {
              await guild.members.unban(dayta.user).catch(e => { })
              await db3.delete(`banned.${guild.id}${dayta.user}`)
            } else {
              await db3.delete(`banned.${guild.id}${dayta.user}`)
            }
          }
        }
      })
    }

    let data3 = await db3.get(`notlar`)
    if (data3) {
      data3 = Object.keys(data3)
      data3.map(async mr => {
        const dayta = await db3.get(`notlar.${mr}`)
        if (dayta) {
          if (dayta.date + dayta.time < Date.now()) {
            const user = client.users.cache.get(dayta.user)
            if (user) {
              await db3.delete(`notlar.${dayta.user}`)
              await user.send(`<:time:980410756036169758>  <@${dayta.user}>, \`${dayta.note}\` adlı notunuz sona erdi! (Kayıt Tarihi: <t:${Math.floor(dayta.date / 1000)}:F>)`).catch(async e => {
                const guild = client.guilds.cache.get(dayta.guild)
                if (guild) {
                  let user2 = guild.members.cache.get(dayta.user)
                  if (user2) {
                    let channel = guild.channels.cache.get(dayta.channel)
                    if (channel) {
                      await channel.send(`<:time:980410756036169758>  <@${dayta.user}>, \`${dayta.note}\` adlı notunuz sona erdi! (Kayıt Tarihi: <t:${Math.floor(dayta.date / 1000)}:F>)`).catch(e => { })
                      await db3.delete(`notlar.${dayta.user}`)
                    }
                  }
                }
              })
            } else {
              await db3.delete(`notlar.${dayta.user}`)
            }
          }
        }
      })
    }

  }, 10000)
})


client.on("channelCreate", async channel => {
  const data = await db3.get(`modlog_${channel.guild.id}`)
  if (data) {
    var logChannel = channel.guild.channels.cache.get(data)
    if (!logChannel) return;

    var fetchedLogs = await channel.guild.fetchAuditLogs({
      limit: 1,
      type: "CHANNEL_CREATE",
    });

    var channelLog = fetchedLogs.entries.first();

    var embed = new MessageEmbed()
      .setDescription(`Oluşturulan Kanal: ${channel}`)
      .setColor(channel.guild.me.displayHexColor)
      .addField(`Kanalı Oluşturan Üye`, `${channelLog.executor} \`(${channelLog.executor.id})\``)
      .addField(`Oluşturulduğu Zaman`, "<t:" + Math.floor(Date.now() / 1000) + ":F>")
      .addField(
        `ID`,
        `\`\`\`\nKullanıcı = ${channelLog.executor.id}\nKanal = ${channel.id}\n\`\`\``)
      .setTimestamp();
    logChannel.send({ embeds: [embed] }).catch(e => { })
  }
})

client.on("channelDelete", async channel => {
  const data = await db3.get(`modlog_${channel.guild.id}`)
  if (data) {
    var logChannel = channel.guild.channels.cache.get(data)
    if (!logChannel) return;

    var fetchedLogs = await channel.guild.fetchAuditLogs({
      limit: 1,
      type: "CHANNEL_DELETE",
    });

    var channelLog = fetchedLogs.entries.first();

    var embed = new MessageEmbed()
      .setDescription(`Silinen Kanal: \`${channelLog.target.name}\``)
      .setColor(channel.guild.me.displayHexColor)
      .addField(
        `Kanalı Silen Üye`,
        `${channelLog.executor} \`(${channelLog.executor.id})\``
      )
      .addField(`Silindiği Zaman`, "<t:" + Math.floor(Date.now() / 1000) + ":F>")
      .addField(
        `ID`,
        `\`\`\`\nKullanıcı = ${channelLog.executor.id} \nKanal = ${channel.id}\n\`\`\``
      )
      .setTimestamp();
    logChannel.send({ embeds: [embed] }).catch(e => { })
  }
})


client.on("channelUpdate", async (oldChannel, newChannel) => {
  const data = await db3.get(`modlog_${oldChannel.guild.id}`)
  if (data) {
    var logChannel = oldChannel.guild.channels.cache.get(data)
    if (!logChannel) return;

    var fetchedLogs = await oldChannel.guild.fetchAuditLogs({
      limit: 1,
      type: "CHANNEL_UPDATE",
    });

    var channelLog = fetchedLogs.entries.first();

    if (oldChannel.name !== newChannel.name) {
      var embed = new MessageEmbed()
        .setDescription(`Kanal İsmi Güncellendi ${oldChannel}`)
        .setColor(newChannel.guild.me.displayHexColor)
        .addField(
          `Kanalı Düzenleyen Üye`,
          `${channelLog.executor} \`(${channelLog.executor.id})\``
        )
        .addField(
          `Kanal İsmi`,
          `Eski: ${oldChannel.name} Yeni: ${newChannel.name}`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${channelLog.executor.id}\nKanal = ${oldChannel.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldChannel.topic !== newChannel.topic) {
      var embed = new MessageEmbed()
        .setDescription(`Kanal Başlığı Güncellendi ${oldChannel}`)
        .setColor(newChannel.guild.me.displayHexColor)
        .addField(
          `Kanalı Düzenleyen Üye`,
          `${channelLog.executor} \`(${channelLog.executor.id})\``
        )
        .addField(
          `Kanal Başlığı`,
          `Eski: ${(oldChannel.topic === null && `Başlık Bulunmuyor`) ||
          `${oldChannel.topic}`
          } Yeni: ${(newChannel.topic === null && `Başlık Bulunmuyor`) ||
          `${newChannel.topic}`
          }`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${channelLog.executor.id}\nKanal = ${oldChannel.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldChannel.nsfw !== newChannel.nsfw) {
      var embed = new MessageEmbed()
        .setDescription(`Kanal NSFW Güncellendi ${oldChannel}`)
        .setColor(newChannel.guild.me.displayHexColor)
        .addField(
          `Kanalı Düzenleyen Üye`,
          `${channelLog.executor} \`(${channelLog.executor.id})\``
        )
        .addField(
          `Kanal NSFW`,
          `Eski: ${(oldChannel.nsfw === false && `Kapalı`) || `Açık`} Yeni: ${(newChannel.nsfw === false && `Kapalı`) || `Açık`
          }`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${channelLog.executor.id}\nKanal = ${oldChannel.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldChannel.bitrate !== newChannel.bitrate) {
      var embed = new MessageEmbed()
        .setDescription(`Kanal Bitrate Güncellendi ${oldChannel}`)
        .setColor(newChannel.guild.me.displayHexColor)
        .addField(
          `Kanalı Düzenleyen Üye`,
          `${channelLog.executor} \`(${channelLog.executor.id})\``
        )
        .addField(
          `Kanal Bitrate`,
          `Eski: ${oldChannel.bitrate.toLocaleString()} Yeni: ${newChannel.bitrate.toLocaleString()}`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${channelLog.executor.id}\nKanal = ${oldChannel.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldChannel.userLimit !== newChannel.userLimit) {
      var embed = new MessageEmbed()
        .setDescription(`Kanal Kullanıcı Limit Güncellendi ${oldChannel}`)
        .setColor(newChannel.guild.me.displayHexColor)
        .addField(
          `Kanalı Düzenleyen Üye`,
          `${channelLog.executor} \`(${channelLog.executor.id})\``
        )
        .addField(
          `Kanal Kullanıcı Limit`,
          `Eski: ${oldChannel.userLimit} Yeni: ${newChannel.userLimit}`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${channelLog.executor.id}\nKanal = ${oldChannel.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldChannel.parent !== newChannel.parent) {
      var embed = new MessageEmbed()
        .setDescription(`Kanal Kategori Güncellendi ${oldChannel}`)
        .setColor(newChannel.guild.me.displayHexColor)
        .addField(
          `Kanalı Düzenleyen Üye`,
          `${channelLog.executor} \`(${channelLog.executor.id})\``
        )
        .addField(
          `Kanal Kategori`,
          `Eski: ${oldChannel.parent} Yeni: ${newChannel.parent}`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${channelLog.executor.id}\nKanal = ${oldChannel.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
      var embed = new MessageEmbed()
        .setDescription(`Kanal Zaman Aşımı Güncellendi ${oldChannel}`)
        .setColor(newChannel.guild.me.displayHexColor)
        .addField(
          `Kanalı Düzenleyen Üye`,
          `${channelLog.executor} \`(${channelLog.executor.id})\``
        )
        .addField(
          `Kanal Yavaş Mod`,
          `Eski: ${oldChannel.rateLimitPerUser} Yeni: ${newChannel.rateLimitPerUser}`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${channelLog.executor.id}\nKanal = ${oldChannel.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldChannel.rtcRegion !== newChannel.rtcRegion) {
      var embed = new MessageEmbed()
        .setDescription(`Kanal RTC Bölge Güncellendi ${oldChannel}`)
        .setColor(newChannel.guild.me.displayHexColor)
        .addField(
          `Kanalı Düzenleyen Üye`,
          `${channelLog.executor} \`(${channelLog.executor.id})\``
        )
        .addField(
          `Kanal Bölge`,
          `Eski: ${oldChannel.rtcRegion === null && `Bulunamıyor`} Yeni: ${newChannel.rtcRegion
          }`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${channelLog.executor.id}\nKanal = ${oldChannel.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }


  }
})




client.on("guildMemberRoleAdd", async (member, role) => {
  const data = await db3.get(`modlog_${member.guild.id}`)
  if (data) {
    var logChannel = member.guild.channels.cache.get(data)
    if (!logChannel) return;

    var fetchedLogs = await member.guild.fetchAuditLogs({
      limit: 1,
      type: "MEMBER_ROLE_UPDATE",
    });

    var memberLog = fetchedLogs.entries.first();

    var embed = new MessageEmbed()
      .setDescription(`Rol Verildi \`${member.user.tag}\``)
      .setColor(member.guild.me.displayHexColor)
      .addField(`Üye`, `${member.user} \`(${member.user.id})\``)
      .addField(
        `Verilen Rol`,
        `${role ? role : `Bulunamıyor.`} \`(${role.id ? role.id : `Bulunamıyor.`
        })\``
      )
      .addField(`Verildiği Zaman`, "<t:" + Math.floor(Date.now() / 1000) + ":F>")
      .addField(
        `ID`,
        `\`\`\`\nKullanıcı = ${memberLog.executor.id}\nSunucu = ${member.guild.id}\n\`\`\``
      )
      .setTimestamp();
    logChannel.send({ embeds: [embed] }).catch(e => { })

  }
})




client.on("guildMemberRoleRemove", async (member, role) => {
  const data = await db3.get(`modlog_${member.guild.id}`)
  if (data) {
    var logChannel = member.guild.channels.cache.get(data)
    if (!logChannel) return;

    var fetchedLogs = await member.guild.fetchAuditLogs({
      limit: 1,
      type: "MEMBER_ROLE_UPDATE",
    });

    var memberLog = fetchedLogs.entries.first();

    var embed = new MessageEmbed()
      .setDescription(`Rol Alındı \`${member.user.tag}\``)
      .setColor(member.guild.me.displayHexColor)
      .addField(`Üye`, `${member.user} \`(${member.user.id})\``)
      .addField(
        `Alınan Rol`,
        `${role ? role : `Bulunamıyor`} \`(${role.id ? role.id : `Bulunamıyor`
        })\``
      )
      .addField(`Alındığı Zaman`, "<t:" + Math.floor(Date.now() / 1000) + ":F>")
      .addField(
        `ID`,
        `\`\`\`\nKullanıcı = ${memberLog.executor.id}\nSunucu = ${member.guild.id}\n\`\`\``
      )
      .setTimestamp();
    logChannel.send({ embeds: [embed] }).catch(e => { })

  }
})




client.on("messageDelete", async (message) => {
  const data = await db3.get(`modlog_${message.guild.id}`)
  if (data) {
    var logChannel = message.guild.channels.cache.get(data)
    if (!logChannel) return;

    var embed = new MessageEmbed()
      .setDescription(`Mesaj şurada silindi: ${message.channel}`)
      .setColor(message.guild.me.displayHexColor)
      .addField(`Mesaj İçeriği`, `${message.content}`)
      .addField(
        `Atıldığı Zaman`,
        "<t:" + Math.floor(message.createdTimestamp / 1000) + ":F>"
      )
      .addField(`Silindiği Zaman`, "<t:" + Math.floor(Date.now() / 1000) + ":F>")
      .addField(
        `ID`,
        `\`\`\`\nKullanıcı = ${message.author.id}\nMesaj = ${message.id}\n\`\`\``
      )
      .setTimestamp();
    logChannel.send({ embeds: [embed] }).catch(e => { })

  }
})





client.on("messageDeleteBulk", async (messages) => {
  const data = await db3.get(`modlog_${messages.first().guild.id}`)
  if (data) {
    var logChannel = messages.first().guild.channels.cache.get(data)
    if (!logChannel) return;
    const moment = require("moment");
    const hastebin = require("hastebin-gen");

    hastebin(
      messages
        .filter((x) => !x.author.bot)
        .map(
          (x) =>
            `Mesaj Sahibi: ${x.author.tag} (${x.author.id}) \nMesaj İçeriği: ${x.content
            } \nAtıldığı Zaman: ${moment(x.createdTimestamp).format("LLL")} \n`
        )
        .join("\n"),
      { extension: "txt" }
    ).then((haste) => {
      var embed = new MessageEmbed()
        .setDescription(
          `Toplam \`${messages.map((x) => x.content).length
          }\` mesaj silindi. \nMesajlar şurada silindi: ${messages.first().channel
          }`
        )
        .setColor(messages.first().guild.me.displayHexColor)
        .addField(`Mesaj İçeriği`, `${haste}`)
        .addField(
          `Silindiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${messages.first().author.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    })

  }
})




client.on("messageUpdate", async (oldMessage, newMessage) => {
  const data = await db3.get(`modlog_${oldMessage.guild.id}`)
  if (data) {
    var logChannel = oldMessage.guild.channels.cache.get(data)
    if (!logChannel) return;

    var embed = new MessageEmbed()
      .setDescription(`Mesaj şurada düzenlendi: ${oldMessage.channel}`)
      .setColor(oldMessage.guild.me.displayHexColor)
      .addField(
        `Mesaj İçeriği`,
        `\`Eski:\` ${oldMessage.content} \`Yeni:\` ${newMessage.content}`
      )
      .addField(
        `Atıldığı Zaman`,
        "<t:" + Math.floor(oldMessage.createdTimestamp / 1000) + ":F>"
      )
      .addField(
        `Düzenlendiği Zaman`,
        "<t:" + Math.floor(newMessage.createdTimestamp / 1000) + ":F>"
      )
      .addField(
        `ID`,
        `\`\`\`\nKullanıcı = ${oldMessage.author.id}\nMesaj = ${oldMessage.id}\n\`\`\``
      )
      .setTimestamp();
    logChannel.send({ embeds: [embed] }).catch(e => { })

  }
})




client.on("roleCreate", async (role) => {
  const data = await db3.get(`modlog_${role.guild.id}`)
  if (data) {
    var logChannel = role.guild.channels.cache.get(data)
    if (!logChannel) return;

    var fetchedLogs = await role.guild.fetchAuditLogs({
      limit: 1,
      type: "ROLE_CREATE",
    });

    var roleLog = fetchedLogs.entries.first();

    var embed = new MessageEmbed()
      .setDescription(`Oluşturulan Rol: ${role}`)
      .setColor(role.guild.me.displayHexColor)
      .addField(
        `Rolü Oluşturan Üye`,
        `${roleLog.executor} \`(${roleLog.executor.id})\``
      )
      .addField(
        `Oluşturulduğu Zaman`,
        "<t:" + Math.floor(role.createdTimestamp / 1000) + ":F>"
      )
      .addField(
        `ID`,
        `\`\`\`\nKullanıcı = ${roleLog.executor.id}\nRol = ${role.id}\n\`\`\``
      )
      .setTimestamp();
    logChannel.send({ embeds: [embed] }).catch(e => { })

  }
})





client.on("roleDelete", async (role) => {
  const data = await db3.get(`modlog_${role.guild.id}`)
  if (data) {
    var logChannel = role.guild.channels.cache.get(data)
    if (!logChannel) return;

    var fetchedLogs = await role.guild.fetchAuditLogs({
      limit: 1,
      type: "ROLE_DELETE",
    });

    var roleLog = fetchedLogs.entries.first();

    var embed = new MessageEmbed()
      .setDescription(`Silinen Rol: \`${role.name}\``)
      .setColor(role.guild.me.displayHexColor)
      .addField(
        `Rolü Silen Üye`,
        `${roleLog.executor} \`(${roleLog.executor.id})\``
      )
      .addField(
        `Oluşturulduğu Zaman`,
        "<t:" + Math.floor(role.createdTimestamp / 1000) + ":F>"
      )
      .addField(`Silindiği Zaman`, "<t:" + Math.floor(Date.now() / 1000) + ":F>")
      .addField(
        `ID`,
        `\`\`\`\nKullanıcı = ${roleLog.executor.id}\nRol = ${role.id}\n\`\`\``
      )
      .setTimestamp();
    logChannel.send({ embeds: [embed] }).catch(e => { })

  }
})





client.on("roleUpdate", async (oldRole, newRole) => {
  const data = await db3.get(`modlog_${oldRole.guild.id}`)
  if (data) {
    var logChannel = oldRole.guild.channels.cache.get(data)
    if (!logChannel) return;

    var fetchedLogs = await newRole.guild.fetchAuditLogs({
      limit: 1,
      type: "ROLE_UPDATE",
    });

    var roleLog = fetchedLogs.entries.first();

    var perms = {
      CREATE_INSTANT_INVITE: "CREATE_INSTANT_INVITE",
      KICK_MEMBERS: "KICK_MEMBERS",
      BAN_MEMBERS: "BAN_MEMBERS",
      ADMINISTRATOR: "ADMINISTRATOR",
      MANAGE_CHANNELS: "MANAGE_CHANNELS",
      MANAGE_GUILD: "MANAGE_GUILD",
      ADD_REACTIONS: "ADD_REACTIONS",
      VIEW_AUDIT_LOG: "VIEW_AUDIT_LOG",
      PRIORITY_SPEAKER: "PRIORITY_SPEAKER",
      STREAM: "STREAM",
      VIEW_CHANNEL: "VIEW_CHANNEL",
      SEND_MESSAGES: "SEND_MESSAGES",
      SEND_TTS_MESSAGES: "SEND_TTS_MESSAGES",
      MANAGE_MESSAGES: "MANAGE_MESSAGES",
      EMBED_LINKS: "EMBED_LINKS",
      ATTACH_FILES: "ATTACH_FILES",
      READ_MESSAGE_HISTORY: "READ_MESSAGE_HISTORY",
      MENTION_EVERYONE: "MENTION_EVERYONE",
      USE_EXTERNAL_EMOJIS: "USE_EXTERNAL_EMOJIS",
      VIEW_GUILD_INSIGHTS: "VIEW_GUILD_INSIGHTS",
      CONNECT: "CONNECT",
      SPEAK: "SPEAK",
      MUTE_MEMBERS: "MUTE_MEMBERS",
      DEAFEN_MEMBERS: "DEAFEN_MEMBERS",
      MOVE_MEMBERS: "MOVE_MEMBERS",
      USE_VAD: "USE_VAD",
      CHANGE_NICKNAME: "CHANGE_NICKNAME",
      MANAGE_NICKNAMES: "MANAGE_NICKNAMES",
      MANAGE_ROLES: "MANAGE_ROLES",
      MANAGE_WEBHOOKS: "MANAGE_WEBHOOKS",
      MANAGE_EMOJIS_AND_STICKERS: "MANAGE_EMOJIS_AND_STICKERS",
      USE_APPLICATION_COMMANDS: "USE_APPLICATION_COMMANDS",
      REQUEST_TO_SPEAK: "REQUEST_TO_SPEAK",
      MANAGE_THREADS: "MANAGE_THREADS",
      USE_PUBLIC_THREADS: "USE_PUBLIC_THREADS",
      CREATE_PUBLIC_THREADS: "CREATE_PUBLIC_THREADS",
      USE_PRIVATE_THREADS: "USE_PRIVATE_THREADS",
      CREATE_PRIVATE_THREADS: "CREATE_PRIVATE_THREADS",
      USE_EXTERNAL_STICKERS: "USE_EXTERNAL_STICKERS",
      SEND_MESSAGES_IN_THREADS: "SEND_MESSAGES_IN_THREADS",
      START_EMBEDDED_ACTIVITIES: "START_EMBEDDED_ACTIVITIES",
    };

    if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
      const oldPermissions = newRole.permissions
        .toArray()
        .filter((x) => !oldRole.permissions.toArray().includes(x));

      const newPermissions = oldRole.permissions
        .toArray()
        .filter((x) => !newRole.permissions.toArray().includes(x));

      var embed = new MessageEmbed()
        .setDescription(`Rol İzini Güncellendi \`${newRole.name}\``)
        .setColor(newRole.guild.me.displayHexColor)
        .addField(
          `Rolü Düzenleyen Üye`,
          `${roleLog.executor} \`(${roleLog.executor.id})\``
        )
        .addField(
          `Eklenen İzinler`,
          `\`\`\`diff\n${oldPermissions.map((perm) => `+ ${perms[perm]}`).join("\n") ||
          `Hiç bir izin eklenmemiş!`
          }\n\`\`\``
        )
        .addField(
          `Çıkartılan İzinler`,
          `\`\`\`diff\n${newPermissions.map((perm) => `- ${perms[perm]}`).join("\n") ||
          `Hiç bir izin çıkartılmamış!`
          }\n\`\`\``
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${roleLog.executor.id}\nRol = ${oldRole.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldRole.name !== newRole.name) {
      var embed = new MessageEmbed()
        .setDescription(`Rol İsmi Güncellendi \`${oldRole.name}\``)
        .setColor(newRole.guild.me.displayHexColor)
        .addField(
          `Rolü Düzenleyen Üye`,
          `${roleLog.executor} \`(${roleLog.executor.id})\``
        )
        .addField(`Rol İsmi`, `Eski: ${oldRole.name} Yeni: ${newRole.name}`)
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${roleLog.executor.id}\nRol = ${oldRole.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldRole.hexColor !== newRole.hexColor) {
      var embed = new MessageEmbed()
        .setDescription(`Rol Rengi Güncellendi \`${oldRole.name}\``)
        .setColor(newRole.guild.me.displayHexColor)
        .addField(
          `Rolü Düzenleyen Üye`,
          `${roleLog.executor} \`(${roleLog.executor.id})\``
        )
        .addField(
          `Rol Rengi`,
          `Eski: ${oldRole.hexColor} Yeni: ${newRole.hexColor}`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${roleLog.executor.id}\nRol = ${oldRole.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldRole.hoist !== newRole.hoist) {
      var embed = new MessageEmbed()
        .setDescription(`Rol Güncellendi \`${oldRole.name}\``)
        .setColor(newRole.guild.me.displayHexColor)
        .addField(
          `Rolü Düzenleyen Üye`,
          `${roleLog.executor} \`(${roleLog.executor.id})\``
        )
        .addField(
          `Rolü Üyelerden Ayrı Göster`,
          `Eski: ${(oldRole.hoist === false && `Kapalı`) || `Açık`} Yeni: ${(newRole.hoist === false && `Kapalı`) || `Açık`
          }`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${roleLog.executor.id}\nRol = ${oldRole.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldRole.mentionable !== newRole.mentionable) {
      var embed = new MessageEmbed()
        .setDescription(`Rol Bahsedilebilirliği Güncellendi \`${oldRole.name}\``)
        .setColor(newRole.guild.me.displayHexColor)
        .addField(
          `Rolü Düzenleyen Üye`,
          `${roleLog.executor} \`(${roleLog.executor.id})\``
        )
        .addField(
          `Rol Bahsedilebilirliği`,
          `Eski: ${(oldRole.mentionable === false && `Kapalı`) || `Açık`} Yeni: ${(newRole.mentionable === false && `Kapalı`) || `Açık`
          }`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${roleLog.executor.id}\nRol = ${oldRole.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

  }
})


client.on("voiceChannelJoin", async (member, channel) => {
  const data = await db3.get(`modlog_${member.guild.id}`)
  if (data) {
    var logChannel = member.guild.channels.cache.get(data)
    if (!logChannel) return;

    var embed = new MessageEmbed()
      .setDescription(`\`${member.user.tag}\` bir kanala katıldı`)
      .setColor(channel.guild.me.displayHexColor)
      .addField(`Kanal`, `${channel} \`(${channel.id})\``)
      .addField(`Katıldığı Zaman`, "<t:" + Math.floor(Date.now() / 1000) + ":F>")
      .addField(
        `ID`,
        `\`\`\`\nKullanıcı = ${member.user.id}\nKanal = ${channel.id}\n\`\`\``
      )
      .setTimestamp();
    logChannel.send({ embeds: [embed] });

  }
})



client.on("voiceChannelLeave", async (member, channel) => {
  const data = await db3.get(`modlog_${member.guild.id}`)
  if (data) {
    var logChannel = member.guild.channels.cache.get(data)
    if (!logChannel) return;

    var embed = new MessageEmbed()
      .setDescription(`\`${member.user.tag}\` bir kanaldan ayrıldı`)
      .setColor(channel.guild.me.displayHexColor)
      .addField(`Kanal`, `${channel} \`(${channel.id})\``)
      .addField(`Ayrıldığı Zaman`, "<t:" + Math.floor(Date.now() / 1000) + ":F>")
      .addField(
        `ID`,
        `\`\`\`\nKullanıcı = ${member.user.id}\nKanal = ${channel.id}\n\`\`\``
      )
      .setTimestamp();
    logChannel.send({ embeds: [embed] });
  }
})



client.on("ready", async () => {
  if (db1.get("reactions")) {
    if (Object.keys(db1.get("reactions")).length == 0) {
      await db1.delete("reactions")
    }
  }
  setInterval(() => {
    if (db1.get("reactions")) {
      Object.entries(db1.get("reactions")).map(j => j[1]).flat().map(async mr => {
        if (mr) {
          const guild = client.guilds.cache.get(mr.guild)
          if (guild) {
            const channel = guild.channels.cache.get(mr.channel)
            if (channel) {
              channel.messages.fetch(mr.message).then(cs => {
              }).catch(async e => {
                await db1.unpush("reactions." + mr.guild, { messsage: mr.message })
                await db1.delete("messages-" + mr.guild)
                await db1.delete("channels-" + mr.guild)
              })
            } else {
              await db1.unpush("reactions." + mr.guild, { messsage: mr.message })
              await db1.delete("messages-" + mr.guild)
              await db1.delete("channels-" + mr.guild)
            }
          } else {
            await db1.delete("reactions." + mr.guild)
            await db1.delete("messages-" + mr.guild)
            await db1.delete("channels-" + mr.guild)
          }
        } else {
          await db1.unpush("reactions." + mr.guild, { messsage: mr.message })
          await db1.delete("messages-" + mr.guild)
          await db1.delete("channels-" + mr.guild)
        }
      })
    }
  }, 200000)
})



client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.guild) {
    if (db1.get("reactions." + reaction.message.guild.id)) {
      const data = Object.entries(db1.get("reactions." + reaction.message.guild.id)).filter(mr => mr[1].guild == reaction.message.guild.id).map(me => me[1].guild)
      if (data) {
        const data2 = Object.entries(db1.get("reactions." + reaction.message.guild.id)).filter(mr => mr[1].channel == reaction.message.channel.id).map(me => me[1].channel)
        if (data2) {
          const data3 = Object.entries(db1.get("reactions." + reaction.message.guild.id)).filter(mr => mr[1].message == reaction.message.id).map(me => me[1].message)
          if (data3) {
            let data4 = Object.entries(db1.get("reactions." + reaction.message.guild.id)).filter(mr => mr[1].emoji == reaction.emoji.name)
            if (data4) {
              data4.map(async cs => {
                const csr = reaction.message.guild.roles.cache.get(cs[1].role)
                if (csr) {
                  const csm = reaction.message.guild.members.cache.get(user.id)
                  if (csm) {
                    if (!csm.roles.cache.has(csr.id)) {
                      await csm.roles.add(csr.id)
                    }
                  }
                }
              })
            }
          }
        }
      }
    }
  }
})



client.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.message.guild) {
    if (db1.get("reactions." + reaction.message.guild.id)) {
      const data = Object.entries(db1.get("reactions." + reaction.message.guild.id)).filter(mr => mr[1].guild == reaction.message.guild.id).map(me => me[1].guild)
      if (data) {
        const data2 = Object.entries(db1.get("reactions." + reaction.message.guild.id)).filter(mr => mr[1].channel == reaction.message.channel.id).map(me => me[1].channel)
        if (data2) {
          const data3 = Object.entries(db1.get("reactions." + reaction.message.guild.id)).filter(mr => mr[1].message == reaction.message.id).map(me => me[1].message)
          if (data3) {
            let data4 = Object.entries(db1.get("reactions." + reaction.message.guild.id)).filter(mr => mr[1].emoji == reaction.emoji.name)
            if (data4) {
              data4.map(async cs => {
                const csr = reaction.message.guild.roles.cache.get(cs[1].role)
                if (csr) {
                  const csm = reaction.message.guild.members.cache.get(user.id)
                  if (csm) {
                    if (csm.roles.cache.has(csr.id)) {
                      await csm.roles.remove(csr.id)
                    }
                  }
                }
              })
            }
          }
        }
      }
    }
  }
})


{
  var moment = require("moment");

  client.guildInvites = new Map();
  client.guildVaintyInvites = new Map();

  client.on("ready", async () => {
    client.guilds.cache.map((guild) => {
      guild.invites
        .fetch()
        .then((guildInvites) => {
          client.guildInvites.set(
            guild.id,
            new Map(guildInvites.map((invite) => [invite.code, invite.uses]))
          );
        })
        .catch((e) => { });
    });

    client.guilds.cache.map((guild) => {
      let vainty = guild.vanityURLCode;
      if (!vainty) return;
      guild
        .fetchVanityData()
        .then((res) => {
          client.guildVaintyInvites.set(guild.id, res.uses);
        })
        .catch((e) => { });
    });
  });

  client.on("inviteDelete", async (invite) => {
    invite.guild.invites
      .fetch()
      .then((guildInvites) => {
        client.guildInvites.set(
          invite.guild.id,
          new Map(guildInvites.map((invite) => [invite.code, invite.uses]))
        );
      })
      .catch((e) => { });
  });

  client.on("inviteCreate", async (invite) => {
    invite.guild.invites
      .fetch()
      .then((guildInvites) => {
        client.guildInvites.set(
          invite.guild.id,
          new Map(guildInvites.map((invite) => [invite.code, invite.uses]))
        );
      })
      .catch((e) => { });
  });

  client.on("guildMemberAdd", async (member) => {
    let joinMessage = db1.get(`inviteJoinMessage_${member.guild.id}`);
    let logChannel = client.channels.cache.get(db1.get("inviteJoinLog__" + member.guild.id))
    if (!logChannel) return;

    if (member.user.bot) {
      try {
        var fetchedLogs = await member.guild.fetchAuditLogs({
          limit: 1,
          type: "BOT_ADD",
        });
      } catch (err) {
        return;
      }

      var botLog = fetchedLogs.entries.first();
      var botAddUser = botLog.executor;

      if (!botAddUser) {
        if (logChannel) {
          try {
            logChannel
              .send(
                `<:kelebek:995988300403839078>  <@!${member.id}> sunucuya katıldı! Bot **Oauth2** kullanarak giriş yaptı.`
              )
              .catch((e) => { });
          } catch (err) { }
        }
      } else {
        if (logChannel) {
          try {
            logChannel
              .send(
                `<:kelebek:995988300403839078>  <@!${member.id}> sunucuya katıldı! Bot **Oauth2** kullanarak giriş yaptı. **${botAddUser.tag}** tarafından eklendi!`
              )
              .catch((e) => { });
          } catch (err) { }
        }
      }
    } else {
      await member.guild.invites.fetch().then(async (invites) => {
        const vaintyCode = client.guildVaintyInvites.get(member.guild.id);
        const invs = await client.guildInvites.get(member.guild.id);
        const invite = await invites.find((i) => invs.get(i.code) < i.uses);
        client.guildInvites.set(
          member.guild.id,
          new Map(invites.map((invite) => [invite.code, invite.uses]))
        );

        if (vaintyCode) {
          let res = await member.guild.fetchVanityData();
          if (vaintyCode < res.uses) {
            if (logChannel) {
              try {
                logChannel
                  .send(
                    `<:kelebek:995988300403839078>  **${member.user.tag}** sunucuya **Özel URL** kullanarak giriş yaptı. Toplam kullanım **${res.uses}** oldu.`
                  )
                  .catch((e) => { });
              } catch (err) { }
              client.guildVaintyInvites.set(member.guild.id, res.uses);

              db1.set(
                `inviterUser_${member.guild.id}_${member.user.id}`,
                member.guild.id
              );

              return;
            }
          }
        }

        if (!invite) {
          if (logChannel) {
            try {
              logChannel
                .send(
                  `<:giris:995786135001382964> **${member.user.tag}** Sunucuya katıldı! Davet eden **bulunamadı**!`
                )
                .catch((e) => { });
            } catch (err) { }
          }
        } else {
          if (!invite.inviter) return;
          if (Date.now() - member.user.createdTimestamp <= 1000 * 60 * 60 * 24 * 7) {
            db1.add(`regularNumber_${invite.inviter.id}_${member.guild.id}`, 1);
            db1.add(`fakeNumber_${invite.inviter.id}_${member.guild.id}`, 1);

            db1.set(`inviteFake_${member.id}_${member.guild.id}`, true);
          } else {
            db1.add(`inviteNumber_${invite.inviter.id}_${member.guild.id}`, 1);
            db1.add(`regularNumber_${invite.inviter.id}_${member.guild.id}`, 1);
          }

          db1.set(
            `inviterUser_${member.guild.id}_${member.user.id}`,
            invite.inviter.id
          );

          let inviteData = db1.get(
            `inviteNumber_${invite.inviter.id}_${member.guild.id}`
          );
          let regularData = db1.get(
            `regularNumber_${invite.inviter.id}_${member.guild.id}`
          );
          let bonusData = db1.get(
            `bonusNumber_${invite.inviter.id}_${member.guild.id}`
          );
          let fakeData = db1.get(
            `fakeNumber_${invite.inviter.id}_${member.guild.id}`
          );
          let leaveData = db1.get(
            `leaveNumber_${invite.inviter.id}_${member.guild.id}`
          );

          if (logChannel) {
            if (!joinMessage) {
              try {
                logChannel
                  .send(
                    `<:giris:995786135001382964>  **${member.user.tag}** sunucuya katıldı! **${invite.inviter.tag
                    }** tarafından davet edildi. Toplam **${inviteData ? inviteData : 0
                    }** daveti oldu!`
                  )
                  .catch((e) => { });
              } catch (err) { }
            } else {
              const expert = joinMessage
                .replace(/-üye_sayısı-/g, `${member.guild.memberCount}`)
                .replace(
                  /-kuruluş-/g,
                  `${moment
                    .utc(
                      member.guild.members.cache.get(member.id).user.createdAt
                    )
                    .format("DD/MM/YYYY")}`
                )
                .replace(/-davet_kod-/g, `${invite.code}`)
                .replace(/-davet_url-/g, `${invite.url}`)
                .replace(/-davetçi_tag-/g, `${invite.inviter.tag}`)
                .replace(/-davetçi-/g, `${invite.inviter}`)
                .replace(/-davetçi_name-/g, `${invite.inviter.username}`)
                .replace(/-ayrılan_davet-/g, `${leaveData ? leaveData : 0}`)
                .replace(/-fake_davet-/g, `${fakeData ? fakeData : 0}`)
                .replace(/-toplam_davet-/g, `${inviteData ? inviteData : 0}`)
                .replace(/-üye_tag-/g, `${member.user.tag}`)
                .replace(/-üye_name-/g, `${member.user.username}`)
                .replace(/-üye-/g, `${member.user}`)
                .replace(/-memberCount-/g, `${member.guild.memberCount}`)
                .replace(
                  /-createdAt-/g,
                  `${moment
                    .utc(
                      member.guild.members.cache.get(member.id).user.createdAt
                    )
                    .format("DD/MM/YYYY")}`
                )
                .replace(/-invite_code-/g, `${invite.code}`)
                .replace(/-invite_url-/g, `${invite.url}`)
                .replace(/-inviter_tag-/g, `${invite.inviter.tag}`)
                .replace(/-inviter-/g, `${invite.inviter}`)
                .replace(/-inviter_name-/g, `${invite.inviter.username}`)
                .replace(/-leave_invite-/g, `${leaveData ? leaveData : 0}`)
                .replace(/-fake_invite-/g, `${fakeData ? fakeData : 0}`)
                .replace(/-total_invite-/g, `${inviteData ? inviteData : 0}`)
                .replace(/-user_tag-/g, `${member.user.tag}`)
                .replace(/-user_name-/g, `${member.user.username}`)
                .replace(/-user-/g, `${member.user}`);

              try {
                logChannel.send(expert).catch((e) => { });
              } catch (err) { }
            }
          }
          //------------\\

          const data = db1.get(`inviteAwards_${member.guild.id}`);
          let user = member.guild.members.cache.get(invite.inviter.id);

          if (user) {
            if (data) {
              data.map((rol) => {
                //------------\\
                if (member.guild.roles.cache.get(rol.roleID)) {
                  if (inviteData || 0 >= rol.invite) {
                    if (!user.roles.cache.has(rol.roleID)) {
                      user.roles.add(rol.roleID).catch((e) => { });
                    }
                  }
                  //------------\\
                  if (inviteData || 0 <= rol.invite) {
                    if (user.roles.cache.has(rol.roleID)) {
                      user.roles.remove(rol.roleID).catch((e) => { });
                    }
                  }
                }
              });
            }
          }
        }
      });
    }
  });

  client.on("guildMemberRemove", async (member) => {
    let leaveMessage = db1.get(`inviteLeaveMessage_${member.guild.id}`);
    let logChannel = client.channels.cache.get(db1.get("inviteLeaveLog__" + member.guild.id))
    if (!logChannel) return;

    if (member.user.bot) {
      if (logChannel) {
        try {
          logChannel
            .send(`<:kelebek:995988300403839078>  **${member.user.tag}** sunucudan ayrıldı! **Oauth2** kullanarak giriş yapmıştı.`)
            .catch((e) => { });
        } catch (err) { }
      }
    } else {
      let data = db1.get(`inviterUser_${member.guild.id}_${member.user.id}`);

      if (!data) {
        if (logChannel) {
          try {
            logChannel
              .send(
                `<:cikis:995786141204754572>  **${member.user.tag}** sunucudan ayrıldı! Davet eden **bulunamadı!**`
              )
              .catch((e) => { });
          } catch (err) { }
        }

        return;
      }

      if (data) {
        if (data === member.guild.id) {
          if (logChannel) {
            try {
              logChannel
                .send(
                  `<:cikis:995786141204754572>  **${member.user.tag}** sunucudan ayrıldı! **Özel URL** ile girmişti.`
                )
                .catch((e) => { });
            } catch (err) { }
          }

          db1.delete(`inviterUser_${member.guild.id}_${member.user.id}`);

          return;
        }
      }

      var user = member.guild.members.cache.get(data);

      var inviter = {
        user: user ? user : data,
        user_id: user ? user.id : data,
        user_tag: user ? user.user.tag : data,
        user_username: user ? user.user.username : data,
      };

      let fake = db1.get(`inviteFake_${member.id}_${member.guild.id}`);
      if (data) {
        if (fake !== false) {
          db1.add(`fakeNumber_${data}_${member.guild.id}`, -1);

          db1.delete(`inviteFake_${member.id}_${member.guild.id}`);
        } else {
          db1.add(`inviteNumber_${data}_${member.guild.id}`, -1);
        }

        //------------\\
        db1.add(`leaveNumber_${data}_${member.guild.id}`, 1);
        db1.delete(`inviterUser_${member.guild.id}_${member.user.id}`);
      }

      let inviteData = db1.get(`inviteNumber_${data}_${member.guild.id}`);
      let regularData = db1.get(`regularNumber_${data}_${member.guild.id}`);
      let bonusData = db1.get(`bonusNumber_${data}_${member.guild.id}`);
      let fakeData = db1.get(`fakeNumber_${data}_${member.guild.id}`);
      let leaveData = db1.get(`leaveNumber_${data}_${member.guild.id}`);

      if (data) {
        if (logChannel) {
          if (!leaveMessage) {
            logChannel
              .send(
                `<:cikis:995786141204754572>  **${member.user.tag}** sunucudan ayrıldı! **${inviter.user_tag
                }** tarafından davet edilmişti. Toplam **${inviteData ? inviteData : 0
                }** daveti kaldı!`
              )
              .catch((e) => { });
          } else {
            //------------\\
            const embed = leaveMessage
              .replace("-üye_sayısı-", `${member.guild.memberCount}`)
              .replace("-davetçi_tag-", `${inviter.user_tag}`)
              .replace("-davetçi-", `${inviter.user}`)
              .replace("-davetçi_name-", `${inviter.user_username}`)
              .replace("-ayrılan_davet-", `${leaveData ? leaveData : 0}`)
              .replace("-fake_davet-", `${fakeData ? fakeData : 0}`)
              .replace("-toplam_davet-", `${inviteData ? inviteData : 0}`)
              .replace("-üye_tag-", `${member.user.tag}`)
              .replace("-üye_name-", `${member.user.username}`)
              .replace("-üye-", `${member.user}`)

              .replace("-memberCount-", `${member.guild.memberCount}`)
              .replace("-inviter_tag-", `${inviter.user_tag}`)
              .replace("-inviter-", `${inviter.user}`)
              .replace("-inviter_name-", `${inviter.user_username}`)
              .replace("-leave_invite-", `${leaveData ? leaveData : 0}`)
              .replace("-fake_davet-", `${fakeData ? fakeData : 0}`)
              .replace("-total_invite-", `${inviteData ? inviteData : 0}`)
              .replace("-user_tag-", `${member.user.tag}`)
              .replace("-user_name-", `${member.user.username}`)
              .replace("-user-", `${member.user}`);

            logChannel.send({ content: embed }).catch((e) => { });
            //------------\\
          }
          //------------\\
        }

        if (user) {
          try {
            const awards = db1.get(`inviteAwards_${member.guild.id}`);
            awards &&
              awards.map((x) => {
                if (member.guild.roles.cache.get(x.roleID)) {
                  if (inviteData || 0 >= x.invite) {
                    if (!user.roles.cache.get(x.roleID)) {
                      user.roles.add(x.roleID).catch((e) => { });
                    }
                  }

                  if (inviteData || 0 <= x.invite) {
                    if (user.roles.cache.get(x.roleID)) {
                      user.roles.remove(x.roleID).catch((e) => { });
                    }
                  }
                }
              });
          } catch (err) {
            return undefined;
          }
        }
      }
    }
  });
}



/// KANAL LOG

client.on("channelCreate", async channel => {
  const data = await db3.get(`kanallog_${channel.guild.id}`)
  if (data) {
    var logChannel = channel.guild.channels.cache.get(data)
    if (!logChannel) return;

    var fetchedLogs = await channel.guild.fetchAuditLogs({
      limit: 1,
      type: "CHANNEL_CREATE",
    });

    var channelLog = fetchedLogs.entries.first();

    var embed = new MessageEmbed()
      .setDescription(`Oluşturulan Kanal: ${channel}`)
      .setColor(channel.guild.me.displayHexColor)
      .addField(`Kanalı Oluşturan Üye`, `${channelLog.executor} \`(${channelLog.executor.id})\``)
      .addField(`Oluşturulduğu Zaman`, "<t:" + Math.floor(Date.now() / 1000) + ":F>")
      .addField(
        `ID`,
        `\`\`\`\nKullanıcı = ${channelLog.executor.id}\nKanal = ${channel.id}\n\`\`\``)
      .setTimestamp();
    logChannel.send({ embeds: [embed] }).catch(e => { })
  }
})

client.on("channelDelete", async channel => {
  const data = await db3.get(`kanallog_${channel.guild.id}`)
  if (data) {
    var logChannel = channel.guild.channels.cache.get(data)
    if (!logChannel) return;

    var fetchedLogs = await channel.guild.fetchAuditLogs({
      limit: 1,
      type: "CHANNEL_DELETE",
    });

    var channelLog = fetchedLogs.entries.first();

    var embed = new MessageEmbed()
      .setDescription(`Silinen Kanal: \`${channelLog.target.name}\``)
      .setColor(channel.guild.me.displayHexColor)
      .addField(
        `Kanalı Silen Üye`,
        `${channelLog.executor} \`(${channelLog.executor.id})\``
      )
      .addField(`Silindiği Zaman`, "<t:" + Math.floor(Date.now() / 1000) + ":F>")
      .addField(
        `ID`,
        `\`\`\`\nKullanıcı = ${channelLog.executor.id} \nKanal = ${channel.id}\n\`\`\``
      )
      .setTimestamp();
    logChannel.send({ embeds: [embed] }).catch(e => { })
  }
})


client.on("channelUpdate", async (oldChannel, newChannel) => {
  const data = await db3.get(`kanallog_${oldChannel.guild.id}`)
  if (data) {
    var logChannel = oldChannel.guild.channels.cache.get(data)
    if (!logChannel) return;

    var fetchedLogs = await oldChannel.guild.fetchAuditLogs({
      limit: 1,
      type: "CHANNEL_UPDATE",
    });

    var channelLog = fetchedLogs.entries.first();

    if (oldChannel.name !== newChannel.name) {
      var embed = new MessageEmbed()
        .setDescription(`Kanal İsmi Güncellendi ${oldChannel}`)
        .setColor(newChannel.guild.me.displayHexColor)
        .addField(
          `Kanalı Düzenleyen Üye`,
          `${channelLog.executor} \`(${channelLog.executor.id})\``
        )
        .addField(
          `Kanal İsmi`,
          `Eski: ${oldChannel.name} Yeni: ${newChannel.name}`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${channelLog.executor.id}\nKanal = ${oldChannel.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldChannel.topic !== newChannel.topic) {
      var embed = new MessageEmbed()
        .setDescription(`Kanal Başlığı Güncellendi ${oldChannel}`)
        .setColor(newChannel.guild.me.displayHexColor)
        .addField(
          `Kanalı Düzenleyen Üye`,
          `${channelLog.executor} \`(${channelLog.executor.id})\``
        )
        .addField(
          `Kanal Başlığı`,
          `Eski: ${(oldChannel.topic === null && `Başlık Bulunmuyor`) ||
          `${oldChannel.topic}`
          } Yeni: ${(newChannel.topic === null && `Başlık Bulunmuyor`) ||
          `${newChannel.topic}`
          }`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${channelLog.executor.id}\nKanal = ${oldChannel.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldChannel.nsfw !== newChannel.nsfw) {
      var embed = new MessageEmbed()
        .setDescription(`Kanal NSFW Güncellendi ${oldChannel}`)
        .setColor(newChannel.guild.me.displayHexColor)
        .addField(
          `Kanalı Düzenleyen Üye`,
          `${channelLog.executor} \`(${channelLog.executor.id})\``
        )
        .addField(
          `Kanal NSFW`,
          `Eski: ${(oldChannel.nsfw === false && `Kapalı`) || `Açık`} Yeni: ${(newChannel.nsfw === false && `Kapalı`) || `Açık`
          }`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${channelLog.executor.id}\nKanal = ${oldChannel.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldChannel.bitrate !== newChannel.bitrate) {
      var embed = new MessageEmbed()
        .setDescription(`Kanal Bitrate Güncellendi ${oldChannel}`)
        .setColor(newChannel.guild.me.displayHexColor)
        .addField(
          `Kanalı Düzenleyen Üye`,
          `${channelLog.executor} \`(${channelLog.executor.id})\``
        )
        .addField(
          `Kanal Bitrate`,
          `Eski: ${oldChannel.bitrate.toLocaleString()} Yeni: ${newChannel.bitrate.toLocaleString()}`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${channelLog.executor.id}\nKanal = ${oldChannel.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldChannel.userLimit !== newChannel.userLimit) {
      var embed = new MessageEmbed()
        .setDescription(`Kanal Kullanıcı Limit Güncellendi ${oldChannel}`)
        .setColor(newChannel.guild.me.displayHexColor)
        .addField(
          `Kanalı Düzenleyen Üye`,
          `${channelLog.executor} \`(${channelLog.executor.id})\``
        )
        .addField(
          `Kanal Kullanıcı Limit`,
          `Eski: ${oldChannel.userLimit} Yeni: ${newChannel.userLimit}`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${channelLog.executor.id}\nKanal = ${oldChannel.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldChannel.parent !== newChannel.parent) {
      var embed = new MessageEmbed()
        .setDescription(`Kanal Kategori Güncellendi ${oldChannel}`)
        .setColor(newChannel.guild.me.displayHexColor)
        .addField(
          `Kanalı Düzenleyen Üye`,
          `${channelLog.executor} \`(${channelLog.executor.id})\``
        )
        .addField(
          `Kanal Kategori`,
          `Eski: ${oldChannel.parent} Yeni: ${newChannel.parent}`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${channelLog.executor.id}\nKanal = ${oldChannel.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
      var embed = new MessageEmbed()
        .setDescription(`Kanal Zaman Aşımı Güncellendi ${oldChannel}`)
        .setColor(newChannel.guild.me.displayHexColor)
        .addField(
          `Kanalı Düzenleyen Üye`,
          `${channelLog.executor} \`(${channelLog.executor.id})\``
        )
        .addField(
          `Kanal Yavaş Mod`,
          `Eski: ${oldChannel.rateLimitPerUser} Yeni: ${newChannel.rateLimitPerUser}`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${channelLog.executor.id}\nKanal = ${oldChannel.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldChannel.rtcRegion !== newChannel.rtcRegion) {
      var embed = new MessageEmbed()
        .setDescription(`Kanal RTC Bölge Güncellendi ${oldChannel}`)
        .setColor(newChannel.guild.me.displayHexColor)
        .addField(
          `Kanalı Düzenleyen Üye`,
          `${channelLog.executor} \`(${channelLog.executor.id})\``
        )
        .addField(
          `Kanal Bölge`,
          `Eski: ${oldChannel.rtcRegion === null && `Bulunamıyor`} Yeni: ${newChannel.rtcRegion
          }`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${channelLog.executor.id}\nKanal = ${oldChannel.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }


  }
})



// ROL LOG

client.on("roleCreate", async (role) => {
  const data = await db3.get(`rollog_${role.guild.id}`)
  if (data) {
    var logChannel = role.guild.channels.cache.get(data)
    if (!logChannel) return;

    var fetchedLogs = await role.guild.fetchAuditLogs({
      limit: 1,
      type: "ROLE_CREATE",
    });

    var roleLog = fetchedLogs.entries.first();

    var embed = new MessageEmbed()
      .setDescription(`Oluşturulan Rol: ${role}`)
      .setColor(role.guild.me.displayHexColor)
      .addField(
        `Rolü Oluşturan Üye`,
        `${roleLog.executor} \`(${roleLog.executor.id})\``
      )
      .addField(
        `Oluşturulduğu Zaman`,
        "<t:" + Math.floor(role.createdTimestamp / 1000) + ":F>"
      )
      .addField(
        `ID`,
        `\`\`\`\nKullanıcı = ${roleLog.executor.id}\nRol = ${role.id}\n\`\`\``
      )
      .setTimestamp();
    logChannel.send({ embeds: [embed] }).catch(e => { })

  }
})





client.on("roleDelete", async (role) => {
  const data = await db3.get(`rollog_${role.guild.id}`)
  if (data) {
    var logChannel = role.guild.channels.cache.get(data)
    if (!logChannel) return;

    var fetchedLogs = await role.guild.fetchAuditLogs({
      limit: 1,
      type: "ROLE_DELETE",
    });

    var roleLog = fetchedLogs.entries.first();

    var embed = new MessageEmbed()
      .setDescription(`Silinen Rol: \`${role.name}\``)
      .setColor(role.guild.me.displayHexColor)
      .addField(
        `Rolü Silen Üye`,
        `${roleLog.executor} \`(${roleLog.executor.id})\``
      )
      .addField(
        `Oluşturulduğu Zaman`,
        "<t:" + Math.floor(role.createdTimestamp / 1000) + ":F>"
      )
      .addField(`Silindiği Zaman`, "<t:" + Math.floor(Date.now() / 1000) + ":F>")
      .addField(
        `ID`,
        `\`\`\`\nKullanıcı = ${roleLog.executor.id}\nRol = ${role.id}\n\`\`\``
      )
      .setTimestamp();
    logChannel.send({ embeds: [embed] }).catch(e => { })

  }
})





client.on("roleUpdate", async (oldRole, newRole) => {
  const data = await db3.get(`rollog_${oldRole.guild.id}`)
  if (data) {
    var logChannel = oldRole.guild.channels.cache.get(data)
    if (!logChannel) return;

    var fetchedLogs = await newRole.guild.fetchAuditLogs({
      limit: 1,
      type: "ROLE_UPDATE",
    });

    var roleLog = fetchedLogs.entries.first();

    var perms = {
      CREATE_INSTANT_INVITE: "CREATE_INSTANT_INVITE",
      KICK_MEMBERS: "KICK_MEMBERS",
      BAN_MEMBERS: "BAN_MEMBERS",
      ADMINISTRATOR: "ADMINISTRATOR",
      MANAGE_CHANNELS: "MANAGE_CHANNELS",
      MANAGE_GUILD: "MANAGE_GUILD",
      ADD_REACTIONS: "ADD_REACTIONS",
      VIEW_AUDIT_LOG: "VIEW_AUDIT_LOG",
      PRIORITY_SPEAKER: "PRIORITY_SPEAKER",
      STREAM: "STREAM",
      VIEW_CHANNEL: "VIEW_CHANNEL",
      SEND_MESSAGES: "SEND_MESSAGES",
      SEND_TTS_MESSAGES: "SEND_TTS_MESSAGES",
      MANAGE_MESSAGES: "MANAGE_MESSAGES",
      EMBED_LINKS: "EMBED_LINKS",
      ATTACH_FILES: "ATTACH_FILES",
      READ_MESSAGE_HISTORY: "READ_MESSAGE_HISTORY",
      MENTION_EVERYONE: "MENTION_EVERYONE",
      USE_EXTERNAL_EMOJIS: "USE_EXTERNAL_EMOJIS",
      VIEW_GUILD_INSIGHTS: "VIEW_GUILD_INSIGHTS",
      CONNECT: "CONNECT",
      SPEAK: "SPEAK",
      MUTE_MEMBERS: "MUTE_MEMBERS",
      DEAFEN_MEMBERS: "DEAFEN_MEMBERS",
      MOVE_MEMBERS: "MOVE_MEMBERS",
      USE_VAD: "USE_VAD",
      CHANGE_NICKNAME: "CHANGE_NICKNAME",
      MANAGE_NICKNAMES: "MANAGE_NICKNAMES",
      MANAGE_ROLES: "MANAGE_ROLES",
      MANAGE_WEBHOOKS: "MANAGE_WEBHOOKS",
      MANAGE_EMOJIS_AND_STICKERS: "MANAGE_EMOJIS_AND_STICKERS",
      USE_APPLICATION_COMMANDS: "USE_APPLICATION_COMMANDS",
      REQUEST_TO_SPEAK: "REQUEST_TO_SPEAK",
      MANAGE_THREADS: "MANAGE_THREADS",
      USE_PUBLIC_THREADS: "USE_PUBLIC_THREADS",
      CREATE_PUBLIC_THREADS: "CREATE_PUBLIC_THREADS",
      USE_PRIVATE_THREADS: "USE_PRIVATE_THREADS",
      CREATE_PRIVATE_THREADS: "CREATE_PRIVATE_THREADS",
      USE_EXTERNAL_STICKERS: "USE_EXTERNAL_STICKERS",
      SEND_MESSAGES_IN_THREADS: "SEND_MESSAGES_IN_THREADS",
      START_EMBEDDED_ACTIVITIES: "START_EMBEDDED_ACTIVITIES",
    };

    if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
      const oldPermissions = newRole.permissions
        .toArray()
        .filter((x) => !oldRole.permissions.toArray().includes(x));

      const newPermissions = oldRole.permissions
        .toArray()
        .filter((x) => !newRole.permissions.toArray().includes(x));

      var embed = new MessageEmbed()
        .setDescription(`Rol İzini Güncellendi \`${newRole.name}\``)
        .setColor(newRole.guild.me.displayHexColor)
        .addField(
          `Rolü Düzenleyen Üye`,
          `${roleLog.executor} \`(${roleLog.executor.id})\``
        )
        .addField(
          `Eklenen İzinler`,
          `\`\`\`diff\n${oldPermissions.map((perm) => `+ ${perms[perm]}`).join("\n") ||
          `Hiç bir izin eklenmemiş!`
          }\n\`\`\``
        )
        .addField(
          `Çıkartılan İzinler`,
          `\`\`\`diff\n${newPermissions.map((perm) => `- ${perms[perm]}`).join("\n") ||
          `Hiç bir izin çıkartılmamış!`
          }\n\`\`\``
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${roleLog.executor.id}\nRol = ${oldRole.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldRole.name !== newRole.name) {
      var embed = new MessageEmbed()
        .setDescription(`Rol İsmi Güncellendi \`${oldRole.name}\``)
        .setColor(newRole.guild.me.displayHexColor)
        .addField(
          `Rolü Düzenleyen Üye`,
          `${roleLog.executor} \`(${roleLog.executor.id})\``
        )
        .addField(`Rol İsmi`, `Eski: ${oldRole.name} Yeni: ${newRole.name}`)
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${roleLog.executor.id}\nRol = ${oldRole.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldRole.hexColor !== newRole.hexColor) {
      var embed = new MessageEmbed()
        .setDescription(`Rol Rengi Güncellendi \`${oldRole.name}\``)
        .setColor(newRole.guild.me.displayHexColor)
        .addField(
          `Rolü Düzenleyen Üye`,
          `${roleLog.executor} \`(${roleLog.executor.id})\``
        )
        .addField(
          `Rol Rengi`,
          `Eski: ${oldRole.hexColor} Yeni: ${newRole.hexColor}`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${roleLog.executor.id}\nRol = ${oldRole.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldRole.hoist !== newRole.hoist) {
      var embed = new MessageEmbed()
        .setDescription(`Rol Güncellendi \`${oldRole.name}\``)
        .setColor(newRole.guild.me.displayHexColor)
        .addField(
          `Rolü Düzenleyen Üye`,
          `${roleLog.executor} \`(${roleLog.executor.id})\``
        )
        .addField(
          `Rolü Üyelerden Ayrı Göster`,
          `Eski: ${(oldRole.hoist === false && `Kapalı`) || `Açık`} Yeni: ${(newRole.hoist === false && `Kapalı`) || `Açık`
          }`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${roleLog.executor.id}\nRol = ${oldRole.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

    if (oldRole.mentionable !== newRole.mentionable) {
      var embed = new MessageEmbed()
        .setDescription(`Rol Bahsedilebilirliği Güncellendi \`${oldRole.name}\``)
        .setColor(newRole.guild.me.displayHexColor)
        .addField(
          `Rolü Düzenleyen Üye`,
          `${roleLog.executor} \`(${roleLog.executor.id})\``
        )
        .addField(
          `Rol Bahsedilebilirliği`,
          `Eski: ${(oldRole.mentionable === false && `Kapalı`) || `Açık`} Yeni: ${(newRole.mentionable === false && `Kapalı`) || `Açık`
          }`
        )
        .addField(
          `Düzenlendiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${roleLog.executor.id}\nRol = ${oldRole.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    }

  }
})

// VOİCE LOG

client.on("voiceChannelJoin", async (member, channel) => {
  const data = await db3.get(`seslog_${member.guild.id}`)
  if (data) {
    var logChannel = member.guild.channels.cache.get(data)
    if (!logChannel) return;

    var embed = new MessageEmbed()
      .setDescription(`\`${member.user.tag}\` bir kanala katıldı`)
      .setColor(channel.guild.me.displayHexColor)
      .addField(`Kanal`, `${channel} \`(${channel.id})\``)
      .addField(`Katıldığı Zaman`, "<t:" + Math.floor(Date.now() / 1000) + ":F>")
      .addField(
        `ID`,
        `\`\`\`\nKullanıcı = ${member.user.id}\nKanal = ${channel.id}\n\`\`\``
      )
      .setTimestamp();
    logChannel.send({ embeds: [embed] });

  }
})



client.on("voiceChannelLeave", async (member, channel) => {
  const data = await db3.get(`seslog_${member.guild.id}`)
  if (data) {
    var logChannel = member.guild.channels.cache.get(data)
    if (!logChannel) return;

    var embed = new MessageEmbed()
      .setDescription(`\`${member.user.tag}\` bir kanaldan ayrıldı`)
      .setColor(channel.guild.me.displayHexColor)
      .addField(`Kanal`, `${channel} \`(${channel.id})\``)
      .addField(`Ayrıldığı Zaman`, "<t:" + Math.floor(Date.now() / 1000) + ":F>")
      .addField(
        `ID`,
        `\`\`\`\nKullanıcı = ${member.user.id}\nKanal = ${channel.id}\n\`\`\``
      )
      .setTimestamp();
    logChannel.send({ embeds: [embed] });
  }
})


// MESAJ LOG

client.on("messageDelete", async (message) => {
  const data = await db3.get(`msjlog_${message.guild.id}`)
  if (data) {
    var logChannel = message.guild.channels.cache.get(data)
    if (!logChannel) return;

    var embed = new MessageEmbed()
      .setDescription(`Mesaj şurada silindi: ${message.channel}`)
      .setColor(message.guild.me.displayHexColor)
      .addField(`Mesaj İçeriği`, `${message.content}`)
      .addField(
        `Atıldığı Zaman`,
        "<t:" + Math.floor(message.createdTimestamp / 1000) + ":F>"
      )
      .addField(`Silindiği Zaman`, "<t:" + Math.floor(Date.now() / 1000) + ":F>")
      .addField(
        `ID`,
        `\`\`\`\nKullanıcı = ${message.author.id}\nMesaj = ${message.id}\n\`\`\``
      )
      .setTimestamp();
    logChannel.send({ embeds: [embed] }).catch(e => { })

  }
})





client.on("messageDeleteBulk", async (messages) => {
  const data = await db3.get(`msjlog_${messages.first().guild.id}`)
  if (data) {
    var logChannel = messages.first().guild.channels.cache.get(data)
    if (!logChannel) return;
    const moment = require("moment");
    const hastebin = require("hastebin-gen");

    hastebin(
      messages
        .filter((x) => !x.author.bot)
        .map(
          (x) =>
            `Mesaj Sahibi: ${x.author.tag} (${x.author.id}) \nMesaj İçeriği: ${x.content
            } \nAtıldığı Zaman: ${moment(x.createdTimestamp).format("LLL")} \n`
        )
        .join("\n"),
      { extension: "txt" }
    ).then((haste) => {
      var embed = new MessageEmbed()
        .setDescription(
          `Toplam \`${messages.map((x) => x.content).length
          }\` mesaj silindi. \nMesajlar şurada silindi: ${messages.first().channel
          }`
        )
        .setColor(messages.first().guild.me.displayHexColor)
        .addField(`Mesaj İçeriği`, `${haste}`)
        .addField(
          `Silindiği Zaman`,
          "<t:" + Math.floor(Date.now() / 1000) + ":F>"
        )
        .addField(
          `ID`,
          `\`\`\`\nKullanıcı = ${messages.first().author.id}\n\`\`\``
        )
        .setTimestamp();
      logChannel.send({ embeds: [embed] }).catch(e => { })
    })

  }
})




client.on("messageUpdate", async (oldMessage, newMessage) => {
  const data = await db3.get(`msjlog_${oldMessage.guild.id}`)
  if (data) {
    var logChannel = oldMessage.guild.channels.cache.get(data)
    if (!logChannel) return;

    var embed = new MessageEmbed()
      .setDescription(`Mesaj şurada düzenlendi: ${oldMessage.channel}`)
      .setColor(oldMessage.guild.me.displayHexColor)
      .addField(
        `Mesaj İçeriği`,
        `\`Eski:\` ${oldMessage.content} \`Yeni:\` ${newMessage.content}`
      )
      .addField(
        `Atıldığı Zaman`,
        "<t:" + Math.floor(oldMessage.createdTimestamp / 1000) + ":F>"
      )
      .addField(
        `Düzenlendiği Zaman`,
        "<t:" + Math.floor(newMessage.createdTimestamp / 1000) + ":F>"
      )
      .addField(
        `ID`,
        `\`\`\`\nKullanıcı = ${oldMessage.author.id}\nMesaj = ${oldMessage.id}\n\`\`\``
      )
      .setTimestamp();
    logChannel.send({ embeds: [embed] }).catch(e => { })

  }
})