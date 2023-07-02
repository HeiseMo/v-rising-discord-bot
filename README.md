# V Rising Discord Bot

A Discord bot that helps with V Rising server management and community management

## Getting Started

### Dependencies
* discord.js
* gamedig
* rcon
* config
* graceful-fs
* ms
* moment

### Installing

* Clone project
```
git clone https://github.com/HeiseMo/v-rising-discord-bot.git
```
* Install NPM packages
```
npm install
```

### Executing program

```
node .
```

### First Steps
1) If you already dont have an Admin role, create a role called Admin.
2) Create 2 Voice channels and copy their IDs for the step below.
3) You will need to register your server and information with the following command;
```
?register [Server IP] [Query Port] [Server Logo] [Role] [PlayerCount Channel ID] [ServerStatus Channel ID]
```
Example Command:
```
// ?register 123.456.789.123 1111 https://someimage.com/coolimage.png Admin 12345678912 32165498712
```
This will help with getting information for the commands and also update your 2 channels for player count and server status. Updates for those 2 channels are by default set to 30 min intervals.


## Commands

Register
```
?register [Server IP] [Query Port] [Server Logo] [Role] [PlayerCount Channel ID] [ServerStatus Channel ID]
```
RCON Message
```
?rconM [server IP] [RCON Port] [RCON PASSWORD] [message]
```
RCON Announcement
```
?rconA [server IP] [RCON Port] [RCON PASSWORD] [minutes]
```
Players
```
?players
```
Info
```
?info
```

## ENV
1) Create a .env file in the directory and add the following lines.
```
ROLE="Admin"                                   #Role name you would like admin right check for admin commands
DISCORDCHANNELNAMEREFRESHRATE=1800000          #Input the seconds you would like to refresh the 2 voice channels 60000 = 1 minute
DISCORDBOTTOKEN=""                             #Your discord bot token
```

## Authors

Contributors names and contact info

Timur James Tanurhan
aka doubtfulhermit

## Version History

* 0.1
    * Initial Release
* 0.2
    * Converted to Discord.js v14

