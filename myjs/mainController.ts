import * as doc from "../amp/js/doc.js";
import * as utils from "../amp/js/utils.js";
import { PositionedArticle, selectPositionedArticles } from "./positionedArticle.js";
let articles: PositionedArticle[] = [];
init();
async function init(){
    setColumnName();
    articles = await selectPositionedArticles(getColumnId());
    renderArticles();
}

function renderArticles(){
    for (let article of articles) {
        article.render();
    }
    doc.get("main-container").style.display = "block";
}

function setColumnName(){
    let columnName = utils.getUrlParameter("rovat");
    let columnNameElement = doc.get("column-name");
    if(columnName == null || columnNameElement == null) return;
    columnNameElement.innerText = columnName;
}

function getColumnId(): number{
    let columnId = parseInt(utils.getUrlParameter("cid"));
    if(columnId == null){
        columnId = 0;
    }
    return columnId;
}