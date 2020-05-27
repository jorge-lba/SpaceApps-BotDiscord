"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const Bot_1 = require("./model/Bot");
// const Discord = require( 'discord.js' )
// const Certified = require( './certifiedGenerator' )
const guildRoles = {
    everyone: {
        id: '710281096394309654',
        name: '@everyone'
    },
    Admin: {
        id: '710324427807785001',
        name: 'Admin'
    },
    master_bot: {
        id: '710326546279432223',
        name: 'master bot'
    },
    participante: {
        id: '711350098109661214',
        name: 'participante'
    },
    mentor: {
        id: '711350643742343218',
        name: 'mentor'
    },
};
const guildChannel = {
    acess: {
        name: 'acesso',
        id: '715225782527721502'
    }
};
require('dotenv/config');
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const bot = new Discord.Client();
bot.login(DISCORD_BOT_TOKEN);
bot.on('ready', () => {
    console.log('Estou pronto para iniciar');
});
bot.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const user = Object.assign({}, msg.author);
    const message = msg.content;
    // msg.member.addRole('participante')
    if (msg.channel.id === guildChannel.acess.id && message === 'acesso') {
        // const role = msg.guild.roles.cache.find((role:any) => role.name === guildRoles.participante.name)
        const discordName = user.username;
        const discordUserId = parseInt(user.discriminator);
        const userBot = new Bot_1.Bot({
            discordName,
            discordUserId
        }, message, msg.member);
        userBot.run();
    }
    // role.forEach((role:any) => console.log(role.id, role.name))
    if (msg.author.bot)
        return;
    if (msg.channel.type === 'dm') {
        const discordName = msg.channel.recipient.username;
        const discordUserId = parseInt(msg.channel.recipient.discriminator);
        const userBot = new Bot_1.Bot({
            discordName,
            discordUserId
        }, message, msg);
        const response = yield userBot.run();
        console.log(response);
        msg.reply(response || 'Error');
        // if( msg.content=== 'jorge@test.com' ){
        //     msg.reply( 'Seja bem-vindo!' )
        // }else if( msg.content ){
        //    await msg.reply( 'Digite o email de inscrição.' )
        // }else{
        //    await msg.reply( 'Error' )
        // }
    }
}));
