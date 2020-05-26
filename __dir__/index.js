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
const certifiedGenerator_1 = require("./certifiedGenerator");
const Bot_1 = require("./model/Bot");
// const Discord = require( 'discord.js' )
// const Certified = require( './certifiedGenerator' )
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
    if (msg.author.bot)
        return;
    console.log(msg.channel);
    if (msg.channel.type === 'dm') {
        const discordName = msg.channel.recipient.username;
        const discordUserId = msg.channel.recipient.discriminator;
        const userBot = new Bot_1.Bot({
            discordUserId,
            discordName
        }, message);
        const response = yield userBot.run();
        console.log(response);
        if (message === 'certificado' || message === 'Certificado') {
            yield certifiedGenerator_1.certifiedGenerator(user.username);
            msg.author.send('test', { files: ['./assets/certified/' + user.username + '.png'] });
            console.log(message);
        }
        if (msg.content === 'jorge@test.com') {
            msg.reply('Seja bem-vindo!');
        }
        else if (msg.content) {
            yield msg.reply('Digite o email de inscrição.');
        }
        else {
            yield msg.reply('Error');
        }
    }
}));
