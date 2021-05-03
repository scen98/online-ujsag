import * as caller from "./caller.js";
export class TokenInstance{
    id: number;
    articleId: number;
    tokenId: number;
    authorId: number;
    authorName: string;
    date: Date;
    constructor(id: number, articleId: number, tokenId:number, authorId?: number, authorName?: string, date?: Date){
        this.id = id;
        this.articleId = articleId;
        this.tokenId = tokenId;
        this.authorId = authorId;
        this.authorName = authorName;
        this.date = date;
    }

    async insert(){
        let response = await caller.POSTAsynch("../amp/includes/requests/inserttokeninstance.php", this);
        this.id = JSON.parse(response).newId;
    }
    
    async delete(): Promise<Boolean>{
        let response = await caller.POSTAsynch("../amp/includes/requests/deletetokeninstance.php", this);
        return caller.IsSuccessful(response);
    }
}

export function constrFromJson(json:string){
    return constrArray(JSON.parse(json).article.tokenInstances);
 /*   let instanceArray: TokenInstance[];
    for (let instance of JSON.parse(json).article.tokenInstances) {
        let newTokenInstance = new TokenInstance(instance.id, instance.articleId, instance.tokenId, instance.authorId, instance.authorName, new Date(instance.date));
        instanceArray.push(newTokenInstance);
    }
    return instanceArray; */
}

export function constrArray(raw){
    let instanceArray: TokenInstance[] = [];
    if(raw == null){
        return undefined;
    }
    for (let instance of raw) {
        let newTokenInstance = new TokenInstance(instance.id, instance.articleId, instance.tokenId, instance.authorId, instance.authorName, new Date(instance.date));
        instanceArray.push(newTokenInstance);
    }
    return instanceArray;
}