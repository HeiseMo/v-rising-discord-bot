const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Gamedig = require('gamedig');
const fs = require('graceful-fs')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Find out some info!"),
    run: async (client, interaction) => {
        let serverID = interaction.guild.id;
        fs.readFile('config/default.json', function(err, data) {
            let json = JSON.parse(data)
            console.log(json[0])
            const isFound = json.some(element => {
                if (element.serverID === serverID) {
                    Gamedig.query({
                        type: '7d2d',
                        host: element.data.ip,
                        port: element.data.port
                    }).then((info) => {
                        const embed = new EmbedBuilder()
                            .setTitle(`Server Information`)
                            .setColor('#810e0e')
                            .setThumbnail(element.data.serverlogo)
                            .addFields({
                                name: 'Server Name',
                                value: info.name,
                                inline: false,
                            }, {
                                name: 'Server Ip',
                                value: info.connect,
                                inline: false,
                            }, {
                                name: 'Slots Available',
                                value: "" + (info.maxplayers - info.raw.numplayers),
                                inline: true,

                            }, {
                                name: 'Online Players',
                                value: "" + info.raw.numplayers,
                                inline: true,
                            })
                            .setTimestamp()
                        interaction.reply({
                            embeds: [embed]
                        })
                    }).catch((error) => {
                        console.log(error);
                    });
                    return true;
                }
                return false;
            });
            console.log(isFound)
        })
    }
 };