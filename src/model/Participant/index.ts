import * as dotenv from 'dotenv'

dotenv.config()

import {Team} from './templates/team'
class Participant {
    constructor(
        private name:string,
        private email:string,
        private teamName:string = '',
        private teamId:string = ''
    ){ 
    }

    private team = new Team(this.email, this.teamId, this.teamName)
    
    public createTeam = async (nameTeam:string ):Promise<object> => await this.team.create(nameTeam)
    public addMemberMyTeam = async (email:string):Promise<object>  => await this.team.addMember(email, this.teamName)
    public removeMemberMyTeam = async (email:string):Promise<object>  => await this.team.removeMember(email, this.teamName)
    public addMentoring = async (mentoringId:string):Promise<object> => await this.team.addMentoring(mentoringId, this.teamName)
    
}

const jorge = new Participant('jorge', 'j@j.com','SpaceApps2')

async function run(){
    // await jorge.createTeam('SpaceApps2')
    // const memberAdd = await jorge.addMemberMyTeam('jorge@test.com')
//    const memberRM = await jorge.removeMemberMyTeam('jorge@test.com')
    // console.log(memberAdd)
//    console.log(memberRM)
    // const addMentoring = await jorge.addMentoring('sdsafsdfvcdfvdfds')
    // console.log(addMentoring)
        
}
run()