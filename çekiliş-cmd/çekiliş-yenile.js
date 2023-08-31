module.exports = {

    description: 'Çekiliş için yeni bir kazanan seçer.',
    name: 'çekiliş-yenile',
    options: [
        {
            name: 'çekiliş',
            description: 'Çekilişi için yeniden bir kazanan seçer. (mesaj ID veya çekiliş ödülü)',
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
                content: '<:cross:980410756484956210>  Belirtilen mesaj-id için bir çekiliş zaten yok: `'+ query +'`.',
                ephemeral: true
            });
        }

        if (!giveaway.ended) {
            return interaction.reply({
                content: '<:cross:980410756484956210>  Bu çekiliş henüz bitmedi.',
                ephemeral: true
            });
        }


         interaction.reply({ content: '<:gift:982667082896392232>', ephemeral: true });
        // Reroll the giveaway
        client.giveawaysManager.reroll(giveaway.messageId, {
            messages: {
                congrat: '<:gift:982667082896392232>  Yeni Kazanan(lar): {winners}! Tebrikler, **{this.prize}** kazandınız!\n{this.messageURL}',
                error: 'Katılım çok az bu yüzden yeniden kazanan seçemem.'
            }
        }).catch(e => {})

    }
};
