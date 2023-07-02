const { SlashCommandBuilder, SlashCommandIntegerOption } = require('@discordjs/builders');
const Rcon = require('rcon');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('rcona')
  .setDescription('Run RCON command')
  .addStringOption(option =>
    option.setName('rcon_ip')
      .setDescription('RCON IP')
      .setRequired(true))
  .addIntegerOption(option =>
    option.setName('rcon_port')
      .setDescription('RCON Port')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('rcon_password')
      .setDescription('RCON Password')
      .setRequired(true))
  .addIntegerOption(option =>
    option.setName('minutes')
      .setDescription('Minutes for the server to restart')
      .setRequired(true)),
  run: async (client, interaction) => {
    console.log(interaction.options.getInteger("rcon_port"))
    let rconIP = interaction.options.getString("rcon_ip")
    let rconPort = interaction.options.getInteger("rcon_port")
    let rconPassword = interaction.options.getString("rcon_password")
    let rconCMD = interaction.options.getInteger("minutes")
    console.log(rconCMD)
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
    conn.send("announcerestart " + Number(rconCMD))
    await sleep(2000)
    if (rconRes == "") {
        rconRes = "Server will restart in " + rconCMD + " minute, announcement was successfully sent to the server!"
    }
    interaction.reply(rconRes)
    rconRes = ""
    conn.disconnect();
  }
};
