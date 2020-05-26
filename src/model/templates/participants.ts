import * as dotenv from 'dotenv'
const fetch = require('node-fetch')

dotenv.config()

export class Participants {
    private url_server:string = String(process.env.URL_SERVER_DATABASE)
    private pathParticipants:string = '/users'
    private pathMentors:string = '/mentors'

    public async listParticipants(){
        const response = await fetch(this.url_server+this.pathParticipants)
        const {message, userList} = await response.json()

        return userList
    }

    public async listMentors(){
        const response = await fetch(this.url_server+this.pathMentors)
        const {message, userList} = await response.json()

        return userList
    }

    public async updateParticiant(user:any, id:any ){
        const method:object = {
            method:'PUT',
            body: JSON.stringify({
                cellPhone: user.cellPhone,
                discordName: user.discordName,
                discordUserId: user.discordUserId,
                team: user.team,
                type: user.type
            }),
            headers: {'Content-Type': 'application/json'}
        }

        let path:string
        if(user.type === 'participant'){
            path = this.pathParticipants
        }else{
            path = this.pathMentors
        }

        const response = await fetch(this.url_server+ path +'/' + id, method)
        const resp = await response.json()

        return resp
    }

    public async validateEmail(email:string){
        const participants:any = await this.listParticipants()

        let testResult:any = participants.find((participant:any) => participant.email === email)
        if(testResult) return {...testResult ,type:'participant'}

        const mentors:any = await this.listMentors()

        testResult = mentors.find( (mentor:any) => mentor.email === email )
        if(testResult) return {...testResult ,type:'mentor'}

        return {error:'unregistered user',type:'unregistered user'}
    }

    public async validateDiscordUser(id:number){
        const participants:any = await this.listParticipants()

        let testResult = participants.find((participant:any) => participant.discordUserId === id)
        if(testResult) return {...testResult, type: 'participant' }

        const mentors:any = await this.listMentors()

        testResult = mentors.find( (mentor:any) => mentor.discordUserId === id  )
        if(testResult) return {...testResult, type: 'mentor' }

        return {error:'unregistered user', type:'unregistered user'}
    }

}

// const user = new Participants()

// async function run(){
    
//     const participants = await user.listParticipants()
//     const mentors = await user.listMentors()
//     const participant = await user.validateEmail('mentor@space.com')
//     const discord = await user.validateDiscordUser(23)

//     console.log(discord)
// }

// run()