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
export class Permission {
    constructor(id, level, authorId, columnId) {
        this.id = id;
        this.level = level;
        this.authorId = authorId;
        this.columnId = columnId;
    }
    insert() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield caller.POSTAsynch("../amp/includes/requests/insertpermission.php", this);
            this.id = JSON.parse(response).newId;
        });
    }
    change() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield caller.POSTAsynch("../amp/includes/requests/changepermissiontype.php", this);
            this.id = JSON.parse(response).newId;
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                id: this.id
            };
            let response = yield caller.POSTAsynch("../amp/includes/requests/deletepermission.php", data);
            if (JSON.parse(response).msg === "success") {
                return true;
            }
            return false;
        });
    }
}
export function deletePermission(permission) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            id: permission.id,
            columnId: permission.columnId,
            authorId: permission.authorId
        };
        let response = yield caller.POSTAsynch("../amp/includes/requests/deletepermission.php", data);
        return caller.IsSuccessful(response);
    });
}
export function insertTokenPermission(tokenPermission) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield caller.POSTAsynch("../amp/includes/requests/inserttokenpermission.php", tokenPermission);
        try {
            tokenPermission.id = JSON.parse(response).newId;
        }
        catch (err) {
            console.log(err);
            console.log(response);
        }
    });
}
export function deleteTokenPermission(tokenPermission) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            id: tokenPermission.id,
            columnId: tokenPermission.columnId
        };
        let response = yield caller.POSTAsynch("../amp/includes/requests/deletetokenpermission.php", data);
        return caller.IsSuccessful(response);
    });
}
export function constrPermission(json) {
    let permissions = [];
    for (let perm of json) {
        permissions.push(new Permission(perm.id, perm.level, perm.authorId, perm.columnId));
    }
    return permissions;
}
export function constrTokenPermission(json) {
    let permissions = [];
    for (let perm of json) {
        let tk = {
            id: perm.id,
            authorId: perm.authorId,
            tokenId: perm.tokenId,
            columnId: perm.columnId
        };
        permissions.push(tk);
    }
    return permissions;
}
//# sourceMappingURL=permission.js.map