const Discord = require('discord.js');
const Client = new Discord.Client();
const Config = require('./config.json');
const axios = require("axios");

const token = Config.botsettings.token;
const prefix = Config.botsettings.prefix;
const talkedRecently = new Set(Config.botsettings.talkedRecently);

Client.on("ready", async () => {
  console.log(`${Client.user.tag} is starting, have fun!.`);
  let server
  try {
      server = await axios.get(`${Config.altvsettings.altvapiurl}${Config.altvsettings.altvserverid}`, { responseType: 'json' }); 
      const activity = server.data.info.players + "/" + server.data.info.maxPlayers;
      Client.user.setPresence({ activity: { type: "PLAYING", name: `${activity} Players | ${prefix}help`}, status: 'online' })
  }      
  catch (e) {
      Client.user.setPresence({ activity: { type: "PLAYING", name: `0/0 Players | ${prefix}help`}, status: 'online' })
      return console.log("Can't find the Server"); 
  }
});




Client.on('message', async message => {
  
  if(message.author.id == Client.user.id) return;
  if(message.author.bot) return; 
	if(message.guild == null) return;
  if(!message.content.startsWith(prefix) || message.author.bot) return;

            if (talkedRecently.has(message.author.id)) {
            } else {
            
                 if (message.content.toLowerCase() === `${prefix}status`) {
                  bannerUrl = "https://cdn.discordapp.com/attachments/723936527263990424/833181449439936512/no-thumb.jpg";

                  let serverstatsoffline = new Discord.MessageEmbed() 
                  .setColor('RED')
                  .setTitle(`Server is not online!`)   
                  .setURL(`http://discord.gg`)
                  .setAuthor(`Server is not online!`, `${bannerUrl}`)
                  .setDescription([ 
                    "**Players:** " + "Offline 🔴",
                    "**Status:** " + "Offline 🔴",
                    "**Server IP:** " + "Offline 🔴"
                                ])
                  .setThumbnail(`${bannerUrl}`)
                  .addFields(
                    { name: 'Description', value: `Offline 🔴` },
                    { name: 'Tags', value: `Offline 🔴\n` },
                    { name: 'Version', value:  `Offline 🔴`, inline: true },
                    { name: 'Language', value: `Offline 🔴`, inline: true },
                    { name: 'Game Mode', value: `Offline 🔴`, inline: true },
                  )
                  .setImage(`${bannerUrl}`)


                    let server
                    try {
                        server = await axios.get(`${Config.altvsettings.altvapiurl}${Config.altvsettings.altvserverid}`, { responseType: 'json' });
                       
                        if(server.data.info.bannerUrl === null){
                          bannerUrl = "https://cdn.discordapp.com/attachments/723936527263990424/833181449439936512/no-thumb.jpg";
                        }else{
                          bannerUrl = server.data.info.bannerUrl;
                        }

                        let serverstatsonline = new Discord.MessageEmbed() 
                        .setColor('GREEN')
                        .setTitle(`${server.data.info.name}`)   
                        .setURL(`http://${server.data.info.website}`)
                        .setAuthor(`${server.data.info.name}`, `${bannerUrl}`)
                        .setDescription([ 
                          "**Players:** " + "\`" + server.data.info.players + "/" + server.data.info.maxPlayers + "\`",
                          "**Status:** " + "Online 🟢",
                          "**Server IP:** " + server.data.info.host
                                      ])
                        .setThumbnail(`${bannerUrl}`)
                        .addFields(
                          { name: 'Description', value: `${server.data.info.description}` },
                          { name: 'Tags', value: `${server.data.info.tags.length == 0 ? "Not set!" : server.data.info.tags }\n` },
                          { name: 'Version', value:  `${server.data.info.version.length == 0 ? "Not set!" : server.data.info.version}`, inline: true },
                          { name: 'Language', value: `${server.data.info.language.length == 0 ? "Not set!" : server.data.info.language}`, inline: true },
                          { name: 'Game Mode', value: `${server.data.info.gameMode.length == 0 ? "Not set!" : server.data.info.gameMode}`, inline: true },
                        )
                        .setImage(`${bannerUrl}`)

                        message.channel.send(serverstatsonline)
                    }      
                    catch (e) {
                        return message.channel.send(serverstatsoffline) 
                    }
            
            talkedRecently.add(message.author.id);
           
            setTimeout(() => {
            talkedRecently.delete(message.author.id);
            }, 59999);

        }
    }
});

Client.login(token)