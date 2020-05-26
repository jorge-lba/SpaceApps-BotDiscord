import * as Discord from 'discord.js'
import {certifiedGenerator} from './certifiedGenerator'
import { Bot } from './model/Bot'

// const Discord = require( 'discord.js' )
// const Certified = require( './certifiedGenerator' )
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
    
    if( msg.author.bot ) return
        
    if( msg.channel.type === 'dm' ){
        
        const discordName = msg.channel.recipient.username
        const discordUserId = parseInt(msg.channel.recipient.discriminator)
        
        const userBot = new Bot({
            discordName,
            discordUserId 
        }, message)
        
        const response = await userBot.run()
        
        msg.reply( response || 'Error' )

        // if( message === 'certificado' ||message === 'Certificado' ){
        //     await certifiedGenerator( user.username )
        //     msg.author.send('test', { files: ['./assets/certified/' + user.username + '.png'] })
        //     console.log( message )
        // }

        // if( msg.content=== 'jorge@test.com' ){
        //     msg.reply( 'Seja bem-vindo!' )
        // }else if( msg.content ){
        //    await msg.reply( 'Digite o email de inscrição.' )
        // }else{
        //    await msg.reply( 'Error' )
        // }
        
    }

    

} )