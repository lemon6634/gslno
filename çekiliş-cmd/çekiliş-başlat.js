const ms = require('ms');
const messages = require("../utils/messages");

module.exports = {

    description: 'Çekiliş başlatmanızı sağlar.',
    name: 'çekiliş-başlat',
    options: [
        {
            name: 'zaman',
            description: 'Çekiliş ne kadar sürecek? Örnek değerler: 1m, 1h, 1d',
            type: 'STRING',
            required: true
        },
        {
            name: 'kazananlar',
            description: 'Çekilişin kaç kazananı olmalı?',
            type: 'INTEGER',
            required: true
        },
        {
            name: 'ödül',
            description: 'Çekilişin ödülü ne olmalı?',
            type: 'STRING',
            required: true
        },
        {
            name: 'kanal',
            description: 'Çekiliş hangi kanalda olacak?',
            type: 'CHANNEL',
            required: true
        }
    ],

    run: async (client, interaction) => {

        // If the member doesn't have enough permissions
        if(!interaction.member.permissions.has('MANAGE_GUILD')){
            return interaction.reply({
                content: '<:cross:980410756484956210>  Bu komutu kullanabilmek için `Sunucuyu Yönet` yetkisine sahip olmalısın.',
                ephemeral: true
            });
        }
    
        const giveawayChannel = interaction.options.getChannel('kanal');
        const giveawayDuration = interaction.options.getString('zaman');
        const giveawayWinnerCount = interaction.options.getInteger('kazananlar');
        const giveawayPrize = interaction.options.getString('ödül');
        
        if(!giveawayChannel.isText()) {
            return interaction.reply({
                content: '<:cross:980410756484956210>  Belirtilen kanal yazı kanalı değil!',
                ephemeral: true
            });
        }
    
        // Start the giveaway
        client.giveawaysManager.start(giveawayChannel, {
            // The giveaway duration
            duration: ms(giveawayDuration),
            // The giveaway prize
            prize: giveawayPrize,
            // The giveaway winner count
            winnerCount: giveawayWinnerCount,
            // Who hosts this giveaway
            hostedBy: interaction.user ? interaction.user : null,
            // Messages
            messages
        });
    
        interaction.reply(`<:gift:982667082896392232>  Çekiliş başladı: ${giveawayChannel}!`);
    
    } 

};
