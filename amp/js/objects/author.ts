import * as caller from "./caller.js";
import * as perm from "./permission.js";
export class Author{
    id: number;
    uniqName: string;
    userName: string;
    permissions: perm.Permission[] = [];
    tokenPermissions: perm.TokenPermission[] = [];
    constructor(id: number, uniqName: string, userName:string, permissions?: perm.Permission[], tokenPermissions?: perm.TokenPermission[]){
        this.id = id;
        this.uniqName = uniqName;
        this.userName = userName;
        this.permissions = permissions;
        this.tokenPermissions = tokenPermissions;
    }

    getHighestPermission(): number{
        if(this.permissions == null || this.permissions.length === 0){
            return 0;
        }
        return Math.max.apply(Math, this.permissions.map(function(p:any) { return p.level; }))
    }
    getPermissionName(): string{
        switch(this.getHighestPermission()){
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
export async function selectAllAuthors(): Promise<Author[]>{
    let response = await caller.GETAsynch("../amp/includes/requests/selectauthors.php");
    return parseArray(response);
}

export async function selectAuthor(id: number): Promise<Author>{
    let data = {
        id: id
    }
    let response = await caller.POSTAsynch("../amp/includes/requests/selectauthor.php", data);
    return parseAuthor(response);
}

export async function selectAuthorByName(authorName:string): Promise<Author>{
    let data = {
        name: authorName
    }
    let response = await caller.POSTAsynch("../amp/includes/requests/selectauthorbyname.php", data);
    return parseAuthor(response);
}

export function permissionName(permission: perm.Permission):string{
    switch(permission.level){
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

export async function getMyInfo(): Promise<Author>{
    let response = await caller.GETAsynch("../amp/includes/requests/getmyinfo.php");
    return parseAuthor(response);
}

export async function updatePassword(author: Author, password1: string, password2: string, requesterPassword: string): Promise<string>{
    if(password1 !== password2){
        return null;
    }
    let data = {
        id: author.id,
        uniqName: author.uniqName,
        password: password1,
        requesterPassword: requesterPassword
    }
    let response = await caller.POSTAsynch("../amp/includes/requests/updateauthorpassword.php", data);
    if(JSON.parse(response).msg === "success"){
        return "200";
    } else {
        return response;
    }    
}

export async function logOut(){
    await caller.GETAsynch("../amp/includes/logout.php");
    window.location.href = "../amp/login.php";
}

export async function login(userName: string, password: string){
    const response = await caller.POSTAsynch("../amp/includes/requests/login.php", { userName, password });
    console.log(response);
    if(JSON.parse(response).msg === "success"){
        return true;
    }
    return false;
}

function parseAuthor(json: string){
    let author = JSON.parse(json).author;
    let newAuthor: Author;
    if(author.permissions.length === 0){
        newAuthor = new Author(author.id, author.uniqName, author.userName);
    } else {
        newAuthor = new Author(author.id, author.uniqName, author.userName, perm.constrPermission(author.permissions), perm.constrTokenPermission(author.tokenPermissions));
    } 
    if(author.tokenPermissions.length > 0){
        newAuthor.tokenPermissions = author.tokenPermissions;
    } 
    return newAuthor;
}

function parseArray(json:string): Author[]{
    let authorArray: Author[] = [];
    for (let auth of JSON.parse(json).authors) {
        let newAuthor = new Author(auth.id, auth.uniqName, auth.userName, null, auth.level);
        newAuthor.permissions = auth.permissions;
        authorArray.push(newAuthor);
    }
    return authorArray;
}