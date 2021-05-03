import { selectReadableArticle } from "./positionedArticle.js";
import * as doc from "../amp/js/doc.js";
import * as utils from "../amp/js/utils.js";
import { Article } from "../amp/js/objects/article.js";
init();
/*
function init(){
    //selectReadableArticle(setArticle, parseInt(utils.getUrlParameter("aid")));
    setArticle();
}*/

async function init(){
    let articleData = await selectReadableArticle(parseInt(utils.getUrlParameter("aid")));
    let columnName: string = utils.getUrlParameter("rovat");
    let authorName = doc.get("author-name") as HTMLAnchorElement; 
    doc.get("title").innerText = articleData.title;
    doc.get("lead").innerText = articleData.lead;
    doc.get("text").innerHTML = articleData.text;
    doc.get("date").innerText = doc.parseDateYYYYMMDD(articleData.date);
    authorName.innerText = articleData.authorName;
    authorName.href = `../magazine/szerzo.php?aid=${articleData.authorId}&nev=${encodeURIComponent(articleData.authorName)}`;
    doc.getImg("main-img").src = articleData.imgPath;
    let columnAnchor = doc.get("column-name") as HTMLAnchorElement;
    columnAnchor.innerText = columnName;
    columnAnchor.href = encodeURI(`../magazine/rovat.php?cid=${articleData.columnId}&rovat=${encodeURIComponent(columnName)}`);
}