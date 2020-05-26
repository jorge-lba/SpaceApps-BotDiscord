"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Discord = require('discord.js');
const Certified = require('./certifiedGenerator');
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
        if (message === 'certificado' || message === 'Certificado') {
            yield Certified(user.username);
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
