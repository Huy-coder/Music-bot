const Discord = require("discord.js");
const Client = require("discord.js");
const Attachment = require("discord.js");
const ytdl = require("ytdl-core");
const bot = new Discord.Client();
const prefix = '!';
var servers ={};

bot.on('ready',() => {
    console.log('this bot is online');
})

bot.on('message',message =>{
    let args = message.content.substring(prefix.length).split(" ");
    
    switch(args[0]) {
        case 'play':

            function play(connection,message){
                var server = servers[message.guild.id];

                server.dispatcher = connection.play(ytdl(server.queue[0],{filter:"audioonly"}));

                server.queue.shift();

                server.dispatcher.on("end",function(){
                    if(server.queue[0]){
                        play(connection,message);
                    }
                    else{
                        connection.disconnect();
                    }
                });
            }

            if(!args[1]){
                message.channel.send("Cung cấp đường link bài hát...");
                return;
            }

            if(!message.member.voice.channel){
                message.channel.send("Không ở trong kêt chat voice không bật được!...");
                return;
            }

            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue :[]
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if(!message.member.voice.connection) message.member.voice.channel.join().then(function(connection)
            {
                play(connection,message);
            })



            //else msg.member.voice.channel.join()


        break;

        case 'skip':
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
            message.channel.send("Bài khác eiii....")
            break;

        case 'stop':
            var server = servers[message.guild.id];
            if(message.guild.voice.connection){
                for(var i = server.queue.length -1; i >= 0; i--){
                    server.queue.splice(i,1);
                }

                server.dispatcher.end();
                message.channel.send("bot đã tắt nhạc và rời khỏi kênh voice...")
                console.log('stopped the queue')
            }
            if(message.guild.connection) message.guild.voice.connection.disconnect();
        break;
        }
});
   

bot.login(process.env.token);