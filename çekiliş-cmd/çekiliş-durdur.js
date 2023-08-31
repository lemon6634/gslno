const ms = require('ms');

module.exports = {

    description: 'Çekilişi geçici olarak durdurur ettirir!',
    name: 'çekiliş-durdur',

    options: [
        {
            name: 'çekiliş',
            description: 'Çekilişi geçici olarak durdurur (mesaj ID veya çekiliş ödülü)',
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

        if (giveaway.pauseOptions.isPaused) {
            return interaction.reply({
                content: '<:correct:980410756187185172>  Bu çekiliş zaten duraklatıldı.',
                ephemeral: true
            });
        }

        // Edit the giveaway
        client.giveawaysManager.pause(giveaway.messageId)
        // Success message
        .then(() => {
            // Success message
            interaction.reply('<:correct:980410756187185172>  Çekiliş başarıyla duraklatıldı.');
        })
        .catch((e) => {
            interaction.reply({
                content: e,
                ephemeral: true
            });
        });

    }
};
