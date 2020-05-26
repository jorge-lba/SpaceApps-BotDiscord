import * as dotenv from 'dotenv'
const fetch = require('node-fetch')

dotenv.config()

export class Team {
    private url_server:string = String(process.env.URL_SERVER_DATABASE)
    private path:string = '/teams'

    constructor(
        private _userEmail:string,
        public teamId?:string,
        public teamName?:string
    ){
        
    }

    public async list():Promise<{message:string, teamList:{name:string, members:string[], scheduledMentoring:{}[], _id:string}[]}>{
        const response = await fetch(this.url_server+this.path)
        const {message, teamList} = await response.json()
        return{
            message,
            teamList
        }
    }
    
    public async setTeam(name?:string):Promise<void>{
        
        const {message, teamList} = await this.list()
        const [team] = teamList.filter((item:any) => item.name === name)
        this.teamId = team._id
        this.teamName = team.name
    
    }

    public async selectOne(teamId = this.teamId):Promise<object>{
        await this.setTeam(this.teamName)
        const response = await fetch(this.url_server+this.path+'/'+(this.teamId || teamId) )
        const {message, team} = await response.json()
        return{
            message,
            team
        }
    }

    public async create(name:string):Promise<{message:string, team:any, error?:any}>{
        const method:object = {
            method:'POST',
            body: JSON.stringify({
                name,
                members:[this._userEmail]
            }),
            headers: {'Content-Type': 'application/json'}
        }
        
        
        const response = await fetch(this.url_server+this.path, method )
        const {message, team, error} = await response.json() 
        await this.setTeam(name)

        return{
            message,
            team,
            error
        }
    }

    public async addMember(email:string = this._userEmail, name?:string):Promise<object>{        
        const {message, teamList} = await this.list()
        const [team] = teamList.filter((item:any) => item.name === this.teamName|| name )
        
        team.members.push(email)
        const method:object = {
            method:'PUT',
            body: JSON.stringify(team),
            headers: {'Content-Type': 'application/json'}
        }

        const response = await fetch(this.url_server+this.path+'/'+team._id, method)
        const update = await response.json()

        return{
            ...update
        }
    }

    public async removeMember(email:string = this._userEmail, name?:string):Promise<object>{

        const {message, teamList} = await this.list()
        const [team] = teamList.filter((item:any) => item.name === this.teamName || name)

        team.members = team.members.filter(item => item !== email)

        const method:object = {
            method:'PUT',
            body: JSON.stringify(team),
            headers: {'Content-Type': 'application/json'}
        }

        const response = await fetch(this.url_server+this.path+'/'+team._id, method)
        const update = await response.json()

        return{
            ...update
        }

    }

    public async addMentoring(mentoring:string, teamName:string):Promise<object>{
        const {message, teamList} = await this.list()
        const [team] = teamList.filter((item:any) => item.name === teamName)
        console.log(team)

        team.scheduledMentoring.push(mentoring)

        const method:object = {
            method:'PUT',
            body: JSON.stringify(team),
            headers: {'Content-Type': 'application/json'}
        }

        const response = await fetch(this.url_server+this.path+'/'+team._id, method)
        const update = await response.json()

        return{
            ...update
        }
    }

}


// const team = new Team('jorge@teste.com', '5ec5c950be80b23f639df6b4')

// async function run(){
//     // const teamCreate = await team.create('SpaceApps')

//     // const login = await team.addMember('Space')
//     // console.log(login)
    
//     // const leave = await team.removeMember('Space', 'v1fd86v41d65g4wsvf1dxc6v5d4g')
//     // console.log(leave)

//     // const list = await team.selectOne()
//     // console.log(list)

//     // const mentoring = await team.addMentoring('Space','v1fd86v41d65g4wsvf1dxc6v5d4g')
//     // console.log(mentoring)

// }
// run()
