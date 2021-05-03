import * as utils from "../amp/js/utils.js";
import * as doc from "../amp/js/doc.js";
import { PositionedArticle, searchArticles, selectPositionedArticlesByAuthor } from "./positionedArticle.js";
let articleTable: HTMLDivElement = doc.getDiv("article-container");
let loadDiv: HTMLDivElement = doc.getDiv("load-more");
let articlePerPage: number = 10;
let articles: PositionedArticle[] = []; //ez igazából félig felesleges, de később még jól jöhet
let authorId = parseInt(utils.getUrlParameter("aid"));
init();
async function init(){
    let [newArticles] = await Promise.all([selectPositionedArticlesByAuthor(authorId, articlePerPage, 0), initElements()]); //ennek értelme konkrétan semmi, csak próba
    renderArticles(newArticles);
}

function initElements(){
    doc.get("author-name").innerText = utils.getUrlParameter("nev");
    doc.addClick(loadDiv, showMore);
}

function renderArticles(articleData: PositionedArticle[]){
    articles = articles.concat(articleData);
    for (let article of articleData) {
        renderArticle(article);
    }
    displayMoreBtn(articleData);
}

function renderArticle(article: PositionedArticle){ //igen, ez egy katasztrófa
    let containerDiv = doc.createDiv(`a${article.id}`, ["single-latest-post", "row", "align-items-center"]);        
    containerDiv.innerHTML = 
        `<a>
            <div class="col-lg-5 post-left">
                <div class="feature-img relative">
                    <div class="overlay overlay-bg"></div>
                    <img class="img-fluid" src="${article.imgPath}" alt="${article.title}">
                </div>
                <ul class="tags">
                    <li><a href="../magazine/rovat.php?cid=${article.columnId}&rovat=${encodeURIComponent(article.columnName)}">${article.columnName}</a></li>
                </ul>
            </div>
            <div class="col-lg-7 post-right">
                <a href="../magazine/cikk.php?aid=${article.id}&cid=${article.columnId}&rovat=${encodeURIComponent(article.columnName)}">
                    <h4>${article.title}</h4>
                </a>
                <ul class="meta">
                    <li><a href="#"><span class="lnr lnr-calendar-full"></span>${doc.parseDateYYYYMMDD(article.date)}</a></li>
                </ul>
                <p class="excert">
                ${article.cutLead(150)}
                </p>
            </div>
        </a>`;
    articleTable.appendChild(containerDiv);
}

async function showMore(){
    let newArticles = await selectPositionedArticlesByAuthor(authorId, articlePerPage, articles.length);
    renderArticles(newArticles);
}

function displayMoreBtn(articleData: PositionedArticle[]){
    if(articleData.length < articlePerPage){
        loadDiv.style.display = "none";
    } else {
        loadDiv.style.display = "block";
    }
}