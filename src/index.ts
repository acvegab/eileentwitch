import { ChatClient } from 'twitch-chat-client';
import { RefreshableAuthProvider, StaticAuthProvider } from 'twitch-auth';
import { promises as fs } from 'fs';
require('dotenv').config();

async function main() {
    const socialMessageMinutes=15;

    const messages={
        'social':[
                '¡Holi! No olvides seguir a Satokito en twitter https://twitter.com/Satokito y en instagram https://www.instagram.com/cartulain ❤︎ ❤︎ ❤︎',
                '¿Ya sigues a Satokito en sus redes? Síguela en twitter https://twitter.com/Satokito y en instagram https://www.instagram.com/cartulain ❤︎ ❤︎ ❤︎',
                'Sigue a Satokito en facebook https://www.facebook.com/Satokitoplz ❤︎ ❤︎ ❤︎'
                ],
        'greet':[

            ]
    };
    const messages_order={
        'social':[...Array(messages['social'].length).keys()],
        'greet':[...Array(messages['social'].length).keys()]
    }
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

    const chatClient = new ChatClient(auth, { channels: ['satokito'] });
    await chatClient.connect();
    let messageCount=0;
    let lastDate=new Date(0);
    chatClient.onMessage((channel, user, message) => {
        let messageDate=new Date();
        let new_message=getMessage(user,message);
        if (new_message) {
            chatClient.say(channel, new_message);
        }
        if((messageDate.getTime()-lastDate.getTime())>60000*socialMessageMinutes){
            let next_message=messages_order['social'].shift();
            messages_order['social'].push(next_message);
            chatClient.say(channel, messages['social'][next_message]);
            lastDate=new Date();
        }
    });

    function getMessage(user,message) {
        if(message.toLowerCase().search(/(^|\s)(hol((a($|s*))|(i(ta)?s*)))|((k|(qu))e tal)|wena+s+|buena+s+|(buen(os)? d(í|i)as+)(\s|$)/g)>=0){
            if(!greetUsers.includes(user)){
                greetUsers.push(user);
                return `¡Hola ${user}! Espero disfrutes el stream ❤︎ ❤︎ ❤︎`;
            }
        }else if(message.toLowerCase().search(/(^!eileen reset$)/g)>=0){
            greetUsers=[]
            return 'Estamos listos para iniciar ❤︎ ! ';
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