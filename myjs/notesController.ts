import * as doc from "../amp/js/doc.js";
import * as utils from "../amp/js/utils.js";
import { PositionedArticle, selectPositionedArticles, selectPositionedArticlesByBlock } from "./positionedArticle.js";
let articles: PositionedArticle[] = [];
init();
async function init(){
    let columnParameter = utils.getUrlParameter("cid");
    if(columnParameter == null || parseInt(columnParameter) ===  0) //a főoldalon nem kell lefuttatni ezt a scriptet, mert a recommendedController betölti a szükséges cikkeket
    {
        return;
    }
    articles = await selectPositionedArticlesByBlock(3);
    renderPositions();
}

function renderPositions(){
    for (let article of articles) {
        article.render();
    }
}