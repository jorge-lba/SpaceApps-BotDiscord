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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const participants_1 = require("../templates/participants");
const mentoring_1 = require("../templates/mentoring");
const Participant_1 = require("../Participant");
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
class Bot {
    constructor(dataUser, message) {
        this.dataUser = dataUser;
        this.message = message;
        this.participants = new participants_1.Participants;
        this.mentorings = new mentoring_1.Mentoring;
        this.options = {
            createTeam: {
                comand: 'criartime',
                response: 'Time ## foi criado.',
                error: 'Você não pode criar um time em quanto for membro de outro time.'
            },
            team: {
                comand: 'time',
                response: `Time: ##
            Membros: @@
            Mentorias Agendadas: !!`,
                error: 'Você não está em nenhum time no momento.'
            },
            listmentoring: {
                comand: {
                    all: 'listarmentorias',
                    area: 'listarmentorias-area',
                    mentor: 'listarmentorias-mentor'
                },
                response: '@@ - ## - !!'
            },
            markMentoring: {
                comando: 'marcarmentoria',
                response: 'Mentoria de @@ com ## dia !! foi marcada com sucesso!'
            }
        };
        this.discordName = dataUser.discordName;
        this.discordUserId = dataUser.discordUserId;
        this.teamName = dataUser.teamName;
    }
    validateUserByDiscordId() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.participants.validateDiscordUser(this.dataUser.discordUserId);
        });
    }
    filterComand(message) {
        let [comand, text] = message.replace(':', ';').split(';');
        comand = comand.toLowerCase().replace(/ /gm, '');
        if (text)
            text = text.replace(/(^\s+|\s+$)/g, '');
        return { comand, text };
    }
    createTeam(user, teamName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.team) {
                return this.options.createTeam.error;
            }
            else {
                const participant = new Participant_1.Participant(user.name, user.email, teamName);
                const { message, team, error } = yield participant.createTeam(teamName);
                if (error)
                    return message;
                const response = this.options.createTeam.response.replace('##', team.name);
                return response;
            }
        });
    }
    myTeam(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.team) {
                const participant = new Participant_1.Participant(user.name, user.email, user.team);
                const resp = yield participant.viewMyTeam();
                const response = this.options.team.response
                    .replace('##', resp.team.name)
                    .replace('@@', resp.team.members)
                    .replace('!!', (resp.team.scheduledMentoring[0] ? resp.team.scheduledMentoring : '---'));
                return response;
            }
            else {
                return this.options.team.error;
            }
        });
    }
    listMentoringAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const mentorings = yield this.mentorings.listAll();
            let response = '';
            mentorings.forEach((mentoring) => {
                mentoring.dates.forEach((date) => {
                    const dateformat = date_fns_1.parseISO(date.date);
                    const dataFormated = date_fns_1.format(date_fns_tz_1.zonedTimeToUtc(dateformat, 'America/Sao_Paulo'), "dd/MM/yyyy 'ás' HH:mm");
                    if (date.state === 'Open')
                        response += `\n${mentoring.mentorName} - ${mentoring.area} - ${dataFormated} - ${date.state}`;
                });
            });
            return response;
        });
    }
    listMentoringByMentor(mentorName) {
        return __awaiter(this, void 0, void 0, function* () {
            const mentorings = yield this.mentorings.listForMentor(mentorName);
            let response = '';
            mentorings.forEach((mentoring) => {
                mentoring.dates.forEach((date) => {
                    const dateformat = date_fns_1.parseISO(date.date);
                    const dataFormated = date_fns_1.format(date_fns_tz_1.zonedTimeToUtc(dateformat, 'America/Sao_Paulo'), "dd/MM/yyyy 'ás' HH:mm");
                    if (date.state === 'Open')
                        response += `\n${mentoring.mentorName} - ${mentoring.area} - ${dataFormated} - ${date.state}`;
                });
            });
            return response;
        });
    }
    listMentoringByArea(area) {
        return __awaiter(this, void 0, void 0, function* () {
            const mentorings = yield this.mentorings.listForArea(area);
            let response = '';
            mentorings.forEach((mentoring) => {
                mentoring.dates.forEach((date) => {
                    const dateformat = date_fns_1.parseISO(date.date);
                    const dataFormated = date_fns_1.format(date_fns_tz_1.zonedTimeToUtc(dateformat, 'America/Sao_Paulo'), "dd/MM/yyyy 'ás' HH:mm");
                    if (date.state === 'Open')
                        response += `\n${mentoring.mentorName} - ${mentoring.area} - ${dataFormated} - ${date.state}`;
                });
            });
            return response;
        });
    }
    markMentoring(user, mentoring) {
        return __awaiter(this, void 0, void 0, function* () {
            const [mentorName, area, dateHours, state] = mentoring.replace(/ /gm, '').split('-');
            if (state !== 'Open')
                return 'Mentoria não está disponivel.';
            const [date, hours] = dateHours.replace('ás', 'as').split('as');
            const [hour, minute] = hours.split(':');
            const [day, month, year] = date.split('/');
            const dateNew = date_fns_1.parseISO(`${year}-${month}-${day} ${hours}`);
            const dateEnd = date_fns_1.subHours(dateNew, 3); //subHours(dateNew, 3)
            let response = '';
            let mentoringObj = {};
            const mentorings = yield this.mentorings.listForMentor(mentorName);
            mentorings.forEach((mentoring) => {
                if (mentoring.area === area)
                    mentoring.dates.forEach((date) => {
                        if (new Date(date.date).getTime() === dateNew.getTime() && date.state === 'Open') {
                            mentoringObj = Object.assign({ mentor: mentoring.mentorName, area: mentoring.area }, date);
                            response = 'Mentoria marcada com sucesso!';
                        }
                    });
            });
            if (response !== 'Mentoria marcada com sucesso!')
                return 'Não foi possivel marcar essa mentoria, tente novamente.';
            const participant = new Participant_1.Participant(user.name, user.email, user.team);
            const res = yield participant.markMentoring(mentoringObj);
            return response;
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.validateUserByDiscordId();
            let response = '';
            if (user.type === 'participant') {
                const message = this.filterComand(this.message);
                switch (message.comand) {
                    case this.options.createTeam.comand:
                        response = yield this.createTeam(user, message.text);
                        break;
                    case this.options.team.comand:
                        response = yield this.myTeam(user);
                        break;
                    case this.options.listmentoring.comand.all:
                        response = yield this.listMentoringAll();
                        break;
                    case this.options.listmentoring.comand.mentor:
                        response = yield this.listMentoringByMentor(message.text);
                        break;
                    case this.options.listmentoring.comand.area:
                        response = yield this.listMentoringByArea(message.text);
                        break;
                    case this.options.markMentoring.comando:
                        response = yield this.markMentoring(user, message.text);
                        break;
                    default:
                        response = 'Este comandto não é valido.';
                        break;
                }
            }
            else if (user.type === 'mentor') {
                return 'mentor';
            }
            else {
                if (!this.isEmail()) {
                    const userIsRegistered = yield this.participants.validateEmail(this.message);
                    if (userIsRegistered.error) {
                        return 'Envie seu e-mail de cadastro.';
                    }
                    else if (userIsRegistered.type === 'mentor') {
                    }
                    else if (userIsRegistered.type === 'participant') {
                    }
                }
            }
            return response;
        });
    }
    isEmail(email = this.message) {
        const reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
        if (!reg.test(email)) {
            return false;
        }
        return true;
    }
}
exports.Bot = Bot;
// async function run(){
//     const bot = new Bot({
//         discordUserId:33, 
//         discordName:'Addae', 
//     }, //'time')
//     'marcar mentoria: Jorge - Pitch - 29/05/2020 ás 20:00 - Open')
//     const response = await bot.run()
//     console.log(response)
// }
// run()
