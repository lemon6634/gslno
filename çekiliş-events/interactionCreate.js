const client = require("../index");
module.exports = (client, interaction) => {

    if (!interaction.isCommand()) return;

    const command = client.commandss.get(interaction.commandName);

    if (!command) return void interaction.reply({
        content: `Komut bulunamadı: \`${interaction.commandName}\``,
        ephemeral: true
    });
  
    command.run(client, interaction);
};