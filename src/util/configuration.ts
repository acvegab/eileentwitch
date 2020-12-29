export const config = {
    'chatClient':['satokito','cartulain'],
    'socialMessageMinutes':15,
    'allowedUsers':[
        'eileenpure',
        'satokito',
        'cartulain'
    ],
    'messages':{
        'social':[
                '¡Holi! No olvides seguir a Satokito en twitter https://twitter.com/Satokito y en instagram https://www.instagram.com/cartulain ❤︎ ❤︎ ❤︎',
                '¿Ya sigues a Satokito en sus redes? Síguela en twitter https://twitter.com/Satokito y en instagram https://www.instagram.com/cartulain ❤︎ ❤︎ ❤︎',
                'Sigue a Satokito en facebook https://www.facebook.com/Satokitoplz ❤︎ ❤︎ ❤︎'
                ],
        'greet':[

            ]
    },
    'regexDict':{
        'greet':/(^|\s)((hol((a($|s*))|(i($|ta|wi+)?s*)))|((k|(qu))e tal)|wena+s+|(buen((a|o)+s*)?( ((d(í|i)a)|tarde|noche)s*)?))(\s|$)/g,
        'twitter':/(^!tw(itter)?$)/g,
        'facebook':/(^!f(acebook|b)$)/g,
        'instagram':/(^!i(nstagram|g)$)/g,
        'discord':/(^!discord$)/g,
        'url':/((http|ftp|https):\/\/)?([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/g,
    }
};