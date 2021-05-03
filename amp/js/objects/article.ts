import * as caller from "./caller.js";
import * as ti from "./tokenInstance.js";
export class Article {
    id: number;
    title: string;
    lead: string;
    authorId: number;
    date: Date;
    imgPath: string;
    columnId: number;
    text: string;
    isLocked: boolean;
    lockedBy: number;
    state: number;
    authorName: string;
    tokenInstances: ti.TokenInstance[];
    constructor(id:number, title:string, lead:string, authorId:number, date:Date, imgPath:string, columnId:number, text?:string, isLocked?:boolean, lockedBy?:number, state?:number, authorName?:string, tokenInstances?: ti.TokenInstance[]){
        this.id = id;
        this.title = title;
        this.lead = lead;
        this.authorId = authorId;
        this.date = date;
        this.imgPath = imgPath;
        this.columnId = columnId;
        this.text = text;
        this.isLocked = isLocked;
        this.lockedBy = lockedBy;
        this.state = state;
        this.authorName = authorName;
        this.tokenInstances = tokenInstances;
    }

    async insert(){
        let newIdRaw = await caller.POSTAsynch("../amp/includes/requests/insertarticle.php", this);
        this.id = JSON.parse(newIdRaw).newId;
    }

    async update(): Promise<Boolean>{
        let response = await caller.POSTAsynch("../amp/includes/requests/updatearticle.php", this);
        return caller.IsSuccessful(response);
    }

    async delete(): Promise<Boolean>{
        let response = await caller.POSTAsynch("../amp/includes/requests/deletearticle.php", this);
        return caller.IsSuccessful(response);
    }

    async switchLock(authorId:number): Promise<Boolean>{
        invertLock(this, authorId);
        let response: string;
        if(this.isLocked){
            response = await caller.POSTAsynch("../amp/includes/requests/lockarticle.php", this);
        } else {
            response = await caller.POSTAsynch("../amp/includes/requests/unlockarticle.php", this);
        }
        if(JSON.parse(response).msg === "success"){
            return true;
        } else if(JSON.parse(response).msg === "fail"){
            alert("Ezt a cikket már egy másik felhasználó zárolta.")
            return false;
        } else{
            invertLock(this, authorId);
            console.log(response);
            return false;
        }
    }

    async updateState(){
        let data = {
            id: this.id,
            state: this.state,
            columnId: this.columnId
        }
        let response = await caller.POSTAsynch("../amp/includes/requests/updatearticlestate.php", data);
        return caller.IsSuccessful(response);
    }

    hasTokenInstance(token): Boolean{
        if(this.tokenInstances == null){
            return false;
        }
        return this.tokenInstances.some(ti => ti.tokenId === token.id);
    }

    hasAllTokenInstances(necessaryTokens): Boolean{
        return necessaryTokens.every(t=> this.hasTokenInstance(t));
    }
}

export function invertLock(article: Article, authorId:number){
    if(!article.isLocked){
        article.isLocked = true;
        article.lockedBy = authorId;
    } else {
        article.isLocked = false;
    }
}

export async function selectArticle(articleId:number): Promise<Article>{
    let data = {
        id: articleId
    }
    let response = await caller.POSTAsynch("../amp/includes/requests/selectarticle.php", data);
    return constrFromJSON(response);
}

export async function selectArticles(articleIdArray:number[]): Promise<Article[]>{
    let data = {
        ids: articleIdArray
    }
    let response = await caller.POSTAsynch("../amp/includes/requests/selectarticles.php", data);
    return parseArray(response);
}

export async function selectByAuthorId(authorId: number, keyword:string, state: number, columnId: number, limit:number, offset:number): Promise<Article[]>{
    let data = {
        authorId: authorId,
        keyword: keyword,
        limit: limit,
        offset: offset,
        state: state,
        columnId: columnId
    }
    let response = await caller.POSTAsynch("../amp/includes/requests/selectarticlesbyauthor.php", data);
    return parseArray(response);
}

export async function selectArticlesByState(keyword:string, limit:number, offset:number, columnId:number, state:number): Promise<Article[]>{
    let data = {
        keyword: keyword,
        limit: limit,
        offset: offset,
        columnId: columnId,
        state: state
    }
    let response = await caller.POSTAsynch("../amp/includes/requests/selectarticlesbystate.php", data);
    try{        
        return parseArray(response);
    }catch(err){
        console.log(err);
        console.log(response);
        return [];
    }   
}

function parseArray(json: string):Article[]{
    let articleArray = Array();
    for (let art of JSON.parse(json).articles) {
        let newArticle = new Article(art.id, art.title, art.lead, art.authorId, new Date(art.date), art.imgP,art.columnId, art.text, art.isLocked == 1, art.lockedBy, art.state, art.authorName, ti.constrArray(art.tokenInstances));
        articleArray.push(newArticle);
    }
    return articleArray;
}

export function constrFromJSON(json: string):Article{
    let art = JSON.parse(json).article;
    let article = new Article(art.id, art.title, art.lead, art.authorId, new Date(art.date), art.imgPath, art.columnId, art.text, art.isLocked == 1, art.lockedBy, art.state, art.authorName);
    if(art.state > 0 && art.tokenInstances != null && art.tokenInstances.length > 0){ //asd //???
        article.tokenInstances = ti.constrArray(art.tokenInstances);
    } else {
        article.tokenInstances = [];
    }
    return article;
}