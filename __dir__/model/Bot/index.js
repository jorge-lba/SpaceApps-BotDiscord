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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const participants_1 = require("../templates/participants");
const mentoring_1 = require("../templates/mentoring");
const Participant_1 = require("../Participant");
const certifiedGenerator_1 = __importDefault(require("../../certifiedGenerator"));
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
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
class Bot {
    constructor(dataUser, message, member) {
        this.dataUser = dataUser;
        this.message = message;
        this.member = member;
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
                response: `\nTime: ## \nMembros: @@ \nMentorias Agendadas: !!\n`,
                error: 'Você não está em nenhum time no momento.'
            },
            addTeamMember: {
                comand: 'adicionarmembro',
                response: 'Membro adcionado!',
                erro: 'Não foi possivel adcionar o membro.'
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
            },
            comands: {
                comand: 'comandos',
                response: '\n Time \n Criar Time: "Nome do Time" \n Adicionar Membro: "email" \n Listar Mentorias \n Listar Mentorias - Area: "Area" \n Listar mentoria - Mentor: "Nome do mentor" \n Marcar Mentoria: "Nome do Mentor" - "Area" - "--/05/2020" ás --:--'
            },
            certified: {
                comand: 'gerarcertificado-off898896523369',
                response: 'Certificado SpaceApps'
            },
            acess: {
                comand: 'acesso',
                response: 'Seu acesso foi liberado.'
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
                let mentorings;
                if (resp.team.scheduledMentoring) {
                    mentorings = resp.team.scheduledMentoring.map((mentoring) => `\n     ${mentoring.mentor} - ${mentoring.area} - ${mentoring.date} - ${mentoring.state}`);
                }
                else {
                    mentorings = '---';
                }
                const response = this.options.team.response
                    .replace('##', resp.team.name)
                    .replace('@@', resp.team.members)
                    .replace('!!', (mentorings));
                return response;
            }
            else {
                return this.options.team.error;
            }
        });
    }
    addTeamMember(user, email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isEmail(email))
                return 'E-mail invalido: ' + email;
            let response = '';
            if (user.team) {
                const participant = new Participant_1.Participant(user.name, user.email, user.team);
                const newMember = yield this.participants.validateEmail(email);
                if (newMember.type === 'participant') {
                    const result = yield participant.addMemberMyTeam(email, user.team);
                    if (result.error)
                        return result.error;
                    response = 'Membro adicionado com sucesso.';
                }
                else {
                    response = 'E-mail não cadastrado: ' + email;
                }
            }
            return response;
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
            const mentors = yield this.participants.listMentors();
            const mentorByName = mentors.find((mentor) => mentor.name === mentorName);
            console.log(mentorByName);
            mentorByName.mentoringSchedule.forEach((mentorings, i) => {
                if (mentorings.area === area) {
                    mentorings.dates.forEach((date, index) => {
                        if (new Date(date.date).getTime() === dateNew.getTime() && date.state === 'Open') {
                            mentoringObj = Object.assign({ mentor: mentorByName.name, area: mentorings.area }, date);
                            mentorByName.mentoringSchedule[i].dates[index].state = 'marked';
                            response = 'Mentoria marcada com sucesso!';
                        }
                    });
                }
            });
            yield this.participants.updateParticiant({ mentoringSchedule: mentorByName.mentoringSchedule }, mentorByName._id);
            if (response !== 'Mentoria marcada com sucesso!')
                return 'Não foi possivel marcar essa mentoria, tente novamente.';
            const participant = new Participant_1.Participant(user.name, user.email, user.team);
            yield participant.markMentoring(mentoringObj);
            return response;
        });
    }
    updateParticipant(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.participants.updateParticiant(user, id);
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.validateUserByDiscordId();
            let response = '';
            if (!user.name) {
                response = 'Digite seu email de cadastro para liberar o acesso.';
            }
            if (user.type === 'participant') {
                const message = this.filterComand(this.message);
                switch (message.comand) {
                    case this.options.comands.comand:
                        response = this.options.comands.response;
                        break;
                    case this.options.createTeam.comand:
                        response = yield this.createTeam(user, message.text);
                        if (response === `Time ${message.text} foi criado.`)
                            yield this.updateParticipant({ team: message.text, type: user.type }, user._id);
                        break;
                    case this.options.team.comand:
                        response = yield this.myTeam(user);
                        break;
                    case this.options.addTeamMember.comand:
                        response = yield this.addTeamMember(user, message.text);
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
                    case this.options.acess.comand:
                        yield this.member.roles.add(guildRoles.participante.id).catch(console.error);
                        break;
                    case this.options.certified.comand:
                        yield certifiedGenerator_1.default(user.name);
                        this.member.reply('test', { files: ['./assets/certified/' + user.name + '.png'] });
                        console.log(message);
                        response = this.options.certified.response;
                        break;
                    default:
                        response = 'Este comando não é valido.';
                        break;
                }
            }
            else if (user.type === 'mentor') {
                const message = this.filterComand(this.message);
                switch (message.comand) {
                    case this.options.acess.comand:
                        yield this.member.roles.add(guildRoles.mentor.id).catch(console.error);
                        break;
                    case this.options.certified.comand:
                        yield certifiedGenerator_1.default(user.name);
                        this.member.reply('test', { files: ['./assets/certified/' + user.name + '.png'] });
                        console.log(message);
                        response = this.options.certified.response;
                        break;
                    default:
                        response = 'Este comando não é valido.';
                        break;
                }
            }
            else {
                if (this.isEmail(this.message)) {
                    const userIsRegistered = yield this.participants.validateEmail(this.message);
                    if (userIsRegistered.error) {
                        response = `Este e-mail "${this.message}" não está cadastrado, envie seu e-mail de cadastro.`;
                    }
                    else if (userIsRegistered.type === 'mentor') {
                        const result = yield this.updateParticipant({
                            discordName: this.discordName,
                            discordUserId: this.discordUserId,
                            type: 'mentor'
                        }, userIsRegistered._id);
                        response = 'Mentor';
                    }
                    else if (userIsRegistered.type === 'participant') {
                        const result = yield this.updateParticipant({
                            discordName: this.discordName,
                            discordUserId: this.discordUserId,
                            type: 'participant'
                        }, userIsRegistered._id);
                        response = 'Participante';
                    }
                }
            }
            return response;
        });
    }
    isEmail(email = this.message) {
        const reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
        return reg.test(email);
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
