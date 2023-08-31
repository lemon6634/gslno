const messages = require("../utils/messages");

module.exports = {

    description: 'Hızlı çekiliş başlatmanızı sağlar.',
    name: 'çekiliş-drop',
    options: [
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
            description: 'Çekilişin başlayacağı kanalı seçmelisin.',
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
            // The number of winners for this drop
            winnerCount: giveawayWinnerCount,
            // The prize of the giveaway
            prize: giveawayPrize,
            // Who hosts this giveaway
            hostedBy:  interaction.user ? interaction.user : null,
            // specify drop
            isDrop: true,
            // Messages
            messages
        });
    
        interaction.reply(`<:correct:980410756187185172>  Çekiliş başladı: ${giveawayChannel}!`);

    }
};
