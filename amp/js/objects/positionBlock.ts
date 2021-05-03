import * as caller from "./caller.js";
import * as pos from "./position.js";
export class PositionBlock{
    id: number;
    name: string;
    columnId: number;
    positions: pos.Position[];
    constructor(id: number, name: string, columnId:number, positions?: pos.Position[]){
        this.id = id;
        this.name = name;
        this.columnId = columnId;
        this.positions = positions;
    }
}

export async function updateBlock(block: PositionBlock): Promise<Boolean>{
    let data = {
        positionBlock: block
    }
    let response = await caller.POSTAsynch("../amp/includes/requests/updateblock.php", data);
    return caller.IsSuccessful(response);
}

export async function selectByColumn(columnId: number){
    let data = {
        columnId: columnId
    }
    let response = await caller.POSTAsynch("../amp/includes/requests/selectpositionblockbycolumn.php", data);
    try{
        return parseArray(response);
    }catch(err){
        console.log(err);
        console.log(response);
        return [];
    }
}

function parseArray(json: string){
    let pos_array: PositionBlock[]=[];
    for (let positionBlock of JSON.parse(json).positionBlocks) {
        let block = new PositionBlock(positionBlock.id, positionBlock.name, positionBlock.columnId, pos.parseArray(positionBlock.positions));
        pos_array.push(block);
    }
    return pos_array;
}