import { ChatClient } from 'twitch-chat-client';
import { RefreshableAuthProvider, StaticAuthProvider } from 'twitch-auth';
import { promises as fs } from 'fs';
import { util } from 'chai';
import {config} from './util/configuration';

require('dotenv').config();
const messages_order={
    'social':[...Array(config.messages['social'].length).keys()],
    'greet':[...Array(config.messages['social'].length).keys()]
};
async function main() {
    let greetUsers=[];
    const clientId = process.env.CLIENT_ID
    const clientSecret = process.env.CLIENT_SECRET
    const tokenData = JSON.parse(await fs.readFile('tokens.json'));
    const auth = new RefreshableAuthProvider(
        new StaticAuthProvider(clientId, tokenData.accessToken),
        {
            clientSecret,
            refreshToken: tokenData.refreshToken,
            expiry: tokenData.expiryTimestamp === null ? null : new Date(tokenData.expiryTimestamp),
            onRefresh: async ({ accessToken, refreshToken, expiryDate }) => {
                const newTokenData = {
                    accessToken,
                    refreshToken,
                    expiryTimestamp: expiryDate === null ? null : expiryDate.getTime()
                };
                await fs.writeFile('./tokens.json', JSON.stringify(newTokenData, null, 4))
            }
        }
    );

    const chatClient = new ChatClient(auth, { channels: config.chatClient });
    await chatClient.connect();
    let messageCount=0;
    let lastDate=new Date(0);
    chatClient.onMessage((channel, user, message) => {
        let messageDate=new Date();
        let new_message=getMessage(user,message);
        if (new_message) {
            if(Array.isArray(new_message)){
                for (let message of new_message){
                    chatClient.say(channel, message);
                }
            }else{
                chatClient.say(channel, new_message);
            }
        }
        if((messageDate.getTime()-lastDate.getTime())>60000*config.socialMessageMinutes){
            let next_message=messages_order['social'].shift();
            messages_order['social'].push(next_message);
            chatClient.say(channel, config.messages['social'][next_message]);
            lastDate=new Date();
        }
    });

    function getMessage(user,message) {
        if(message.toLowerCase().search(config.regexDict.greet)>=0){
            if(!greetUsers.includes(user)){
                greetUsers.push(user);
                return `¡Hola ${user}! Espero disfrutes el stream ❤︎ ❤︎ ❤︎`;
            }

        }else if(message.toLowerCase().search(config.regexDict.twitter)>=0){
            return 'Sigue a Satokito en twitter https://twitter.com/Satokito ❤︎ ❤︎ ❤︎'
        }else if(message.toLowerCase().search(config.regexDict.facebook)>=0){
            return 'Sigue a Satokito en facebook https://www.facebook.com/Satokitoplz ❤︎ ❤︎ ❤︎'
        }else if(message.toLowerCase().search(config.regexDict.instagram)>=0){
            return 'Sigue a Satokito en instagram https://www.instagram.com/cartulain ❤︎ ❤︎ ❤︎'
        }else if(config.allowedUsers.includes(user) && message.toLowerCase()=='!start'){
            greetUsers=[]
            return 'Estamos listos para iniciar ❤︎ ! ';
        }else if(config.allowedUsers.includes(user)&&message.toLowerCase().search(/^!raid\s/g)>=0){ //raid someone
            let user_to_raid=message.split(' ')[1].toLowerCase();
            return [`Let's raid ${user_to_raid} !!!`,`/raid ${user_to_raid}`];
        }else if(config.allowedUsers.includes(user)&&message.toLowerCase().search(/^!so\s/g)>=0){ //raid someone
            let user_shoutout=message.split(' ')[1];
            return `Visiten a ${user_shoutout} en su canal https://www.twitch.tv/${user_shoutout.toLowerCase()} y denle mucho amor ❤︎ ❤︎ ❤︎`;
        }else if(!config.allowedUsers.includes(user)&&message.toLowerCase().search(config.regexDict.url)>=0){ //Links deletion
            return 'No uses links, gracias ❤︎ !';
        }else{
            return false;
        }

    }
}

main();
// anuncio redes 
// responda holas
// alerta de follow
// alerta de sub
// top de mensajes
// pendejadas por día:
// -más mayúsculas
// -más mensajes consecutivos
// -más acentos
// -más emotes(?)
// -más veces que me hayan llamado cari/carito/caro/satokito