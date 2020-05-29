import * as dotenv from 'dotenv'
import {ArrayToGoogleSheets, IUpdateOptions} from "array-to-google-sheets"; 
import { Sheet } from "array-to-google-sheets/build/Sheet"; 

const fetch = require('node-fetch')

dotenv.config()

export type Mentor = {
    areas:string[]
    name:string
    email:string
    cellPhone:string
    mentoringSchedule:{}[]
    discordUserId:number
    _id:string
}

export type TypeMarkMentoring = {
    mentorEmail?:string 
    teamId?:string 
    area:string 
    date:Date
    mentor:string
    team:string
}

export type TypeMentoring = {
    mentor:string
    teamId:string
    date:Date
    area:string
    state?:string
    feedback?:string
}

export class Mentoring{
    private url_server:string = String(process.env.URL_SERVER_DATABASE)
    private pathMentors:string = '/mentors'    
    
    public async listAll(){
        const response = await fetch(this.url_server+this.pathMentors)
        const {message, userList} = await response.json()

        const mentors = userList.reduce((current:{}[], next:Mentor) => {
            
            if(next.mentoringSchedule[0]){
                current.push({
                    name: next.name,
                    email: next.email,
                    areas: next.areas,
                    id: next._id,
                    mentorings: next.mentoringSchedule
               })
            }

           return current
        }, [] )
        
        let list:object[] = []

        mentors.forEach( (mentor:any) => {
            mentor.mentorings.map((mentoring:any) => list.push({
                mentorName: mentor.name,
                mentorEmail: mentor.email,
                mentorId: mentor.id,
                area:mentoring.area,
                dates:mentoring.dates,
           }))
        } )
        
        return list
    }

    public async listForArea(area:string){
        const mentorings = await this.listAll()
        const response = mentorings.filter((mentor:any) => mentor.area === area)
        
        return response
    }

    public async listForMentor(name:string){
        const mentorings = await this.listAll()
        const response = mentorings.filter((mentor:any) => mentor.mentorName === name)
        
        return response
    }

    public async mark(item:TypeMarkMentoring){
        const method:object = {
            method:'POST',
            body: JSON.stringify(item),
            headers: {'Content-Type': 'application/json'}
        }

        const response = await fetch(this.url_server +'/mentorings', method)
        const marked = await response.json()

        return marked

    }

    public async sheetListAll():Promise<{listAll:[], sheet:Sheet }>{
        console.log(__dirname)
        const googleSheets = new ArrayToGoogleSheets({keyFilename: "../assets/credentials.json"});
        const spreadsheet = await googleSheets.getSpreadsheet(String(process.env.SHEET_ID));
        const sheet:any = await spreadsheet.findSheet("mentorias")
        const values = await sheet.getValues()

        const listAll =  values.filter( (mentoring:any) => ({
            mentoringId:  mentoring[0],
            mentorName: mentoring[1],
            mentorEmail:  mentoring[2],
            area: mentoring[3],
            date: mentoring[4],
            hous:mentoring[5],
            state:mentoring[6]
        }))

        const list = listAll.filter((mentoring:any) => mentoring[6] === 'open')

        return {
            listAll:list,
            sheet
        }
    }

    public async sheetListByArea(area:string){
        const {listAll, sheet} = await this.sheetListAll()
        const list =  listAll.filter((mentoring:any) => mentoring[3] === area)
        return list
    }

    public async sheetListByMentor(name:string){
        const {listAll, sheet} = await this.sheetListAll()
        const list =  listAll.filter((mentoring:any) => mentoring[1] === name)
        return list
    }

    public async sheetListById(id:number){
        const {listAll, sheet} = await this.sheetListAll()
        const list =  listAll.find((mentoring:any) => mentoring[0] === id)
        return list
    }

    public async sheetMark(item:TypeMarkMentoring, id:number, name:string){
        const {listAll, sheet} = await this.sheetListAll()
        const method:object = {
            method:'POST',
            body: JSON.stringify(item),
            headers: {'Content-Type': 'application/json'}
        }
        
        const response = await fetch(this.url_server +'/mentorings', method)
        const marked = await response.json()

        sheet.updateCell(id,6,'marked')
        sheet.updateCell(id,7,item.team)
        sheet.updateCell(id,8,name)


        const mentoring:any = await listAll.find((mentoring:any) => mentoring[0] === id)
        if(mentoring){
            mentoring[2] = 'marked'
            return marked
        }else{
            return marked
        }
    }

}

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