const { SlashCommandBuilder } = require('@discordjs/builders');
const Rcon = require('rcon');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('rcona')
  .setDescription('Command description')
  .addStringOption(option =>
    option.setName('ip')
      .setDescription('Server IP')
      .setRequired(true))
  .addIntegerOption(option =>
    option.setName('port')
      .setDescription('Server Port')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('password')
      .setDescription('Server Password')
      .setRequired(true))
  .addIntegerOption(option =>
    option.setName('minutes')
      .setDescription('Minutes for the server to restart')
      .setRequired(true)),
  run: async (client, interaction) => {
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
    interaction.reply(rconRes)
    rconRes = ""
    conn.disconnect();
  }
};
