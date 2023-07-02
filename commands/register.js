const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register the server')
    .addStringOption(option =>
      option.setName('server_ip')
        .setDescription('Server IP')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('server_port')
        .setDescription('Server Port')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('server_logo')
        .setDescription('Server Logo')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('important_role')
        .setDescription('Important Role')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('player_counter_channel')
        .setDescription('Player Counter Channel')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('server_status_channel')
        .setDescription('Server Status Channel')
        .setRequired(true)),
  run: async (client, interaction) => {
    if (!interaction.member.roles.cache.some(role => role.name === process.env.ROLE)) {
      return interaction.reply('You do not have permission to use this command.');
    }
    const serverID = interaction.guild.id;
    const myServerIP = interaction.options.getString('server_ip');
    const myServerPort = interaction.options.getInteger('server_port');
    const serverLogo = interaction.options.getString('server_logo');
    const myImportantRole = interaction.options.getRole('important_role').id;
    const myPlayerCounterChannelId = interaction.options.getChannel('player_counter_channel').id;
    const myServerStatusChannelId = interaction.options.getChannel('server_status_channel').id;

    const reg = {
      serverID: serverID.toString(),
      data: {
        ip: myServerIP.toString(),
        port: myServerPort.toString(),
        serverlogo: serverLogo.toString(),
        role: myImportantRole.toString(),
        playercount: myPlayerCounterChannelId.toString(),
        serverstatus: myServerStatusChannelId.toString(),
      }
    };

    try {
      const data = await readFileAsync('config/default.json');
      const json = JSON.parse(data);
      const checkIfExists = json.findIndex(check => check.serverID === serverID.toString());

      if (checkIfExists === -1) {
        json.push(reg);
      } else {
        json.splice(checkIfExists, 1);
        json.push(reg);
      }

      await writeFileAsync('config/default.json', JSON.stringify(json));
      interaction.reply({ content: 'Server registration updated.', ephemeral: true });
    } catch (err) {
      console.error(err);
      interaction.reply({ content: 'There was an error updating the server registration.', ephemeral: true });
    }
  }
};
