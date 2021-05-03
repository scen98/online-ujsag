var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { selectByAuthorId } from "./objects/article.js";
import { getColumns } from "./objects/column.js";
import * as doc from "./doc.js";
import * as utils from "./utils.js";
import { selectTokensByColumn } from "./objects/token.js";
let articleTable = doc.getDiv("article-table");
let columnSelect = doc.getSelect("column-select");
let articles = [];
let columns = [];
let tokens = [];
let articlePerPage = 30; //ez 100 kB-nál nem kéne hogy több legyen
let searchInput = doc.getInput("search");
let stateSelect = doc.getSelect("state-select");
let myInfo = utils.getMyInfo();
init();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        stateSelect.value = "0";
        searchInput.value = "";
        yield Promise.all([setColumns(), setTokens()]);
        yield setArticles();
        addListeners();
    });
}
function setArticles() {
    return __awaiter(this, void 0, void 0, function* () {
        articles = yield selectByAuthorId(myInfo.id, searchInput.value, parseInt(stateSelect.value), parseInt(columnSelect.value), articlePerPage, 0);
        renderArticles();
        displayExpandBtn(articles);
    });
}
function setColumns() {
    return __awaiter(this, void 0, void 0, function* () {
        columns = yield getColumns();
        renderColumnSelect();
    });
}
function setTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        tokens = yield selectTokensByColumn(parseInt(columnSelect.value));
    });
}
function addListeners() {
    doc.addClick("search-btn", search);
    doc.addClick("expand-btn", expand);
    doc.addChange("state-select", search);
    doc.addChange("column-select", search);
    doc.addChange("search", search);
}
function expand() {
    return __awaiter(this, void 0, void 0, function* () {
        let newArticles = [];
        try {
            newArticles = yield selectByAuthorId(myInfo.id, "", parseInt(stateSelect.value), parseInt(columnSelect.value), articlePerPage, articles.length);
            articles = articles.concat(newArticles);
            renderArticles();
            displayExpandBtn(newArticles);
        }
        catch (_a) {
            doc.get("expand-btn").style.display = "none";
        }
    });
}
function search() {
    return __awaiter(this, void 0, void 0, function* () {
        yield setArticles();
    });
}
function editArticle(article) {
    window.location.href = `../amp/cikk_szerk.php?aid=${article.id}`;
}
/* talán még egyszer jól jön
function switchChangeStateBtn(oldButton: HTMLButtonElement, article: Article){
    let newButton = doc.create("button", null, ["red", "awaitArticleButton"], "Visszaküldés");
    newButton.addEventListener("click", function() { changeState(article); });
    oldButton.parentNode.replaceChild(newButton, oldButton);
} */
function changeState(article) {
    article.state = article.state - 1;
    article.updateState();
    doc.remove(article.id.toString());
    articles = articles.filter(a => a.id !== article.id);
}
function renderArticles() {
    articleTable.innerHTML = "";
    for (var art of articles) {
        renderRow(art);
    }
}
function renderColumnSelect() {
    //doc.renderOption(columnSelect, "0", "Mind");
    for (let column of columns) {
        doc.renderOption(columnSelect, column.id.toString(), column.name);
    }
}
function renderRow(article) {
    let container = doc.createDiv(article.id.toString(), ["awaitArticleContainer"]);
    let title;
    if (article.state < 2) {
        title = doc.createA(["awaitArticleTitle"], article.title, `../amp/cikk.php?aid=${article.id}&by=${myInfo.userName}`);
    }
    else {
        title = doc.createA(["awaitArticleTitle"], article.title, encodeURI(`../cikk.php?aid=${article.id}&cid=${article.columnId}&rovat=${columns.find(c => c.id === article.columnId).name}`));
        title.target = "blank";
    }
    let lead = doc.createP(["articleLead"], article.lead);
    let editBtn = doc.createButton(["awaitArticleButton", "blue"], '<i class="fas fa-edit"></i>', () => { editArticle(article); });
    let table = doc.createTable(["awaitArticleTable"]);
    doc.renderTableRow(table, [getColumnNameById(article.columnId), doc.parseDateHun(article.date)]);
    doc.append(container, [title, lead, table, editBtn]);
    renderTokenInstances(container, article);
    articleTable.appendChild(container);
}
function renderTokenInstances(container, article) {
    for (let token of tokens) {
        if (isTokenNecessary(token, article))
            renderTokenInstance(container, article, token);
    }
}
function renderTokenInstance(container, article, token) {
    let tokenDiv = doc.createDiv(null, ["redAwaitingToken"]);
    if (article.hasTokenInstance(token)) {
        tokenDiv.className = "greenAwaitingToken";
    }
    tokenDiv.innerText = token.name;
    doc.append(container, [tokenDiv]);
}
function isTokenNecessary(token, article) {
    if (token.columnId === 0)
        return true;
    return article.columnId === token.columnId;
}
function getColumnNameById(columnId) {
    var result = columns.find(c => c.id == columnId);
    return result.name;
}
function displayExpandBtn(articleData) {
    if (articleData.length < articlePerPage || articleData.length === 0) {
        document.getElementById("expand-btn").style.display = "none";
    }
    else {
        document.getElementById("expand-btn").style.display = "inline";
    }
}
//# sourceMappingURL=myarticlesController.js.map