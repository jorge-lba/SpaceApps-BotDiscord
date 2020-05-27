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
exports.Participants = void 0;
const dotenv = __importStar(require("dotenv"));
const fetch = require('node-fetch');
dotenv.config();
class Participants {
    constructor() {
        this.url_server = String(process.env.URL_SERVER_DATABASE);
        this.pathParticipants = '/users';
        this.pathMentors = '/mentors';
    }
    listParticipants() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.url_server + this.pathParticipants);
            const { message, userList } = yield response.json();
            return userList;
        });
    }
    listMentors() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.url_server + this.pathMentors);
            const { message, userList } = yield response.json();
            return userList;
        });
    }
    updateParticiant(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const method = {
                method: 'PUT',
                body: JSON.stringify({
                    cellPhone: user.cellPhone,
                    discordName: user.discordName,
                    discordUserId: user.discordUserId,
                    team: user.team,
                    type: user.type,
                    mentoringSchedule: user.mentoringSchedule
                }),
                headers: { 'Content-Type': 'application/json' }
            };
            let path;
            if (user.type === 'participant') {
                path = this.pathParticipants;
            }
            else {
                path = this.pathMentors;
            }
            const response = yield fetch(this.url_server + path + '/' + id, method);
            const resp = yield response.json();
            return resp;
        });
    }
    validateEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const participants = yield this.listParticipants();
            let testResult = participants.find((participant) => participant.email === email);
            if (testResult)
                return Object.assign(Object.assign({}, testResult), { type: 'participant' });
            const mentors = yield this.listMentors();
            testResult = mentors.find((mentor) => mentor.email === email);
            if (testResult)
                return Object.assign(Object.assign({}, testResult), { type: 'mentor' });
            return { error: 'unregistered user', type: 'unregistered user' };
        });
    }
    validateDiscordUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const participants = yield this.listParticipants();
            let testResult = participants.find((participant) => participant.discordUserId === id);
            if (testResult)
                return Object.assign(Object.assign({}, testResult), { type: 'participant' });
            const mentors = yield this.listMentors();
            testResult = mentors.find((mentor) => mentor.discordUserId === id);
            if (testResult)
                return Object.assign(Object.assign({}, testResult), { type: 'mentor' });
            return { error: 'unregistered user', type: 'unregistered user' };
        });
    }
}
exports.Participants = Participants;
// const user = new Participants()
// async function run(){
//     const participants = await user.listParticipants()
//     const mentors = await user.listMentors()
//     const participant = await user.validateEmail('mentor@space.com')
//     const discord = await user.validateDiscordUser(23)
//     console.log(discord)
// }
// run()
