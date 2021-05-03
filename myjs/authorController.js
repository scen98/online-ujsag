var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as utils from "../amp/js/utils.js";
import * as doc from "../amp/js/doc.js";
import { selectPositionedArticlesByAuthor } from "./positionedArticle.js";
let articleTable = doc.getDiv("article-container");
let loadDiv = doc.getDiv("load-more");
let articlePerPage = 10;
let articles = []; //ez igazából félig felesleges, de később még jól jöhet
let authorId = parseInt(utils.getUrlParameter("aid"));
init();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        let [newArticles] = yield Promise.all([selectPositionedArticlesByAuthor(authorId, articlePerPage, 0), initElements()]); //ennek értelme konkrétan semmi, csak próba
        renderArticles(newArticles);
    });
}
function initElements() {
    doc.get("author-name").innerText = utils.getUrlParameter("nev");
    doc.addClick(loadDiv, showMore);
}
function renderArticles(articleData) {
    articles = articles.concat(articleData);
    for (let article of articleData) {
        renderArticle(article);
    }
    displayMoreBtn(articleData);
}
function renderArticle(article) {
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
function showMore() {
    return __awaiter(this, void 0, void 0, function* () {
        let newArticles = yield selectPositionedArticlesByAuthor(authorId, articlePerPage, articles.length);
        renderArticles(newArticles);
    });
}
function displayMoreBtn(articleData) {
    if (articleData.length < articlePerPage) {
        loadDiv.style.display = "none";
    }
    else {
        loadDiv.style.display = "block";
    }
}
//# sourceMappingURL=authorController.js.map