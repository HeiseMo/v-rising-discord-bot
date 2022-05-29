'use strict';

// Import modules
require('dotenv').config()
const Discord = require('discord.js');
const {
    MessageEmbed
} = require('discord.js');
const Gamedig = require('gamedig');
const Rcon = require('rcon');
const config = require('config');
const fs = require('graceful-fs')




// Create an instance of a Discord client
const client = new Discord.Client({
    intents: ["GUILD_PRESENCES", "GUILD_MEMBERS", "GUILDS", "GUILD_BANS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING", "GUILD_VOICE_STATES", "GUILD_MESSAGE_REACTIONS"]
})

// Setup repeater
const sleep = ms => new Promise(res => setTimeout(res, ms));

client.on('ready', async () => {
    console.log('I am ready!');
});
const prefix = "?";

client.on('guildCreate', guild => {
    let getOwners = async () => {
        let owner = await guild.fetchOwner().catch(err => err)
        return owner
    }
    getOwners().then(owner => {
        if (owner !== undefined) {
            console.log(`ID: ${owner.user.id}\nUsername: ${owner.user.username}`)
            owner.send('First Steps');
            const embed = new Discord.MessageEmbed()
                .setTitle(`First Steps`)
                .setColor('#810e0e')
                .addFields({
                    name: 'Step #1',
                    value: "If you already dont have an Admin role, create a role called Admin.",
                    inline: false,
                }, {
                    name: 'Step #2',
                    value: "Create 2 Voice channels and copy their IDs for the step below.",
                    inline: false,
                }, {
                    name: 'Step #3',
                    value: "You will need to register your server and information with the following command",
                    inline: false,
                }, {
                    name: '?register [Server IP] [Query Port] [Server Logo] [Role] [PlayerCount Channel ID] [ServerStatus Channel ID]',
                    value: "// Example ?register 123.456.789.123 1111 https:/someimage.com/coolimage.png Admin 12345678912 32165498712",
                    inline: false,
                }, )
                .setTimestamp()
            owner.send({
                embeds: [embed]
            })
        }
    })

});

const ping = details =>
    new Promise(resolve =>
        setTimeout(() => resolve(details), 1000)
    );

setInterval(function() {

    fs.readFile('config/default.json', function(err, data) {
        let json = JSON.parse(data)
        console.log(json.length)
        // json.forEach(item => {
        for (let j = 0; j < json.length; j++) {
            let test1 = client.channels.cache.get(json[j].data.playercount.toString());
            let test2 = client.channels.cache.get(json[j].data.serverstatus.toString());
            console.log(json[j].serverID)
            sleep(120000)
            Gamedig.query({
                type: '7d2d',
                host: json[j].data.ip,
                port: json[j].data.port
            }).then((info) => {
                let myMemberCountChannel = test1
                let myStatusChannel = test2
                console.log(info.ping, "ping")
                myStatusChannel
                    .setName(`Game Server Status: ✅`)
                    .then(updated => console.log(`Updated guild name to ${updated.name}`))
                    .catch(console.error);
                myMemberCountChannel
                    .setName(`Online Players: ${info.raw.numplayers}`)
                    .then(updated => console.log(`Updated guild name to ${updated.name}`))
                    .catch(console.error);
                console.log("I just checked " + info.raw.numplayers + " players online")
            }).catch((error) => {
                console.log(error)
                let myMemberCountChannel = test1
                let myStatusChannel = test2
                myStatusChannel
                    .setName(`Game Server Status: ❌`)
                    .then(updated => console.log(`Updated guild name to ${updated.name}`))
                    .catch(console.error);
                myMemberCountChannel
                    .setName(`Online Players: 0`)
                    .then(updated => console.log(`Updated guild name to ${updated.name}`))
                    .catch(console.error);
            });
        }
    })
}, process.env.DISCORDCHANNELNAMEREFRESHRATE);

