const ms = require('ms');

module.exports = {

    description: 'Durdurulan çekilişi devam ettirir!',
    name: 'çekiliş-devam-et',
    options: [
        {
            name: 'çekiliş',
            description: 'Durdurulan çekilişi devam ettirir. (message ID or giveaway prize)',
            type: 'STRING',
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

        const query = interaction.options.getString('çekiliş');

        // try to found the giveaway with prize then with ID
        const giveaway = 
            // Search with giveaway prize
            client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            // Search with giveaway ID
            client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        // If no giveaway was found
        if (!giveaway) {
            return interaction.reply({
                content: '<:cross:980410756484956210>  Belirtilen mesaj-id için bir çekiliş zaten yok: `'+ query + '`.',
                ephemeral: true
            });
        }

        if (!giveaway.pauseOptions.isPaused) {
            return interaction.reply({
                content: '<:cross:980410756484956210>  Bu çekiliş zaten devam ediyor.',
                ephemeral: true
            });
        }

        // Edit the giveaway
        client.giveawaysManager.unpause(giveaway.messageId)
        // Success message
        .then(() => {
            // Success message
            interaction.reply('<:correct:980410756187185172>  Çekiliş başarıyla devam ettirildi.');
        })
        .catch((e) => {
            interaction.reply({
                content: e,
                ephemeral: true
            });
        });

    }
};
