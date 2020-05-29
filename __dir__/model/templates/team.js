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
exports.Team = void 0;
const dotenv = __importStar(require("dotenv"));
const date_fns_1 = require("date-fns");
const fetch = require('node-fetch');
dotenv.config();
class Team {
    constructor(_userEmail, teamId, teamName) {
        this._userEmail = _userEmail;
        this.teamId = teamId;
        this.teamName = teamName;
        this.url_server = String(process.env.URL_SERVER_DATABASE);
        this.path = '/teams';
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.url_server + this.path);
            const { message, teamList } = yield response.json();
            return {
                message,
                teamList
            };
        });
    }
    setTeam(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const { message, teamList } = yield this.list();
            const [team] = teamList.filter((item) => item.name === name);
            this.teamId = team._id;
            this.teamName = team.name;
        });
    }
    selectOne(teamId = this.teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setTeam(this.teamName);
            const response = yield fetch(this.url_server + this.path + '/' + (this.teamId || teamId));
            const { message, team } = yield response.json();
            const mentorings = [];
            for (const id of team.scheduledMentoring) {
                const result = yield fetch(this.url_server + '/mentorings' + '/' + id);
                const { message, mentoring } = yield result.json();
                delete mentoring._id;
                delete mentoring.createdAt;
                delete mentoring.updatedAt;
                delete mentoring.team;
                delete mentoring.__v;
                mentoring.date = date_fns_1.format(date_fns_1.parseISO(mentoring.date), "dd/MM/yyyy 'ás' HH:mm");
                mentorings.push(mentoring);
            }
            team.scheduledMentoring = mentorings;
            return ({
                message,
                team
            });
        });
    }
    create(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const method = {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    members: [this._userEmail]
                }),
                headers: { 'Content-Type': 'application/json' }
            };
            const response = yield fetch(this.url_server + this.path, method);
            const { message, team, error } = yield response.json();
            yield this.setTeam(name);
            return {
                message,
                team,
                error
            };
        });
    }
    addMember(email = this._userEmail, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const { message, teamList } = yield this.list();
            const [team] = teamList.filter((item) => item.name === name);
            const testMember = team.members.filter((item) => item === email);
            if (testMember)
                return { error: 'Usuário já cadastrado no time.' };
            team.members.push(email);
            const method = {
                method: 'PUT',
                body: JSON.stringify(team),
                headers: { 'Content-Type': 'application/json' }
            };
            const response = yield fetch(this.url_server + this.path + '/' + team._id, method);
            const update = yield response.json();
            return Object.assign({}, update);
        });
    }
    removeMember(email = this._userEmail, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const { message, teamList } = yield this.list();
            const [team] = teamList.filter((item) => item.name === name);
            team.members = team.members.filter(item => item !== email);
            const method = {
                method: 'PUT',
                body: JSON.stringify(team),
                headers: { 'Content-Type': 'application/json' }
            };
            const response = yield fetch(this.url_server + this.path + '/' + team._id, method);
            const update = yield response.json();
            return Object.assign({}, update);
        });
    }
    addMentoring(mentoring, teamName) {
        return __awaiter(this, void 0, void 0, function* () {
            const { message, teamList } = yield this.list();
            const [team] = teamList.filter((item) => item.name === teamName);
            team.scheduledMentoring.push(mentoring);
            const method = {
                method: 'PUT',
                body: JSON.stringify(team),
                headers: { 'Content-Type': 'application/json' }
            };
            const response = yield fetch(this.url_server + this.path + '/' + team._id, method);
            const update = yield response.json();
            return Object.assign({}, update);
        });
    }
}
exports.Team = Team;
// const team = new Team('jorge@teste.com', '5ec5c950be80b23f639df6b4')
// async function run(){
//     // const teamCreate = await team.create('SpaceApps')
//     // const login = await team.addMember('Space')
// .log(login)
//     // const leave = await team.removeMember('Space', 'v1fd86v41d65g4wsvf1dxc6v5d4g')
// .log(leave)
//     // const list = await team.selectOne()
// .log(list)
//     // const mentoring = await team.addMentoring('Space','v1fd86v41d65g4wsvf1dxc6v5d4g')
// .log(mentoring)
// }
// run()
