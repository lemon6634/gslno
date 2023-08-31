const { MessageEmbed, Collection, MessageActionRow, MessageButton } = require("discord.js");
var config = require("../config.json");
const client = require("..");
const {JsonDatabase} = require("wio.db");
const db = new JsonDatabase({databasePath:"./croxydb/wiodb.json"});

client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  let prefix = db.fetch(`prefix_${message.guild.id}`)
  ? db.fetch(`prefix_${message.guild.id}`)
  : client.ayarlar.prefix;
  if (!message.content.startsWith(prefix)) return;
  let command = message.content.split(" ")[0].slice(prefix.length);
  let params = message.content.split(" ").slice(1);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    const data = db.get("rules."+ message.author.id)
    if(data){
    cmd.run(client, message, params)
    } else {

      const row = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId('yes')
        .setLabel('Onayla')
        .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('no')
            .setLabel('Reddet')
            .setStyle('DANGER'));

            let buton = new MessageButton()
            .setStyle("PRIMARY")
            .setLabel("Moderasyon")
            .setEmoji("🛠️")
            .setCustomId("moderasyonn")
            
            let buton1 = new MessageButton()
            .setStyle("SUCCESS")
            .setLabel("Kullanıcı")
            .setEmoji("💎")
            .setCustomId("kullanıcıı")
            
            let buton2 = new MessageButton()
            .setStyle("SECONDARY")
            .setLabel("Bot")
            .setEmoji("⚙️")
            .setCustomId("bott")
            
            let buton4 = new MessageButton()
            .setStyle("SUCCESS")
            .setLabel("Koruma")
            .setEmoji("⚔️")
            .setCustomId("korumaa")
            
            let buton5 = new MessageButton()
            .setStyle("DANGER")
            .setLabel("Özel")
            .setEmoji("🤩")
            .setCustomId("özell")

 const embed = new MessageEmbed()
          .setTitle(client.user.username + " Botumuzu kullanmak için kuralları kabul etmelisin!")
          .setColor("YELLOW")
          .setDescription(client.ayarlar.rules)
          .setTimestamp()
          await message.channel.send({ embeds: [embed], components: [row] }).then(async msg => {

            const filter = x => x.user.id === message.author.id
            let collector = msg.createMessageComponentCollector({ filter, time: 300000 })
            

            collector.on("collect", async button => {
              if(button.customId === "yes") {
            await db.set(`rules.${message.author.id}`, true)
            
            let embed = new MessageEmbed()
            .setAuthor({ name: `${client.user.username} Yardım Menüsü`, iconURL: client.user.displayAvatarURL() })
            .setDescription(`> Botun komutları hakkında bilgi almak için istediğiniz seçeneğin butonuna tıklayın!`)
            .setColor("GREEN")
            msg.edit({content: "Kurallarımızı kabul ettiğiniz için teşekkürler <:correct:980410756187185172>", embeds: [embed], components: [new MessageActionRow({ components: [buton, buton1, buton2, buton4, buton5, ]})]}).catch(e => {})
            button.deferUpdate()

              }

              if(button.customId === "no") {
                const roww = new MessageActionRow().addComponents(
                  new MessageButton()
                  .setCustomId('YES')
                  .setLabel('Onayla')
                  .setDisabled(true)
                  .setStyle('SUCCESS'),
                  new MessageButton()
                      .setCustomId('no')
                      .setLabel('Reddet')
                      .setDisabled(true)
                      .setStyle('DANGER'))


                const embedd = new MessageEmbed()
                .setTitle(message.author.tag + " Botumuzu kullanmak için kuralları kabul etmelisin!")
                .setColor("RED")
                .setDescription("Kuralları kabul etmediğiniz için botumuzu kullanamazsınız.")
                .setTimestamp()
                await msg.edit({ embeds: [embedd], components: [roww] }).catch(e => {})
                button.deferUpdate();
              }

              if(button.customId === "moderasyonn") {
                let moderasyon = new MessageEmbed()
                .setTitle(`> Botun moderasyon komutları hakkında bilgi alırsınız!`)
                .setDescription(`\n${client.commands.filter(mr => mr.help.category === "moderasyon").map(cmd => `> **\`${prefix}${cmd.help.name}\`: \`${cmd.help.description}\`**`).join("\n")}`)
                .setColor("BLUE")
                msg.edit({content: "🛠️ Moderasyon Komutları", embeds: [moderasyon], components: [new MessageActionRow({ components: [buton1, buton2, buton4, buton5, ]})]}).catch(e => {})
                button.deferUpdate();
              }
                
                if(button.customId === "kullanıcıı") {
                let kullanıcı = new MessageEmbed()
                .setTitle(`> Botun kullanıcı komutları hakkında bilgi alırsınız!`)
                .setDescription(`\n${client.commands.filter(mr => mr.help.category === "kullanıcı").map(cmd => `> **\`${prefix}${cmd.help.name}\`: \`${cmd.help.description}\`**`).join("\n")}`)
                .setColor("BLUE")
                msg.edit({content: "💎 Kullanıcı Komutları", embeds: [kullanıcı], components: [new MessageActionRow({ components: [buton, buton2, buton4, buton5, ]})]}).catch(e => {})
                button.deferUpdate();
              }
                
                if(button.customId === "bott") {
                let bot = new MessageEmbed()
                .setTitle(`> Botun kendi özel komutları hakkında bilgi alırsınız!`)
                .setDescription(`\n${client.commands.filter(mr => mr.help.category === "bot").map(cmd => `> **\`${prefix}${cmd.help.name}\`: \`${cmd.help.description}\`**`).join("\n")}`)
                .setColor("BLUE")
                msg.edit({content: "⚙️ Bot Komutları", embeds: [bot], components: [new MessageActionRow({ components: [buton, buton1, buton4, buton5, ]})]}).catch(e => {})
                button.deferUpdate();
              }
                
                if(button.customId === "korumaa") {
                  let bot = new MessageEmbed()
                  .setTitle(`> Botun sunucu koruma komutları hakkında bilgi alırsınız!`)
                  .setDescription(`\n${client.commands.filter(mr => mr.help.category === "koruma").map(cmd => `> **\`${prefix}${cmd.help.name}\`: \`${cmd.help.description}\`**`).join("\n")}`)
                  .setColor("BLUE")
                  msg.edit({content: "⚔️ Koruma Komutları", embeds: [bot], components: [new MessageActionRow({ components: [buton, buton1, buton2, buton5, ]})]}).catch(e => {})
                  button.deferUpdate();
                }
                
                  if(button.customId === "özell") {
                    let bot = new MessageEmbed()
                    .setTitle(`> Botun İnvite, Çekiliş ve Emoji Rol komutları hakkında bilgi alırsınız!\n`)
                    // .addField("Seviye Komutları <:loading:980410754387816469>",`${client.commands.filter(mr => mr.help.category === "seviye").map(cmd => `> **\`${prefix}${cmd.help.name}\`: \`${cmd.help.description}\`**`).join("\n")}`)
                    .addField("İnvite Komutları <:add:980410755453161523>", `${client.commands.filter(mr => mr.help.category === "invite").map(cmd => `> **\`${prefix}${cmd.help.name}\`: \`${cmd.help.description}\`**`).join("\n")}`)
                    .setDescription(`**Emoji Rol Komutları** <:star:980410756308799548>\n${client.commands.filter(mr => mr.help.category === "emojirol").map(cmd => `> **\`${prefix}${cmd.help.name}\`: \`${cmd.help.description}\`**`).join("\n")}`)
                    .addField("Çekiliş Komutları <:gift:982667082896392232> (Slash Komutları)",`${client.commandss.map(cmd => `> **\`/${cmd.name}\`: \`${cmd.description}\`**`).join("\n")}`).setColor("BLUE")
                    msg.edit({content: "🤩 Emojirol, Çekiliş ve Seviye Komutları", embeds: [bot], components: [new MessageActionRow({ components: [buton, buton1, buton2, buton4, ]})]}).catch(e => {})
                    button.deferUpdate();
                  }

            })

            collector.on("end", async button => {
              if(msg){
              msg.delete().catch(e => {})
              }
                      })
            }).catch(() => {})

   
    }
  }

});
