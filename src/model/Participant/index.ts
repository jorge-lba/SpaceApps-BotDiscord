class Participant {
    // private url_database = process.e

    constructor(
        protected _name:string,
        protected _email:string,
        public discordName?:string,
        public discordUserId?:number,
        public cellPhone?:string,
        public team?:string
        
    ){
        
    }

    get name():string{ return this._name }
    get email():string{ return this._email }

    public crateTeam(name:string):object{

        return{
            name
        }
    }
    
}

const user = new Participant('jorge','test@test.com')

console.log(user.name, user.email, user.team)
