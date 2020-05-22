import * as dotenv from 'dotenv'
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

export type MarkMentoring = {
    mentorEmail?:string 
    teamId?:string 
    area:string 
    date:Date
    mentor?:string
    team?:string
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

    public async mark(item:MarkMentoring){
        const method:object = {
            method:'POST',
            body: JSON.stringify(item),
            headers: {'Content-Type': 'application/json'}
        }

        const response = await fetch(this.url_server +'/mentorings', method)
        const marked = await response.json()

        console.log(marked)

    }

}

const mentoring = new Mentoring()

async function run(){
   const list =  await mentoring.listAll()
   const listForArea:any = await mentoring.listForArea('UX')
   const listForMentor:any = await mentoring.listForMentor('Jorge')
   const marked = await mentoring.mark({
        mentor:'jorge@testUpdate.com', 
        team:'5ec724d4ab3cff35a4b6513c', 
        area:'Buss', 
        date: new Date('2020-05-30')
   })
   console.log(marked)
}

run()