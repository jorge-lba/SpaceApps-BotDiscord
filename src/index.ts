const Discord = require( 'discord.js' )
const Certified = require( './certifiedGenerator' )
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
    
    console.log( msg.channel )
    
    
    if( msg.channel.type === 'dm' ){
        
        if( message === 'certificado' ||message === 'Certificado' ){
            await Certified( user.username )
            msg.author.send('test', { files: ['./assets/certified/' + user.username + '.png'] })
            console.log( message )
        }

        if( msg.content=== 'jorge@test.com' ){
            msg.reply( 'Seja bem-vindo!' )
        }else if( msg.content ){
           await msg.reply( 'Digite o email de inscrição.' )
        }else{
           await msg.reply( 'Error' )
        }
        
    }

    

} )