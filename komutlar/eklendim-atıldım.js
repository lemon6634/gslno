const Discord = require('discord.js')
const db = require("orio.db")

exports.run = async (client, message, args) => {
const prefix = client.db.get(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
if (message.author.id !== client.ayarlar.owner) return message.reply(`Bu komutu kullanabilmek için **Bot Yönetici** iznine sahip olmalısın!`).catch(e => {})

  if(args[0] === "ayarla"){
    const data = db.get(`sea_${client.user.id}`)
    if(data){
    return message.channel.send(`:x: | Sunucuya Eklenince ve Atılınca Bildirme Sistemi Zaten Ayarlı!`).catch(e => {})
    }
    
  let channel = message.mentions.channels.first()
    if (!channel) {
        message.channel.send(':x: | Kullanım: `'+prefix+'eklendim-atıldım ayarla #kanal`').catch(e => {})
    }
    
await db.set('sea_'+client.user.id, channel.id) 
message.channel.send(`:white_check_mark: | ** Sunucuya Eklenince ve Atılınca Bildirme Kanalı ${channel} Olarak Ayarlandı!**`).catch(e => {})
 
} else {
  
if(args[0] === "sıfırla"){
const data = db.get(`sea_${client.user.id}`)
if(!data){
return message.channel.send(`:x: | Sunucuya Eklenince ve Atılınca Bildirme Sistemi Zaten Ayarlı Değil!`).catch(e => {})
}

message.channel.send('Sunucuya Eklenince ve Atılınca Bildirme Sistemi Sıfırlandı!').catch(e => {})
await db.delete('sea_'+client.user.id)
  
} else {
   return message.reply("`"+prefix+"eklendim-atıldım ayarla #kanal` veya `"+prefix+"eklendim-atıldım sıfırla` Yazmalısın!").catch(e => {})
}}}    

exports.conf = {
    aliases: ["eklendimatıldım"]
}

exports.help = {
    name: 'eklendim-atıldım',
    description: 'Sunucuya Eklendim ve Atıldım Bildirme Sistemini Ayarlar.',
    usage: 'eklendim-atıldım ayarla #kanal',
    category: 'bot'

}
    