const { SlashCommandBuilder } = require('@discordjs/builders');
const Rcon = require('rcon');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rconm')
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
    .addStringOption(option =>
      option.setName('rcon_cmd')
        .setDescription('RCON Message')
        .setRequired(true)),
  run: async (client, interaction) => {
    const rconIP = interaction.options.getString('rcon_ip');
    const rconPort = interaction.options.getInteger('rcon_port');
    const rconPassword = interaction.options.getString('rcon_password');
    const rconCMD = interaction.options.getString('rcon_cmd');
    // Connect to RCON
    const conn = new Rcon(rconIP, rconPort, rconPassword);
    let rconRes = '';
    conn.on('auth', function() {
      console.log('Authenticated');
    }).on('response', function(str) {
      console.log('Response: ' + str);
      rconRes = str;
    }).on('error', function(err) {
      console.log('Error: ' + err);
    }).on('end', function() {
      console.log('Connection closed');
    });
    conn.connect();
    await new Promise(r => setTimeout(r, 2000));
    conn.send('announce ' + rconCMD);
    await new Promise(r => setTimeout(r, 2000));
    if (rconRes == '') {
      rconRes = '\'' + rconCMD + '\' message has been successfully sent to the server!';
    }
    interaction.reply(rconRes);
    rconRes = '';
    conn.disconnect();
  }
};
