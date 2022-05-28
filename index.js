'use strict';

// Import modules
require('dotenv').config()
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const Gamedig = require('gamedig');
const Rcon = require('rcon');


//Connecto to RCON
const conn = new Rcon(process.env.IP, process.env.PORT, process.env.RCONPASS);
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
  //process.exit();
});

// Create an instance of a Discord client
const client = new Discord.Client({ intents: ["GUILD_PRESENCES", "GUILD_MEMBERS", "GUILDS", "GUILD_BANS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING", "GUILD_VOICE_STATES", "GUILD_MESSAGE_REACTIONS"] })

// Setup repeater
const sleep = ms => new Promise(res => setTimeout(res, ms));


client.on('ready', async () => {
  console.log('I am ready!');
});
const prefix = "?";

setInterval(function() {
  Gamedig.query({
    type: '7d2d',
    host: process.env.IP,
    port: process.env.PORT
  }).then((info) => {
    console.log(info)
    let myMemberCountChannel = client.channels.cache.get(process.env.ONLINEPLAYERCOUNTCHANNEL);
    let myStatusChannel = client.channels.cache.get(process.env.SERVERSTATUSCHANNEL);
    if(info.ping > 0){
      myStatusChannel
      .setName(`Game Server Status: ✅`)
      .catch(console.error);
    }
    myMemberCountChannel
    .setName(`Online Players: ${info.raw.numplayers}`)
    .catch(console.error);
    console.log("I just checked " + info.raw.numplayers + " players online")
  }).catch((error) => {
      let myMemberCountChannel = client.channels.cache.get(process.env.ONLINEPLAYERCOUNTCHANNEL);
      let myStatusChannel = client.channels.cache.get(process.env.SERVERSTATUSCHANNEL);
      myStatusChannel
      .setName(`Game Server Status: ❌`)
      myMemberCountChannel
      .setName(`Online Players: 0`)
      .catch(console.error);
  });
}, process.env.DISCORDCHANNELNAMEREFRESHRATE);

client.on('messageCreate', async (message) => {
  if(message.content.startsWith(prefix + "rconM") && message.member.roles.cache.some(role => role.name === process.env.ROLE)){
      let rconMessage = message.content.slice(7)
      console.log(rconMessage)
      conn.connect();
      await sleep(2000)
      conn.send("announce " + rconMessage);
      await sleep(2000)
      if(rconRes == ""){rconRes =  "'" + rconMessage + "' message has been successfully sent to the server!"} 
      message.channel.send(rconRes)
      rconRes = ""
      conn.disconnect();
  }
  if(message.content.startsWith(prefix + "rconA") && message.member.roles.cache.some(role => role.name === process.env.ROLE)){
    let rconMessage = message.content.slice(7)
    conn.connect();
    await sleep(2000)
    conn.send("announcerestart " + Number(rconMessage))
    await sleep(2000)
    if(rconRes == ""){rconRes = "Server will restart in " + rconMessage + " minute, announcement was successfully sent to the server!"} 
    message.channel.send(rconRes)
    rconRes = ""
    conn.disconnect();
}
if(message.content.startsWith(prefix + 'players')  && message.member.roles.cache.some(role => role.name === process.env.ROLE)) {
  Gamedig.query({
    type: '7d2d',
    host: process.env.IP,
    port: process.env.PORT
  }).then((info) => {
    const embed = new Discord.MessageEmbed()
    .setTitle(`Player List`)
    .setColor('#810e0e')
    .setThumbnail(process.env.SERVERLOGO)
     .setTimestamp()
     info.players.forEach(array => {
      embed.addField(array.name, "Level: " + array.raw.score);
    }); 
    message.channel.send({ embeds: [embed] })
  }).catch((error) => {
    console.log(error);
  });
}
if(message.content.startsWith(prefix + 'admin') && message.member.roles.cache.some(role => role.name === process.env.ROLE)) {
    const embed = new Discord.MessageEmbed()
    .setTitle(`Admin Commands`)
    .setColor('#810e0e')
    .setThumbnail(process.env.SERVERLOGO)
    .addFields( 
    {
       name: '?rconM [message]' ,
       value: "Sends a system message to the server",
       inline: false,
     },
     {
        name: '?rconA [minutes]' ,
        value: "Sends a system message to the server regarding a server restarted in the minutes defined.",
        inline: false,
      },
      {
        name: '?info' ,
        value: "Server information will be posted on the channel",
        inline: false,
        
      },
      {
        name: '?players' ,
        value: "Will recive a list of players currently playing on the server.",
        inline: false,
      },
)
    .setTimestamp()  
    message.channel.send({ embeds: [embed] })
}
  if(message.content.startsWith(prefix + 'info')) {
    Gamedig.query({
      type: '7d2d',
      host: process.env.IP,
      port: process.env.PORT
    }).then((info) => {
      const embed = new Discord.MessageEmbed()
      .setTitle(`Server Information`)
      .setColor('#810e0e')
      .setThumbnail(process.env.SERVERLOGO)
      .addFields( 
      {
         name: 'Server Name' ,
         value: info.name,
         inline: false,
       },
       {
          name: 'Server Ip' ,
          value: info.connect,
          inline: false,
        },
        {
          name: 'Slots Available' ,
          value: "" + (info.maxplayers - info.raw.numplayers),
          inline: true,
          
        },
        {
          name: 'Online Players' ,
          value: "" + info.raw.numplayers,
          inline: true,
        })
      .setTimestamp()  
      message.channel.send({ embeds: [embed] })
    }).catch((error) => {
      console.log(error);
    });
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.DISCORDBOTTOKEN);





