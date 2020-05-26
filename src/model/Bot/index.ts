import { Participants } from "../templates/participants";
import { Mentoring } from "../templates/mentoring";
import { Participant } from "../Participant";

import { format, parseISO, subHours } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'

type dataParticipant = {
    discordUserId:number
    discordName:string
    teamName?:string
}

export class Bot{

    private participants = new Participants
    private mentorings = new Mentoring

    public discordName:string
    public discordUserId:number
    public teamName?:string

    constructor(
        private dataUser:dataParticipant,
        private message:string
    ){
        this.discordName = dataUser.discordName
        this.discordUserId = dataUser.discordUserId
        this.teamName = dataUser.teamName
    }

    public options = {
        createTeam:{
            comand: 'criartime',
            response: 'Time ## foi criado.',
            error:'Você não pode criar um time em quanto for membro de outro time.'
        },
        team:{
            comand: 'time',
            response: `Time: ##
            Membros: @@
            Mentorias Agendadas: !!`,
            error:'Você não está em nenhum time no momento.'
        },
        listmentoring:{
            comand:{
                all: 'listarmentorias',
                area: 'listarmentorias-area',
                mentor: 'listarmentorias-mentor'
            },
            response: '@@ - ## - !!'
        },
        markMentoring:{
            comando:'marcarmentoria',
            response:'Mentoria de @@ com ## dia !! foi marcada com sucesso!'
        }
    }

    private async validateUserByDiscordId(){
        return await this.participants.validateDiscordUser(this.dataUser.discordUserId)
    }

    private filterComand(message:string){
        let [comand, text] = message.replace(':',';').split(';')
        comand = comand.toLowerCase().replace(/ /gm,'')
        if(text) text = text.replace(/(^\s+|\s+$)/g, '')
        
        return { comand, text }
    }

    private async createTeam(user:any, teamName:string):Promise<string>{
        if(user.team){
            return this.options.createTeam.error
        }else{
            const participant = new Participant(user.name, user.email, teamName)
            const {message, team, error} = await participant.createTeam(teamName)
            if(error) return message
            const response = this.options.createTeam.response.replace('##', team.name)

            return response
        }
    }

    private async myTeam(user:any){
        if(user.team){
            const participant = new Participant(user.name, user.email, user.team)
            const resp:any = await participant.viewMyTeam()

            const response = this.options.team.response
                .replace('##', resp.team.name)
                .replace('@@', resp.team.members)
                .replace('!!', ( resp.team.scheduledMentoring[0] ? resp.team.scheduledMentoring : '---'))

            return response
        }else{
            return this.options.team.error
        }
    }
    
    public async listMentoringAll(){
        const mentorings = await this.mentorings.listAll()
        let response:string =''
        
        mentorings.forEach((mentoring:any) => {
            mentoring.dates.forEach((date:any) => {
                const dateformat = parseISO(date.date)
                const dataFormated = format(zonedTimeToUtc(dateformat, 'America/Sao_Paulo'), "dd/MM/yyyy 'ás' HH:mm")

                if(date.state === 'Open')
                    response+=`\n${mentoring.mentorName} - ${mentoring.area} - ${dataFormated} - ${date.state}`
            })
        })

        return response
    }


    public async listMentoringByMentor(mentorName:string){
        const mentorings = await this.mentorings.listForMentor(mentorName)
        let response:string = ''

        mentorings.forEach((mentoring:any) => {
            mentoring.dates.forEach((date:any) => {
                const dateformat = parseISO(date.date)
                const dataFormated = format(zonedTimeToUtc(dateformat, 'America/Sao_Paulo'), "dd/MM/yyyy 'ás' HH:mm")

                if(date.state === 'Open')
                    response+=`\n${mentoring.mentorName} - ${mentoring.area} - ${dataFormated} - ${date.state}`
            })
        })

        return response
    }

    public async listMentoringByArea(area:string){
        const mentorings = await this.mentorings.listForArea(area)
        let response:string =''
        
        mentorings.forEach((mentoring:any) => {
            mentoring.dates.forEach((date:any) => {
                const dateformat = parseISO(date.date)
                const dataFormated = format(zonedTimeToUtc(dateformat, 'America/Sao_Paulo'), "dd/MM/yyyy 'ás' HH:mm")

                if(date.state === 'Open')
                    response+=`\n${mentoring.mentorName} - ${mentoring.area} - ${dataFormated} - ${date.state}`
            })
        })

        return response
    }

    public async markMentoring(user:any, mentoring:string){
        const [mentorName, area, dateHours, state] = mentoring.replace(/ /gm,'').split('-')
        if(state !== 'Open')return 'Mentoria não está disponivel.'

        const [date, hours] = dateHours.replace('ás', 'as').split('as')
        const [hour, minute] = hours.split(':')
        const [day, month, year] = date.split('/')

        const dateNew = parseISO(`${year}-${month}-${day} ${hours}`)
        const dateEnd = subHours(dateNew,3) //subHours(dateNew, 3)

        let response:string = ''
        let mentoringObj:any = {}
        const mentorings:any = await this.mentorings.listForMentor(mentorName)

        mentorings.forEach((mentoring:any) => {
            if(mentoring.area === area)
                mentoring.dates.forEach((date:any) => {
                    if(new Date(date.date).getTime() === dateNew.getTime() && date.state === 'Open'){
                        mentoringObj = {
                            mentor: mentoring.mentorName,
                            area: mentoring.area,
                            ...date
                        }
                        response = 'Mentoria marcada com sucesso!'
                    }
                })
        })
        if(response !== 'Mentoria marcada com sucesso!')return 'Não foi possivel marcar essa mentoria, tente novamente.'
        
        const participant = new Participant(user.name, user.email, user.team) 
    
        const res = await participant.markMentoring(mentoringObj)

        return response
    }

    public async run(){
        const user = await this.validateUserByDiscordId()
        let response:string =''

        if(user.type === 'participant'){
            const message = this.filterComand(this.message)

            switch(message.comand){
                case this.options.createTeam.comand:
                    response = await this.createTeam(user, message.text)
                break
                case this.options.team.comand:
                    response = await this.myTeam(user)
                break
                case this.options.listmentoring.comand.all:
                    response = await this.listMentoringAll()
                break
                case this.options.listmentoring.comand.mentor:
                    response = await this.listMentoringByMentor(message.text)
                break
                case this.options.listmentoring.comand.area:
                    response = await this.listMentoringByArea(message.text)
                break
                case this.options.markMentoring.comando:
                    response = await this.markMentoring(user, message.text)
                break
                default:
                    response = 'Este comandto não é valido.'
                break
            }
            
        }else if(user.type === 'mentor'){
            return 'mentor'
        }else{
            if(!this.isEmail()){
                const userIsRegistered:any = await this.participants.validateEmail(this.message)
                if(userIsRegistered.error){
                    return 'Envie seu e-mail de cadastro.'
                }else if(userIsRegistered.type === 'mentor'){

                }else if(userIsRegistered.type === 'participant'){

                }
            }

        }
        return response

    }

    public isEmail(email:string = this.message){
        const reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
        if (!reg.test(email)) {
            return false
        }
        return true
    }


    // private async routeParticipant(message:string){

    // }

}


// async function run(){
    
//     const bot = new Bot({
//         discordUserId:33, 
//         discordName:'Addae', 
//     }, //'time')
//     'marcar mentoria: Jorge - Pitch - 29/05/2020 ás 20:00 - Open')

//     const response = await bot.run()

//     console.log(response)
// }

// run()
