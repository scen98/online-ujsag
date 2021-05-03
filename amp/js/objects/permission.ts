import * as caller from "./caller.js";
export class Permission {
    id: number;
    level: number;
    authorId: number;
    columnId: number;
    constructor(id: number, level: number, authorId: number, columnId?: number){
        this.id = id;
        this.level = level;
        this.authorId = authorId;
        this.columnId = columnId;
    }
    async insert(){
        let response = await caller.POSTAsynch("../amp/includes/requests/insertpermission.php", this);
        this.id = JSON.parse(response).newId;
    }
    async change(){
        let response = await caller.POSTAsynch("../amp/includes/requests/changepermissiontype.php", this);
        this.id = JSON.parse(response).newId;
    }
    async delete(): Promise<Boolean>{
        let data = {
            id: this.id
        }
        let response = await caller.POSTAsynch("../amp/includes/requests/deletepermission.php", data);
        if(JSON.parse(response).msg === "success"){
            return true;
        } 
        return false;
    }
}

export async function deletePermission(permission: Permission): Promise<Boolean>{
    let data = {
        id: permission.id,
        columnId: permission.columnId,
        authorId: permission.authorId
    }
    let response = await caller.POSTAsynch("../amp/includes/requests/deletepermission.php", data);
    return caller.IsSuccessful(response);
    
}

export async function insertTokenPermission(tokenPermission: TokenPermission){
    let response = await caller.POSTAsynch("../amp/includes/requests/inserttokenpermission.php", tokenPermission);
    try{
        tokenPermission.id = JSON.parse(response).newId;
    } catch(err){
        console.log(err);
        console.log(response);
    }
}

export async function deleteTokenPermission(tokenPermission: TokenPermission): Promise<Boolean>{
    let data = {
        id: tokenPermission.id,
        columnId: tokenPermission.columnId
    }
    let response = await caller.POSTAsynch("../amp/includes/requests/deletetokenpermission.php", data);
    return caller.IsSuccessful(response);
}

export function constrPermission(json): Permission[]{
    let permissions: Permission[] = [];
    for (let perm of json) {
        permissions.push(new Permission(perm.id, perm.level, perm.authorId, perm.columnId));
    }
    return permissions;
}

export function constrTokenPermission(json): TokenPermission[]{
    let permissions: TokenPermission[] = [];
    for (let perm of json) {
        let tk: TokenPermission = {
            id: perm.id,
            authorId: perm.authorId,
            tokenId: perm.tokenId,
            columnId: perm.columnId
        }
        permissions.push(tk);
    }
    return permissions;
}

export interface TokenPermission{
    id: number;
    authorId: number;
    tokenId: number;
    columnId: number;
    tokenName?: string;
}