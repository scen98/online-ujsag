import * as caller from "./caller.js";
export class Position{
    id: number;
    name: string;
    htmlId: string;
    articleId: number;
    constructor(id: number, name: string, htmlId: string, articleId:number){
        this.id = id;
        this.name = name;
        this.htmlId = htmlId;
        this.articleId = articleId;
    }
}

export async function updatePositions(positions: Position[]): Promise<Boolean>{
    let response = await caller.POSTAsynch("../amp/includes/requests/updatepositions.php", positions);
    return caller.IsSuccessful(response);
}

export async function selectByBlock(func: (positions: Position[])=>void, blockId: number){
    let f = (response:string)=>{
        func(parseArray(JSON.parse(response).positions));
    }
    let data = {
        blockId: blockId
    }
    let response = await caller.POSTAsynch("../amp/includes/requests/selectpositionbyblock.php", data);
    return parseArray(JSON.parse(response).positions);
}

export function parseArray(raw): Position[]{
    let pos_array: Position[] = [];
    for (let pos of raw) {
        let position = new Position(pos.id, pos.name, pos.htmlId, pos.articleId);
        pos_array.push(position);
    }
    return pos_array;
}