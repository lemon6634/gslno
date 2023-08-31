const client = require("../index");
client.on("ready", async () => {
  console.log(`${client.user.tag} İsmi İle Bot Aktif!`)
  let mesajlar = [
    `👀 Özel komutlar ile sunucunu özelleştir! | ${client.ayarlar.prefix}yardım`,
    `✨ Biliyor muydun? Dunge ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)} kullanıcı`,
    `🚀 ?yardım ・ ?davet`
  ];
  setInterval(() => {
    const mesaj = mesajlar[Math.floor(Math.random() * mesajlar.length)];

    client.user.setPresence({
      activities: [{
        name: mesaj,
        type: "WATCHING"
      }],
      status: 'dnd'
    });
  }, 16000); 

  const mesaj = mesajlar[Math.floor(Math.random() * mesajlar.length)];

  client.user.setPresence({
    activities: [{
      name: mesaj,
      type: "WATCHING"
    }],
    status: 'online'
  });

});
