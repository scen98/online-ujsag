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
import * as perm from "./permission.js";
export class Author {
    constructor(id, uniqName, userName, permissions, tokenPermissions) {
        this.permissions = [];
        this.tokenPermissions = [];
        this.id = id;
        this.uniqName = uniqName;
        this.userName = userName;
        this.permissions = permissions;
        this.tokenPermissions = tokenPermissions;
    }
    getHighestPermission() {
        if (this.permissions == null || this.permissions.length === 0) {
            return 0;
        }
        return Math.max.apply(Math, this.permissions.map(function (p) { return p.level; }));
    }
    getPermissionName() {
        switch (this.getHighestPermission()) {
            case 10:
                return "Általános";
            case 20:
                return "Rovatsegéd";
            case 30:
                return "Rovatvezető";
            case 40:
                return "Újságvezető";
            case 50:
                return "Rendszergazda";
        }
    }
}
export function selectAllAuthors() {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield caller.GETAsynch("../amp/includes/requests/selectauthors.php");
        return parseArray(response);
    });
}
export function selectAuthor(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            id: id
        };
        let response = yield caller.POSTAsynch("../amp/includes/requests/selectauthor.php", data);
        return parseAuthor(response);
    });
}
export function selectAuthorByName(authorName) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            name: authorName
        };
        let response = yield caller.POSTAsynch("../amp/includes/requests/selectauthorbyname.php", data);
        return parseAuthor(response);
    });
}
export function permissionName(permission) {
    switch (permission.level) {
        case 10:
            return "Általános";
        case 20:
            return "Asszisztens";
        case 30:
            return "Rovatvezető";
        case 40:
            return "Újságvezető";
        case 50:
            return "Rendszergazda";
    }
}
export function getMyInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield caller.GETAsynch("../amp/includes/requests/getmyinfo.php");
        return parseAuthor(response);
    });
}
export function updatePassword(author, password1, password2, requesterPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        if (password1 !== password2) {
            return null;
        }
        let data = {
            id: author.id,
            uniqName: author.uniqName,
            password: password1,
            requesterPassword: requesterPassword
        };
        let response = yield caller.POSTAsynch("../amp/includes/requests/updateauthorpassword.php", data);
        if (JSON.parse(response).msg === "success") {
            return "200";
        }
        else {
            return response;
        }
    });
}
export function logOut() {
    return __awaiter(this, void 0, void 0, function* () {
        yield caller.GETAsynch("../amp/includes/logout.php");
        window.location.href = "../amp/login.php";
    });
}
export function login(userName, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield caller.POSTAsynch("../amp/includes/requests/login.php", { userName, password });
        console.log(response);
        if (JSON.parse(response).msg === "success") {
            return true;
        }
        return false;
    });
}
function parseAuthor(json) {
    let author = JSON.parse(json).author;
    let newAuthor;
    if (author.permissions.length === 0) {
        newAuthor = new Author(author.id, author.uniqName, author.userName);
    }
    else {
        newAuthor = new Author(author.id, author.uniqName, author.userName, perm.constrPermission(author.permissions), perm.constrTokenPermission(author.tokenPermissions));
    }
    if (author.tokenPermissions.length > 0) {
        newAuthor.tokenPermissions = author.tokenPermissions;
    }
    return newAuthor;
}
function parseArray(json) {
    let authorArray = [];
    for (let auth of JSON.parse(json).authors) {
        let newAuthor = new Author(auth.id, auth.uniqName, auth.userName, null, auth.level);
        newAuthor.permissions = auth.permissions;
        authorArray.push(newAuthor);
    }
    return authorArray;
}
//# sourceMappingURL=author.js.map