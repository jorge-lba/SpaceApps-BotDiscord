import * as dotenv from 'dotenv'

dotenv.config()

import {Team} from '../templates/team'
import { Mentoring, TypeMarkMentoring } from '../templates/mentoring'

export class Participant {
    constructor(
        private name:string,
        private email:string,
        private teamName:string = '',
        private _teamId:string = ''
    ){
        console.log(teamName) 
    }

    private team = new Team(this.email, this._teamId, this.teamName)
    private mentorings = new Mentoring()

    get teamId(){return this._teamId}
    
    public createTeam = async (nameTeam:string ):Promise<{message:string, team:any, error?:any}> => await this.team.create(nameTeam)
    public addMemberMyTeam = async (email:string, team:string):Promise<object>  => await this.team.addMember(email, team ||this.teamName)
    public removeMemberMyTeam = async (email:string):Promise<object>  => await this.team.removeMember(email, this.teamName)
    public addMentoringTeam = async (mentoring:any):Promise<object> => await this.team.addMentoring(mentoring, this.teamName)
    public viewMyTeam = async ():Promise<object> => await this.team.selectOne()

    public listAllMentorings = async () => this.mentorings.listAll()
    public listMentoringsByMentor = async (name:string) => this.mentorings.listForMentor(name)
    public listMentoringByArea = async (arae:string) => this.mentorings.listForArea(arae)
    public markMentoring = async (item:TypeMarkMentoring) => {
        const marked = await this.mentorings.mark({...item, team:this.teamName})
        await this.addMentoringTeam(marked.mentoring._id)
        return marked
    }
    public listMentoringMyTeam = async () => {
        const response:any  = await this.viewMyTeam()
        return response.scheduledMentoring
    }
    
}

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