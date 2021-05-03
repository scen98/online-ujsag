import * as caller from "../amp/js/objects/caller.js";
import { Article, constrFromJSON } from "../amp/js/objects/article.js";
import * as doc from "../amp/js/doc.js";
export class PositionedArticle extends Article {
    htmlId: string;
    columnName: string;
    constructor(id:number, title:string, lead:string, authorId:number, date:Date, imgPath:string, columnId:number, authorName: string, columnName: string, htmlId?: string){
        super(id, title, lead, authorId, date, imgPath, columnId);
        super.authorName = authorName;
        this.columnName = columnName;
        this.htmlId = htmlId;
    }

    cutLead(charCount: number):string{
        let shortenedLead = this.lead.substring(0, charCount);
        if(this.lead.length > charCount){
            shortenedLead += "...";
        }
        return shortenedLead;
    }

    render(){
        let title = doc.get(`${this.htmlId}-title`);
        if(title != null) title.innerText = `${this.title}`;
        let lead = doc.get(`${this.htmlId}-lead`);
        if(lead != null) lead.innerText = this.cutLead(150);            
        let frontImg = doc.getImg(`${this.htmlId}-img`);
        if(frontImg != null){
            if(this.imgPath){
                frontImg.src = this.imgPath;
            } else {
                frontImg.src = "./img/default.jpg";
            }
        } 
        let column = doc.get(`${this.htmlId}-column`) as HTMLAnchorElement;
        if(column != null) {
            column.innerText = this.columnName;
            column.href = encodeURI(`../magazine/rovat.php?cid=${this.columnId}&rovat=${encodeURIComponent(this.columnName)}`);
        }
        let date = doc.get(`${this.htmlId}-date`);
        if(date != null) date.innerText = doc.parseDateYYYYMMDD(this.date);
        let author = doc.get(`${this.htmlId}-author`) as HTMLAnchorElement;
        if(author != null){
            author.innerText = this.authorName;
            author.href = `../magazine/szerzo.php?aid=${this.authorId}&nev=${encodeURIComponent(this.authorName)}`;
        }
        for (let art of document.getElementsByName(this.htmlId) as NodeListOf<HTMLAnchorElement>) {
           art.href =  encodeURI(`../magazine/cikk.php?aid=${this.id}&cid=${this.columnId}&rovat=${encodeURIComponent(this.columnName)}`);
        }
    }
}

export async function selectPositionedArticles(columnId: number): Promise<PositionedArticle[]>{
    let data = {
        columnId: columnId
    }
    let result = await caller.POSTAsynch("./amp/includes/requests/selectarticlesbycolumnblock.php", data);
    try{
        return parsePositionedArticles(result);
    }catch(err){
        console.log(err);
        console.log(result);
        return [];
    }
}

export async function selectReadableArticle(id: number): Promise<Article> {
    let data = {
        id: id
    };
    let result = await caller.POSTAsynch("../magazine/amp/includes/requests/selectreadablearticle.php", data);
    try{
        return constrFromJSON(result);
    }catch(Exception){
        console.log(Exception);
        console.log(result);
        return undefined;
    } 
}

export async function selectSideArticles(columnId: number): Promise<PositionedArticle[]>{
    let data = {
        columnId: columnId
    }
    let result = await caller.POSTAsynch("./amp/includes/requests/selectsidearticles.php", data);
    
    try{
        return parsePositionedArticles(result);
    } catch(err){
        console.log(err);
        console.log(result);
        return [];
    }
}

export async function searchArticles(keyword: string, limit: number, offset: number): Promise<PositionedArticle[]>{
    let data = {
        keyword: keyword,
        limit: limit,
        offset: offset
    }
    let result = await caller.POSTAsynch("./amp/includes/requests/selectusersearch.php", data);
    try{
        return parsePositionedArticles(result);
    } catch(err){
        console.log(err);
        console.log(result);
        return [new PositionedArticle(0, "Hiba a kérelem feldolgozásakor.", null, null, null, null, null, null, null)];
    }
}

export async function selectPositionedArticlesByAuthor(authorId: number, limit: number, offset: number): Promise <PositionedArticle[]>{
    let data = {
        authorId: authorId,
        limit: limit,
        offset: offset
    }
    let result = await caller.POSTAsynch("./amp/includes/requests/selectusersearch.php", data);
    try{
        return parsePositionedArticles(result)
    } catch(err){
        console.log(err);
        console.log(result);
        return [new PositionedArticle(0, "Hiba a kérelem feldolgozásakor.", null, null, null, null, null, null, null)];
    }
}

export async function selectPositionedArticlesByBlock(blockId: number): Promise<PositionedArticle[]>{
    let data = {
        blockId: blockId
    }
    let result = await caller.POSTAsynch("./amp/includes/requests/selectarticlesbyblock.php", data);
    try{
        return parsePositionedArticles(result)
    } catch(err){
        console.log(err);
        console.log(result);
        return [new PositionedArticle(0, "Hiba a kérelem feldolgozásakor.", null, null, null, null, null, null, null)];
    }
}

export function parsePositionedArticles(json: string): PositionedArticle[]{
    let articles = JSON.parse(json).articles;
    let result: PositionedArticle[] = [];
    for (let art of articles) {
        let newArticle = new PositionedArticle(art.id, art.title, art.lead, art.authorId, new Date(art.date), art.imgPath, art.columnId, art.authorName, art.columnName, art.htmlId);
        result.push(newArticle);
    }
    return result;
}