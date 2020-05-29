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
const array_to_google_sheets_1 = require("array-to-google-sheets");
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
    sheetListAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const googleSheets = new array_to_google_sheets_1.ArrayToGoogleSheets({ keyFilename: "./credentials.json" });
            const spreadsheet = yield googleSheets.getSpreadsheet(String(process.env.SHEET_ID));
            const sheet = yield spreadsheet.findSheet("mentorias");
            const values = yield sheet.getValues();
            const listAll = values.filter((mentoring) => ({
                mentoringId: mentoring[0],
                mentorName: mentoring[1],
                mentorEmail: mentoring[2],
                area: mentoring[3],
                date: mentoring[4],
                hous: mentoring[5],
                state: mentoring[6]
            }));
            const list = listAll.filter((mentoring) => mentoring[6] === 'open');
            return {
                listAll: list,
                sheet
            };
        });
    }
    sheetListByArea(area) {
        return __awaiter(this, void 0, void 0, function* () {
            const { listAll, sheet } = yield this.sheetListAll();
            const list = listAll.filter((mentoring) => mentoring[3] === area);
            return list;
        });
    }
    sheetListByMentor(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const { listAll, sheet } = yield this.sheetListAll();
            const list = listAll.filter((mentoring) => mentoring[1] === name);
            return list;
        });
    }
    sheetListById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { listAll, sheet } = yield this.sheetListAll();
            const list = listAll.find((mentoring) => mentoring[0] === id);
            return list;
        });
    }
    sheetMark(item, id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const { listAll, sheet } = yield this.sheetListAll();
            const method = {
                method: 'POST',
                body: JSON.stringify(item),
                headers: { 'Content-Type': 'application/json' }
            };
            const response = yield fetch(this.url_server + '/mentorings', method);
            const marked = yield response.json();
            sheet.updateCell(id, 6, 'marked');
            sheet.updateCell(id, 7, item.team);
            sheet.updateCell(id, 8, name);
            const mentoring = yield listAll.find((mentoring) => mentoring[0] === id);
            if (mentoring) {
                mentoring[2] = 'marked';
                return marked;
            }
            else {
                return marked;
            }
        });
    }
}
exports.Mentoring = Mentoring;
// const mentoring = new Mentoring()
// async function run(){
// //    const list =  await mentoring.listAll()
// //    const listForArea:any = await mentoring.listForArea('UX')
// //    const listForMentor:any = await mentoring.listForMentor('Jorge')
// //    const marked = await mentoring.mark({
// //         mentor:'jorge@testUpdate.com', 
// //         team:'5ec724d4ab3cff35a4b6513c', 
// //         area:'Buss', 
// //         date: new Date('2020-05-30')
// //    })
//     const list = await mentoring.sheetListById(11)
//    console.log(list)
// }
// run()
