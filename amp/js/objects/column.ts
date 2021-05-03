import * as caller from "./caller.js";
export class Column{
    id: number;
    name: string;
    constructor(id: number, name: string){
        this.id = id;
        this.name = name;
    }   
}

export async function getColumns(): Promise<Column[]>{
    let response = await caller.GETAsynch("../amp/includes/requests/getcolumns.php");
    return constrFromJSON(response);
}
/*
export function selectAcccessibleColumns(func: (columns: Column[])=>void){ //azt se tudom hogy ez a cucc kell-e még de nem merem kitörölni mert egyszer talán hátha igen
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        try{
            func(constrFromJSON(this.responseText));
        }catch(err) {
            console.log(err.message);
        }
    };    
    xhttp.open("GET", "../amp/includes/requests/selectaccessiblecolumns.php", true);
    xhttp.send();    
}
*/
function constrFromJSON(json): Column[]{
    let data = JSON.parse(json).columns;
    let columnArray: Column[] = [];
    for (let col of data) {
        columnArray.push(new Column(col.id, col.name));
    }
    return columnArray;
}

