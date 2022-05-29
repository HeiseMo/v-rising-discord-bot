# V Rising Discord Bot

A Discord bot that helps with V Rising server management and community management

## Getting Started

### Dependencies

* Node.JS

NPM PACKAGES
* discord.js
* gamedig
* rcon
* config
* graceful-fs

### Installing

* Clone project
```
* npm i discord.js gamedig rcon config graceful-fs
```

### Executing program

```
node .
```

## Commands

Register
```
?register [Server IP] [Query Port] [Server Logo] [Role] [PlayerCount Channel ID] [ServerStatus Channel ID]
```
```
?rconM [server IP] [RCON Port] [RCON PASSWORD] [message]
```
Example
```
?rconM 123.456.789.123 9999 MySuperSecretPassword My very cool message to my players
```
```
?rconA [server IP] [RCON Port] [RCON PASSWORD] [minutes in number]
```

## Authors

Contributors names and contact info

ex. Dominique Pizzie  
ex. [@DomPizzie](https://twitter.com/dompizzie)

## Version History

* 0.2
    * Various bug fixes and optimizations
    * See [commit change]() or See [release history]()
* 0.1
    * Initial Release

## License

This project is licensed under the [NAME HERE] License - see the LICENSE.md file for details
