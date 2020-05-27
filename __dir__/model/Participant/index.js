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
exports.Participant = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const team_1 = require("../templates/team");
const mentoring_1 = require("../templates/mentoring");
class Participant {
    constructor(name, email, teamName = '', _teamId = '') {
        this.name = name;
        this.email = email;
        this.teamName = teamName;
        this._teamId = _teamId;
        this.team = new team_1.Team(this.email, this._teamId, this.teamName);
        this.mentorings = new mentoring_1.Mentoring();
        this.createTeam = (nameTeam) => __awaiter(this, void 0, void 0, function* () { return yield this.team.create(nameTeam); });
        this.addMemberMyTeam = (email, team) => __awaiter(this, void 0, void 0, function* () { return yield this.team.addMember(email, team || this.teamName); });
        this.removeMemberMyTeam = (email) => __awaiter(this, void 0, void 0, function* () { return yield this.team.removeMember(email, this.teamName); });
        this.addMentoringTeam = (mentoring) => __awaiter(this, void 0, void 0, function* () { return yield this.team.addMentoring(mentoring, this.teamName); });
        this.viewMyTeam = () => __awaiter(this, void 0, void 0, function* () { return yield this.team.selectOne(); });
        this.listAllMentorings = () => __awaiter(this, void 0, void 0, function* () { return this.mentorings.listAll(); });
        this.listMentoringsByMentor = (name) => __awaiter(this, void 0, void 0, function* () { return this.mentorings.listForMentor(name); });
        this.listMentoringByArea = (arae) => __awaiter(this, void 0, void 0, function* () { return this.mentorings.listForArea(arae); });
        this.markMentoring = (item) => __awaiter(this, void 0, void 0, function* () {
            const marked = yield this.mentorings.mark(Object.assign(Object.assign({}, item), { team: this.teamName }));
            yield this.addMentoringTeam(marked.mentoring._id);
            return marked;
        });
        this.listMentoringMyTeam = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.viewMyTeam();
            return response.scheduledMentoring;
        });
        console.log(teamName);
    }
    get teamId() { return this._teamId; }
}
exports.Participant = Participant;
// const jorge = new Participant('jorge', 'j@j.com','SpaceApps2', '5ec724d4ab3cff35a4b6513c')
// async function run(){
//     // await jorge.createTeam('SpaceApps2')
//     // const memberAdd = await jorge.addMemberMyTeam('jorge@test.com')
// //    const memberRM = await jorge.removeMemberMyTeam('jorge@test.com')
//     // console.log(memberAdd)
// //    console.log(memberRM)
//     // const addMentoring = await jorge.addMentoringTeam('sdsafsdfvcdfvdfds')
//     // console.log(addMentoring)
//     // const listAll = await jorge.listAllMentorings()
//     // console.log(listAll)
//     // const listMentoringsForEmail = await jorge.listMentoringsByMentor('Space')
//     // console.log(listMentoringsForEmail)
//     // const listMentoringByArea = await jorge.listMentoringByArea('UX')
//     // console.log(listMentoringByArea)
//     // const mentoringMarked = await jorge.markMentoring({
//     //     mentor:'jorge@testUpdate.com', 
//     //     team:'5ec724d4ab3cff35a4b6513c', 
//     //     area:'UX', 
//     //     date: new Date('2020-05-30')
//     // })
//     // console.log(mentoringMarked)
//     // const myTeam = await jorge.viewMyTeam()
//     // console.log(myTeam)
//     const myMentoring = await jorge.listMentoringMyTeam()
//     console.log(myMentoring)
// }
// run()
