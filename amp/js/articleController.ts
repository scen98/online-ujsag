import { Article, selectArticle } from "./objects/article.js";
import * as doc from "./doc.js";
import * as utils from "./utils.js";
import { getColumns, Column } from "./objects/column.js";
let article: Article;
let columns: Column[] = [];
init();
async function init(){
    await Promise.all([setArticle(), setColumns()]);
    renderArticle();
}

async function setColumns(){
    columns = await getColumns();
}

async function setArticle(){
    article = await selectArticle(parseInt(utils.getUrlParameter("aid")));
}

function renderArticle(){
    doc.getImg("main-img").src = article.imgPath;
    doc.get("title").innerText = article.title;
    doc.get("details").innerText = `${utils.getUrlParameter("by")}, ${columns.find(c=> c.id ===  article.columnId).name}, ${doc.parseDateHun(article.date)}`;
    doc.get("lead").innerText = article.lead;
    doc.get("text").innerHTML = article.text;
}
