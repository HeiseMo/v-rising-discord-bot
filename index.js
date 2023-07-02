require('dotenv').config()
const Discord = require('discord.js');
const Gamedig = require('gamedig');
const Rcon = require('rcon');
const config = require('config');
const fs = require('graceful-fs');
const { readdirSync } = require("fs")
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
// Create an instance of a Discord client
const { Client, Collection, Events, GatewayIntentBits, Partials, EmbedBuilder, ApplicationCommand, ActivityType } = require("discord.js");
let token = process.env.DISCORDBOTTOKEN

// Setup repeater
const sleep = ms => new Promise(res => setTimeout(res, ms));

const client = new Client({
  intents: [
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions
  ]
});

client.commands = new Collection()

const rest = new REST({ version: '10' }).setToken(token);

const log = x => { console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${x}`) };

//command-handler
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}

client.on(Events.ClientReady, async () => {
        try {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
        } catch (error) {
            console.error(error);
        }
    log(`Logged in as ${client.user.username}!`);
})

//event-handler
readdirSync('./events').forEach(async file => {
	const event = await require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
})
client.on('guildCreate', guild => {
    let getOwners = async () => {
        let owner = await guild.fetchOwner().catch(err => err)
        return owner
    }
    getOwners().then(owner => {
        if (owner !== undefined) {
            console.log(`ID: ${owner.user.id}\nUsername: ${owner.user.username}`)
            owner.send('First Steps');
            const embed = new EmbedBuilder() // <-- Changed here
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
                    value: "// Example ?register 123.456.789.123 1111 https://someimage.com/coolimage.png Admin 12345678912 32165498712",
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
            sleep(60000)
            Gamedig.query({
                type: '7d2d',
                host: json[j].data.ip,
                port: json[j].data.port
            }).then((info) => {
                console.log(info)
                let myMemberCountChannel = test1
                let myStatusChannel = test2
                console.log(info.ping, "ping")
                client.user.setActivity({ name: `with ${info.raw.numplayers}/${info.maxplayers} players.`, type: ActivityType.Game })
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


// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.DISCORDBOTTOKEN);