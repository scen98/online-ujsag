var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as caller from "./caller.js";
export class Column {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
export function getColumns() {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield caller.GETAsynch("../amp/includes/requests/getcolumns.php");
        return constrFromJSON(response);
    });
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
function constrFromJSON(json) {
    let data = JSON.parse(json).columns;
    let columnArray = [];
    for (let col of data) {
        columnArray.push(new Column(col.id, col.name));
    }
    return columnArray;
}
//# sourceMappingURL=column.js.map