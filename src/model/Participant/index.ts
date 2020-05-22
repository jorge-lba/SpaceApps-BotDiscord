import * as dotenv from 'dotenv'

dotenv.config()

import Team from './templates/team'
class Participant {
    constructor(
        public name:string,
        public email:string,
        public teamName?:string,
        public teamId?:string
    ){ }

    private team = new Team(this.email, this.teamId, this.teamName)
    
    public createTeam = async (name:string):Promise<object> => await this.team.create(name)
    public addMemberMyTeam = async (email:string, name?:string):Promise<object>  => await this.team.addMember(email, name)
    public removeMemberMyTeam = async (email:string, name?:string):Promise<object>  => await this.team.removeMember(email, name)
    
}

const jorge = new Participant('jorge', 'j@j.com')

async function run(){
    await jorge.createTeam('SpaceApps2')
    const memberAdd = await jorge.addMemberMyTeam('jorge@test.com')
//    const memberRM = await jorge.removeMemberMyTeam('jorge@test.com')
    console.log(memberAdd)
//    console.log(memberRM)
}
run()