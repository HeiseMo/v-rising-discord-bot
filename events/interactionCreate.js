const { Events, InteractionType } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    execute: async(interaction) => {
        let client = interaction.client;
        if (interaction.type == InteractionType.ApplicationCommand) {
            if(interaction.user.bot) return;
            try {
                const command = client.commands.get(interaction.commandName)

                if (!command) {
                    console.log(`Command ${interaction.commandName} not found.`);
                    return;
                }

                command.run(client, interaction)
            } catch (e) {
                console.error(e)
                interaction.reply({content: "There was an error trying to execute that command! Please try again.", ephemeral: true});
            }
        }
    }
}
