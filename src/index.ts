import { ChatClient, ChatUser } from 'twitch-chat-client';
import { RefreshableAuthProvider, StaticAuthProvider } from 'twitch-auth';
import { promises as fs } from 'fs';
import { util } from 'chai';
import {config} from './util/configuration';
import {Bot} from "./bot";

require('dotenv').config();
async function main() {
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
    let eileen = new Bot();
    chatClient.onMessage((channel, user, message) => {
        let messageDate=new Date();
        let new_message=eileen.getMessage(user,message);
        if (new_message) {
            if(Array.isArray(new_message)){
                for (let message of new_message){
                    chatClient.say(channel, message);
                }
            }else{
                chatClient.say(channel, new_message);
            }
        }
        let response=eileen.promoSocial(messageDate);
        if(response) chatClient.say(channel, response);
    });

    
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