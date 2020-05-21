import * as dotenv from 'dotenv'
const fetch = require('node-fetch')

dotenv.config()

class Team {
    constructor(
        public userId:string,
        public teamId?:string
    ){

    }
    private url_server:string = String(process.env.URL_SERVER_DATABASE)
    private path:string = '/teams'

    private async list():Promise<{message:string, teamList:{name:string, members:string[], scheduledMentoring:string[], _id:string}[]}>{
        const response = await fetch(this.url_server+this.path)
        const {message, teamList} = await response.json()
        return{
            message,
            teamList
        }
    }

    public async myTeam():Promise<object>{
        const response = await fetch(this.url_server+this.path+'/'+this.teamId)
        const {message, team} = await response.json()
        return{
            message,
            ...team
        }
    }

    public async create(name:string):Promise<object>{
        const method:object = {
            method:'POST',
            body: JSON.stringify({
                name,
                members:[this.userId]
            }),
            headers: {'Content-Type': 'application/json'}
        }

        const response = await fetch(this.url_server+this.path, method )
        const {message, team, error} = await response.json() 
        console.log(team)
        return{
            message,
            team
        }
    }

    public async login(name:string):Promise<object>{        
        const {message, teamList} = await this.list()
        const [team] = teamList.filter((item:any) => item.name === name)
        
        team.members.push(this.userId)
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

const team = new Team('5ec404ec66c47013d7605583', '5ec5c950be80b23f639df6b4')

async function run(){
    // const teamCreate = await team.create('SpaceApps')
    // const login = await team.login('Space')
    const list = await team.myTeam()


    console.log(list)
    // console.log(login)
}
run()
