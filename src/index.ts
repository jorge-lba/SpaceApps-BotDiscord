import * as Discord from 'discord.js'
import { Bot } from './model/Bot'

// const Discord = require( 'discord.js' )
// const Certified = require( './certifiedGenerator' )

const guildRoles = {
    everyone:{
        id: '710281096394309654',
        name: '@everyone'
    },
    Admin:{
        id: '710324427807785001',
        name: 'Admin'
    },
    master_bot:{
        id: '710326546279432223',
        name: 'master bot'
    },
    participante:{
        id: '711350098109661214',
        name: 'participante'
    },
    mentor:{
        id: '711350643742343218',
        name: 'mentor'
    },
}

const guildChannel={
    acess:{
        name: 'acesso',
        id: '715225782527721502'
    }
}
require( 'dotenv/config' )

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

const bot = new Discord.Client( )

bot.login( DISCORD_BOT_TOKEN )

bot.on( 'ready', () => {
    console.log( 'Estou pronto para iniciar' )
} )

bot.on( 'message', async (msg:any) => {
    const user = {...msg.author}
    const message = msg.content
    
    // msg.member.addRole('participante')
    if(msg.channel.id === guildChannel.acess.id && message === 'acesso'){
        // const role = msg.guild.roles.cache.find((role:any) => role.name === guildRoles.participante.name)
        const discordName = user.username
        const discordUserId = parseInt(user.discriminator)

        const userBot = new Bot({
            discordName,
            discordUserId 
        }, message, msg.member)
        userBot.run()
    }
    // role.forEach((role:any) => console.log(role.id, role.name))
    
    if( msg.author.bot ) return
    
    if( msg.channel.type === 'dm' ){

        const discordName = msg.channel.recipient.username
        const discordUserId = parseInt(msg.channel.recipient.discriminator)
        
        const userBot = new Bot({
            discordName,
            discordUserId 
        }, message, msg)

        const response = await userBot.run()
        console.log(response)
        
        msg.reply( response || 'Error' )


        // if( msg.content=== 'jorge@test.com' ){
        //     msg.reply( 'Seja bem-vindo!' )
        // }else if( msg.content ){
        //    await msg.reply( 'Digite o email de inscrição.' )
        // }else{
        //    await msg.reply( 'Error' )
        // }
        
    }

    

} )