import * as doc from "./doc.js";
import * as utils from "./utils.js";
import { ArticleComment, selectByArticle } from "./objects/articleComment.js";
let commentTable: HTMLDivElement = doc.getDiv("comment-container");
let comments: ArticleComment[] = [];
let myInfo = utils.getMyInfo();
let articleId: number = parseInt(utils.getUrlParameter("aid"));
init();
async function init(){
    comments = await selectByArticle(articleId);
    renderComments();
    doc.addClick("post-comment", postComment);
}

async function postComment(){
    let newComment: ArticleComment = new ArticleComment(null, doc.getValue("new-comment"), myInfo.id, new Date(), myInfo.userName, articleId);
    await newComment.insert();
    if(newComment.id){
        renderComment(newComment);
        doc.getInput("new-comment").value = "";
    } else {
        alert("A művelet végrehajtása szerveroldali hiba miatt nem iskerült.");
    }
}

function renderComments(){
    for (let comment of comments) {
        renderComment(comment);
    }
}

async function renderComment(comment: ArticleComment){
    let container: HTMLDivElement = doc.createDiv(`comment${comment.id}`, ["comment-container"]);
    let authorName: HTMLAnchorElement = doc.createA(["comment-author"], comment.authorName, `../amp/szerzo.php?szerzo=${(comment.authorId)}`);
    let date: HTMLParagraphElement = doc.createP(["comment-date"], doc.parseDateHun(comment.date));
    let text: HTMLParagraphElement = doc.createP(["comment-content"], comment.text);
    doc.append(container, [authorName, date, text]);
    if(myInfo.id === comment.authorId){
        
        container.classList.add("my-comment");
        container.appendChild(createDeleteBtn(comment));
    }
    doc.append(commentTable, [container]);
}

function createDeleteBtn(comment: ArticleComment): HTMLButtonElement{
    let deleteBtn = doc.createButton(["delete-btn", "red"], "Törlés");
    doc.addClick(deleteBtn, ()=>{
        deleteComment(comment);
    });
    return deleteBtn;
}

async function deleteComment(comment: ArticleComment){
    if(await comment.delete()){
        doc.remove(`comment${comment.id}`);
    } else {
        alert("A művelet végrehajtása szerveroldali hiba miatt nem sikerült.");
    }
}