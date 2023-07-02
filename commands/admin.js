const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require('graceful-fs')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("admin")
    .setDescription("Admin Command List"),
    run: async (client, interaction) => {
      if (!interaction.member.roles.cache.some(role => role.name === process.env.ROLE)) {
        return interaction.reply('You do not have permission to use this command.');
      }
      let serverID = interaction.guild.id;
        fs.readFile('config/default.json', function(err, data) {
            let json = JSON.parse(data)
            console.log(json[0])
            const isFound = json.some(element => {
                if (element.serverID === serverID) {
                    const embed = new EmbedBuilder()
                        .setTitle(`Admin Commands`)
                        .setColor('#810e0e')
                        .setThumbnail(element.data.serverlogo)
                        .addFields({
                            name: '?rconM [server IP] [RCON Port] [RCON PASSWORD] [message]',
                            value: "Sends a system message to the server",
                            inline: false,
                        }, {
                            name: '?rconA [server IP] [RCON Port] [RCON PASSWORD] [minutes in number]',
                            value: "Sends a system message to the server regarding a server restarted in the minutes defined.",
                            inline: false,
                        }, {
                            name: '?info',
                            value: "Server information will be posted on the channel",
                            inline: false,

                        }, {
                            name: '?players',
                            value: "Will receive a list of players currently playing on the server.",
                            inline: false,
                        }, {
                            name: '?register [Server IP] [Server Port] [Server Logo] [Role] [Player Count Channel ID] [Server Status Channel ID]',
                            value: "For server logo please link a png or jpg, for role please type in the role you would like for super users to use admin commands",
                            inline: false,
                        }, )
                        .setTimestamp()
                    interaction.reply({
                        embeds: [embed]
                    })
                }
            })
        })
    }
 };