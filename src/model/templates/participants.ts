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

    public async validateEmail(email:string){
        const participants:any = await this.listParticipants()

        let testResult:string = participants.find((participant:any) => participant.email === email)
        if(testResult) return 'participant'

        const mentors:any = await this.listMentors()

        testResult = mentors.find( (mentor:any) => mentor.email === email )
        if(testResult) return 'mentor'

        return 'unregistered user'
    }

    public async validateDiscordUser(id:number){
        const participants:any = await this.listParticipants()

        let testResult = participants.find((participant:any) => participant.discordUserId === id)
        if(testResult) return {...testResult, type: 'participant' }

        const mentors:any = await this.listMentors()

        testResult = mentors.find( (mentor:any) => mentor.discordUserId === id  )
        if(testResult) return {...testResult, type: 'mentor' }

        return {error:'unregistered user'}
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