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
exports.Mentoring = void 0;
const dotenv = __importStar(require("dotenv"));
const fetch = require('node-fetch');
dotenv.config();
class Mentoring {
    constructor() {
        this.url_server = String(process.env.URL_SERVER_DATABASE);
        this.pathMentors = '/mentors';
    }
    listAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.url_server + this.pathMentors);
            const { message, userList } = yield response.json();
            const mentors = userList.reduce((current, next) => {
                if (next.mentoringSchedule[0]) {
                    current.push({
                        name: next.name,
                        email: next.email,
                        areas: next.areas,
                        id: next._id,
                        mentorings: next.mentoringSchedule
                    });
                }
                return current;
            }, []);
            let list = [];
            mentors.forEach((mentor) => {
                mentor.mentorings.map((mentoring) => list.push({
                    mentorName: mentor.name,
                    mentorEmail: mentor.email,
                    mentorId: mentor.id,
                    area: mentoring.area,
                    dates: mentoring.dates,
                }));
            });
            return list;
        });
    }
    listForArea(area) {
        return __awaiter(this, void 0, void 0, function* () {
            const mentorings = yield this.listAll();
            const response = mentorings.filter((mentor) => mentor.area === area);
            return response;
        });
    }
    listForMentor(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const mentorings = yield this.listAll();
            const response = mentorings.filter((mentor) => mentor.mentorName === name);
            return response;
        });
    }
    mark(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const method = {
                method: 'POST',
                body: JSON.stringify(item),
                headers: { 'Content-Type': 'application/json' }
            };
            const response = yield fetch(this.url_server + '/mentorings', method);
            const marked = yield response.json();
            return marked;
        });
    }
}
exports.Mentoring = Mentoring;
// const mentoring = new Mentoring()
// async function run(){
//    const list =  await mentoring.listAll()
//    const listForArea:any = await mentoring.listForArea('UX')
//    const listForMentor:any = await mentoring.listForMentor('Jorge')
//    const marked = await mentoring.mark({
//         mentor:'jorge@testUpdate.com', 
//         team:'5ec724d4ab3cff35a4b6513c', 
//         area:'Buss', 
//         date: new Date('2020-05-30')
//    })
//    console.log(marked)
// }
// run()
