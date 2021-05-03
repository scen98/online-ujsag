import * as caller from "./caller.js";
export class Token{
    id: number;
    name: string;
    status: number;
    columnId: number;

    constructor(id: number, name?: string, status?: number, columnId?: number){
        this.id = id;
        this.name = name;
        this.status = status;
        this.columnId = columnId;
    }

    async insert(){
        let response = await caller.POSTAsynch("../amp/includes/requests/inserttoken.php", this);
        this.id = JSON.parse(response).newId;
    }

    async update(): Promise<Boolean>{
        let response = await caller.POSTAsynch("../amp/includes/requests/updatetoken.php", this);
        return caller.IsSuccessful(response);
    }

    async delete(): Promise<Boolean>{
        let response = await caller.POSTAsynch("../amp/includes/requests/deletetoken.php", this);
        return caller.IsSuccessful(response);
    }
}
export async function selectTokensByColumn(columnId: number): Promise<Token[]>{
    let data = {
        columnId: columnId
    }
    let response = await caller.POSTAsynch("../amp/includes/requests/selecttokensbycolumn.php", data);
    try{
        return constrFromJSON(response);
    }catch(err){
        console.log(err);
        console.log(response);
        return [];
    }
}

export async function selectActiveTokensByColumn(columnId: number): Promise<Token[]>{
    let data = {
        columnId: columnId
    }
    let response = await caller.POSTAsynch("../amp/includes/requests/selectactivetokensbycolumn.php", data);
    try{
        return constrFromJSON(response);
    }catch(err){
        console.log(err);
        console.log(response);
        return [];
    }
}

export async function selectAccessibleTokens(): Promise<Token[]>{
    let response = await caller.GETAsynch("../amp/includes/requests/selectaccessibletokens.php");
    try{
        return constrFromJSON(response);
    }catch(err){
        console.log(err);
        console.log(response);
        return [];
    }
}

function constrFromJSON(json: string){
    let data = JSON.parse(json).tokens;
    let tokenArray: Token[] = [];
    for (let t of data) {
        tokenArray.push(new Token(t.id, t.name, t.status, t.columnId));
    }
    return tokenArray;
}

export function getMyTokenPermissions(func: any){ //ez szerintem már nem kell de még itt hagyom
    let f = (response: string)=>{
        func(JSON.parse(response).tokenPermissions);
    }
    caller.GET("../amp/includes/gettokenpermissions.php", f);
}