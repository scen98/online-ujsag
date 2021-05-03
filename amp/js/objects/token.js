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
export class Token {
    constructor(id, name, status, columnId) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.columnId = columnId;
    }
    insert() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield caller.POSTAsynch("../amp/includes/requests/inserttoken.php", this);
            this.id = JSON.parse(response).newId;
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield caller.POSTAsynch("../amp/includes/requests/updatetoken.php", this);
            return caller.IsSuccessful(response);
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield caller.POSTAsynch("../amp/includes/requests/deletetoken.php", this);
            return caller.IsSuccessful(response);
        });
    }
}
export function selectTokensByColumn(columnId) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            columnId: columnId
        };
        let response = yield caller.POSTAsynch("../amp/includes/requests/selecttokensbycolumn.php", data);
        try {
            return constrFromJSON(response);
        }
        catch (err) {
            console.log(err);
            console.log(response);
            return [];
        }
    });
}
export function selectActiveTokensByColumn(columnId) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            columnId: columnId
        };
        let response = yield caller.POSTAsynch("../amp/includes/requests/selectactivetokensbycolumn.php", data);
        try {
            return constrFromJSON(response);
        }
        catch (err) {
            console.log(err);
            console.log(response);
            return [];
        }
    });
}
export function selectAccessibleTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield caller.GETAsynch("../amp/includes/requests/selectaccessibletokens.php");
        try {
            return constrFromJSON(response);
        }
        catch (err) {
            console.log(err);
            console.log(response);
            return [];
        }
    });
}
function constrFromJSON(json) {
    let data = JSON.parse(json).tokens;
    let tokenArray = [];
    for (let t of data) {
        tokenArray.push(new Token(t.id, t.name, t.status, t.columnId));
    }
    return tokenArray;
}
export function getMyTokenPermissions(func) {
    let f = (response) => {
        func(JSON.parse(response).tokenPermissions);
    };
    caller.GET("../amp/includes/gettokenpermissions.php", f);
}
//# sourceMappingURL=token.js.map