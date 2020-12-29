import { ChatUser } from 'twitch-chat-client';
import { CronJob } from 'cron';

import {config} from './util/configuration';

export class Bot{
    private cronJob:CronJob;
    private greetUsers=[];
    private lastDate:Date;
    private messages_order;
    constructor(){
        this.lastDate = new Date(0);
        this.messages_order={
            'social':[...Array(config.messages['social'].length).keys()],
            'greet':[...Array(config.messages['greet'].length).keys()]
        };
        this.startJob();

    }
    public getMessage(user,message) {
        if(message.toLowerCase().search(config.regexDict.greet)>=0){
            if(!this.greetUsers.includes(user)){
                this.greetUsers.push(user);
                return `¡Hola ${user}! Espero disfrutes el stream ❤︎ ❤︎ ❤︎`;
            }

        }else if(message.toLowerCase().search(config.regexDict.twitter)>=0){
            return 'Sigue a Satokito en twitter https://twitter.com/Satokito ❤︎ ❤︎ ❤︎'
        }else if(message.toLowerCase().search(config.regexDict.facebook)>=0){
            return 'Sigue a Satokito en facebook https://www.facebook.com/Satokitoplz ❤︎ ❤︎ ❤︎'
        }else if(message.toLowerCase().search(config.regexDict.instagram)>=0){
            return 'Sigue a Satokito en instagram https://www.instagram.com/cartulain ❤︎ ❤︎ ❤︎'
        }else if(message.toLowerCase().search(config.regexDict.discord)>=0){
            return 'Únete a nuestro discord https://discord.gg/W3mMpUtUp4 ❤︎ ❤︎ ❤︎'
        // }else if(config.allowedUsers.includes(user) && message.toLowerCase()=='!start'){
        //     this.greetUsers=[]
        //     return 'Estamos listos para iniciar ❤︎ ! ';
        }else if(config.allowedUsers.includes(user)&&message.toLowerCase().search(/^!raid\s/g)>=0){ //raid someone
            let user_to_raid=message.split(' ')[1].toLowerCase();
            return [`Let's raid ${user_to_raid} !!!`,`/raid ${user_to_raid}`];
        }else if(config.allowedUsers.includes(user)&&message.toLowerCase().search(/^!so\s/g)>=0){ //raid someone
            let user_shoutout=message.split(' ')[1];
            return `Visiten a ${user_shoutout} en su canal https://www.twitch.tv/${user_shoutout.toLowerCase()} y denle mucho amor ❤︎ ❤︎ ❤︎`;
        }else if(!config.allowedUsers.includes(user)&&message.toLowerCase().search(config.regexDict.url)>=0){ //Links deletion
            return 'No uses links, gracias ❤︎ !';
        }else if(config.allowedUsers.includes(user)&&message.toLowerCase().search(/^!esmod\s/g)>=0){ //raid someone
            let user_mod=message.split(' ')[1];
            const chatUser = new ChatUser(user_mod,undefined);
            console.log('chatUser.isMod');
            console.log(chatUser);
            return 'teehee ❤︎ !';
        }else{
            return false;
        }

    }
    public promoSocial(messageDate:Date){
        let response:boolean|string=false;
        if((messageDate.getTime()-this.lastDate.getTime())>60000*config.socialMessageMinutes){
            let next_message=this.messages_order['social'].shift();
            this.messages_order['social'].push(next_message);
            this.lastDate=new Date();
            response = config.messages['social'][next_message];
        }
        return response;
    }
    public reset(){
        console.log(`Reset cron job: ${new Date()}`);
        this.greetUsers=[]
    }
    public startJob(){
        console.log(`Start cron job`);
        this.cronJob = new CronJob('0 0 0 * * *', async () => {
            try {
            await this.reset();
            } catch (e) {
            console.error(e);
            }
        });
        this.cronJob.start();
    }
}