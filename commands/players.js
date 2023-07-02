const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Gamedig = require('gamedig');
const fs = require('graceful-fs')

module.exports = {
  data: new SlashCommandBuilder()
  .setName('players')
  .setDescription('Fetch players from the server'),
    // komutu geliştirmek istersen guide: https://discordjs.guide/slash-commands/advanced-creation.html
    run: async (client, interaction) => {
        let serverID = interaction.guild.id;
        fs.readFile('config/default.json', function(err, data) {
            let json = JSON.parse(data)
            const isFound = json.some(element => {
                if (element.serverID === serverID) {
                    console.log(element, "I found element")
                    Gamedig.query({
                        type: '7d2d',
                        host: element.data.ip,
                        port: element.data.port
                    }).then((info) => {
                        const embed = new EmbedBuilder()
                            .setTitle(`Player List`)
                            .setColor('#810e0e')
                            .setThumbnail(element.data.serverlogo)
                            .setTimestamp()
                        info.players.forEach(array => {
                            embed.addFields({
                                name: array.name,
                                value: `Level: ${array.raw.score}`,
                                inline: true
                            });
                        });

                        interaction.reply({
                            embeds: [embed]
                        })
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            })
        })
    }
 };