client.on('messageCreate', async (message) => {
    if (message.content.startsWith(prefix + "rconM") && message.member.roles.cache.some(role => role.name === process.env.ROLE)) {
        message.delete(1000);
        let myArray = message.content.split(" ")
        let rconMessage = message.content.slice(7)
        let rconIP = myArray[1]
        let rconPort = myArray[2]
        let rconPassword = myArray[3]
        let rconCMD = myArray.slice(4)
        let rconString = rconCMD.join(" ")
        //Connecto to RCON
        const conn = new Rcon(rconIP, rconPort, rconPassword);
        let rconRes = "";
        conn.on('auth', function() {
            console.log("Authenticated");
        }).on('response', function(str) {
            console.log("Response: " + str);
            rconRes = str
        }).on('error', function(err) {
            console.log("Error: " + err);
        }).on('end', function() {
            console.log("Connection closed");
        });
        conn.connect();
        await sleep(2000)
        conn.send("announce " + rconString);
        await sleep(2000)
        if (rconRes == "") {
            rconRes = "'" + rconString + "' message has been successfully sent to the server!"
        }
        message.channel.send(rconRes)
        rconRes = ""
        conn.disconnect();
    }
    if (message.content.startsWith(prefix + "rconA") && message.member.roles.cache.some(role => role.name === process.env.ROLE)) {
        message.delete(1000);
        let myArray = message.content.split(" ")
        let rconMessage = message.content.slice(7)
        let rconIP = myArray[1]
        let rconPort = myArray[2]
        let rconPassword = myArray[3]
        let rconCMD = myArray.slice(4)
        let rconString = rconCMD.join(" ")
        //Connecto to RCON
        const conn = new Rcon(rconIP, rconPort, rconPassword);
        let rconRes = "";
        conn.on('auth', function() {
            console.log("Authenticated");
        }).on('response', function(str) {
            console.log("Response: " + str);
            rconRes = str
        }).on('error', function(err) {
            console.log("Error: " + err);
        }).on('end', function() {
            console.log("Connection closed");
        });
        conn.connect();
        await sleep(2000)
        conn.send("announcerestart " + Number(rconString))
        await sleep(2000)
        if (rconRes == "") {
            rconRes = "Server will restart in " + rconString + " minute, announcement was successfully sent to the server!"
        }
        message.channel.send(rconRes)
        rconRes = ""
        conn.disconnect();
    }
    if (message.content.startsWith(prefix + 'players') && message.member.roles.cache.some(role => role.name === process.env.ROLE)) {
        message.delete(1000);
        let serverID = message.guild.id;
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
                        const embed = new Discord.MessageEmbed()
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

                        message.channel.send({
                            embeds: [embed]
                        })
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            })
        })
    }
    if (message.content.startsWith(prefix + 'admin') && message.member.roles.cache.some(role => role.name === process.env.ROLE)) {
        message.delete(1000);
        let serverID = message.guild.id;
        fs.readFile('config/default.json', function(err, data) {
            let json = JSON.parse(data)
            console.log(json[0])
            const isFound = json.some(element => {
                if (element.serverID === serverID) {
                    const embed = new Discord.MessageEmbed()
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
                    message.channel.send({
                        embeds: [embed]
                    })
                }
            })
        })
    }
    if (message.content.startsWith(prefix + 'register') && message.member.roles.cache.some(role => role.name === process.env.ROLE)) { //Need to check before admin is set how can admin run?
        message.delete(1000);
        let myArray = message.content.split(" ")

        let serverID = message.guild.id;
        let myServerIP = myArray[1]
        let myServerPort = myArray[2]
        let serverlogo = myArray[3]
        let myImportantRole = myArray[4]
        let myPlayerCounterChannelId = myArray[5]
        let myServerStatusChannelId = myArray[6]
        let reg = {
            serverID: serverID.toString(),
            data: {
                ip: myServerIP.toString(),
                port: myServerPort.toString(),
                serverlogo: serverlogo.toString(),
                role: myImportantRole.toString(),
                playercount: myPlayerCounterChannelId.toString(),
                serverstatus: myServerStatusChannelId.toString(),
            }
        }
        let newReg = JSON.stringify(reg)
        fs.readFile('config/default.json', function(err, data) {
            var json = JSON.parse(data)
            let checkIfExists = json.findIndex(check => check.serverID == serverID.toString());
            console.log(checkIfExists)
            if (checkIfExists == -1) {
                console.log("I got in here because dont exist yet")
                let parsedReg = JSON.parse(newReg)
                json.push(parsedReg)
                fs.writeFile("config/default.json", JSON.stringify(json))
            } else {
                console.log("I got in here because I exist already")
                let parsedReg = JSON.parse(newReg)
                json.splice(checkIfExists, 1);
                console.log(json)
                json.push(parsedReg)
                fs.writeFile("config/default.json", JSON.stringify(json))

            }

        })

    }
    if (message.content.startsWith(prefix + 'info')) {
        message.delete(1000);
        let serverID = message.guild.id;
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
                        const embed = new Discord.MessageEmbed()
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
                        message.channel.send({
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
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.DISCORDBOTTOKEN);