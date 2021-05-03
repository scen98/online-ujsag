import * as caller from "./caller.js";
export class ArticleComment{
    id: number;
    text: string;
    authorId: number;
    date: Date;
    authorName: string;
    articleId: number;
    constructor(id:number, text:string, authorId:number, date:Date, authorName?:string, articleId?:number){
        this.id = id;
        this.text = text;
        this.authorId = authorId;
        this.date = date;
        this.authorName = authorName;
        this.articleId = articleId
    }   

    async insert(){
        let response = await caller.POSTAsynch("../amp/includes/requests/insertcomment.php", this);
        try{
            this.id = JSON.parse(response).newId;
        }catch(err){
            console.log(err);
            console.log(response);
        }
    }

    async delete(): Promise<Boolean>{
        let response = await caller.POSTAsynch("../amp/includes/requests/deletecomment.php", this);
        return caller.IsSuccessful(response);
    }
}

export async function selectByArticle(articleId: number): Promise<ArticleComment[]>{
    let data = {
        articleId: articleId
    }
    let response = await caller.POSTAsynch("../amp/includes/requests/selectcomments.php", data);
    try{
        return constrFromJSON(response);
    } catch(err){
        console.log(err);
        console.log(response);
        return [];
    }
}

function constrFromJSON(json): ArticleComment[]{
    let newArticles: ArticleComment[] = [];
    for (let newComment of JSON.parse(json).articleComments) {
        newArticles.push(new ArticleComment(newComment.id, newComment.text, newComment.authorId, new Date(newComment.date), newComment.authorName));
    }
    return newArticles;
}