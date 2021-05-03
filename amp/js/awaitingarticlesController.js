var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { selectArticlesByState } from "./objects/article.js";
import { getColumns } from "./objects/column.js";
import * as doc from "./doc.js";
import * as utils from "./utils.js";
import { Token, selectAccessibleTokens, selectActiveTokensByColumn } from "./objects/token.js";
import { getMyInfo } from "./objects/author.js";
let articleTable = doc.getDiv("article-table");
let columnSelect = doc.getSelect("column-select");
let articles = [];
let columns = [];
let tokens = []; //aktív tokenek
let myAccessibleTokens = []; //tokenek amikhez nekünk van jogosultságunk
let articlePerPage = 15;
let searchInput = doc.getInput("search");
let stateSelect = doc.getSelect("state-select");
let tokenSelect = doc.getSelect("token-select");
let excludeLocked = doc.getInput("exclude-locked");
let myInfo;
init();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        stateSelect.value = "1";
        searchInput.value = "";
        yield Promise.all([setColumns(), setMyInfo(), setMyAccessibleTokens(), initElements()]);
        renderColumnSelect();
        renderMyAccessibleTokens();
        yield Promise.all([setArticles(), setTokens()]);
        renderArticles();
        displayExpandBtn(articles);
    });
}
function setMyInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        myInfo = yield getMyInfo();
    });
}
function setColumns() {
    return __awaiter(this, void 0, void 0, function* () {
        columns = yield getColumns();
    });
}
function setMyAccessibleTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        myAccessibleTokens = yield selectAccessibleTokens();
    });
}
function renderMyAccessibleTokens() {
    tokenSelect.innerHTML = "";
    doc.renderOption(tokenSelect, "0", "---");
    if (columnSelect.value === "0") {
        renderAccessibleTokensForAllColumns();
    }
    else {
        renderAccessibleTokensForOneColumn();
    }
}
function renderAccessibleTokensForAllColumns() {
    for (let token of myAccessibleTokens.filter(t => t.status != 0)) {
        doc.renderOption(tokenSelect, token.id.toString(), `${token.name} / ${columns.find(c => c.id === token.columnId).name}`);
    }
}
function renderAccessibleTokensForOneColumn() {
    for (let token of myAccessibleTokens.filter(t => t.status != 0 && (t.columnId === 0 || t.columnId === parseInt(columnSelect.value)))) {
        doc.renderOption(tokenSelect, token.id.toString(), `${token.name} / ${columns.find(c => c.id === token.columnId).name}`);
    }
}
function initElements() {
    doc.addChange(tokenSelect, renderArticles);
    doc.addChange(excludeLocked, renderArticles);
    doc.addClick("search-btn", search);
    doc.addClick("expand-btn", expand);
    doc.addChange(stateSelect, search);
    doc.addChange(columnSelect, () => {
        renderMyAccessibleTokens();
        search();
    });
    doc.addChange(tokenSelect, search);
    addSearchListener();
}
function setArticles() {
    return __awaiter(this, void 0, void 0, function* () {
        articles = yield selectArticlesByState(searchInput.value, articlePerPage, 0, parseInt(columnSelect.value), parseInt(stateSelect.value));
    });
}
function setTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        tokens = yield selectActiveTokensByColumn(parseInt(columnSelect.value));
    });
}
function expand() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let newArticles = yield selectArticlesByState(searchInput.value, articlePerPage, articles.length, parseInt(columnSelect.value), parseInt(stateSelect.value));
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
        renderArticles();
        displayExpandBtn(articles);
    });
}
function editArticle(article) {
    if (article.state > 0) {
        window.location.href = `../amp/cikk_szerk_x.php?aid=${article.id}`;
    }
    else {
        window.location.href = `../amp/cikk.php?aid=${article.id}&by=${article.authorName}`;
    }
}
function switchChangeStateBtn(oldButton, article) {
    let newButton = doc.create("button", null, ["red", "awaitArticleButton"], "Visszaküldés");
    newButton.addEventListener("click", function () { changeState(article); });
    oldButton.parentNode.replaceChild(newButton, oldButton);
    setTimeout(() => { newButton.parentNode.replaceChild(oldButton, newButton); }, 5000);
}
function changeState(article) {
    article.state = article.state - 1;
    article.updateState();
    doc.remove(article.id.toString());
    articles = articles.filter(a => a.id !== article.id);
}
function renderArticles() {
    articleTable.innerHTML = "";
    if (parseInt(stateSelect.value) === 0) {
        render0StateArticles();
    }
    else {
        renderHigherStateArticles();
    }
}
function render0StateArticles() {
    for (var art of articles.filter(a => !a.hasTokenInstance(new Token(parseInt(tokenSelect.value))))) {
        renderRow(art);
    }
}
function renderHigherStateArticles() {
    for (var art of articles.filter(a => !a.hasTokenInstance(new Token(parseInt(tokenSelect.value))))) {
        if (isEditable(art) == excludeLocked.checked)
            renderRow(art);
    }
}
function addSearchListener() {
    let input = doc.get("search");
    doc.addEnter(input, () => { document.getElementById("search-btn").click(); });
}
function renderColumnSelect() {
    let highestPerm = myInfo.getHighestPermission();
    let accessibleColumns = [];
    if (highestPerm >= 40) {
        let all = { id: 0, name: "Mind" };
        accessibleColumns = columns;
        accessibleColumns.unshift(all);
    }
    else {
        accessibleColumns = columns.filter(col => utils.hasCmlAccesToColumn(myInfo.permissions, col));
    }
    for (let column of accessibleColumns) {
        doc.renderOption(columnSelect, column.id, column.name);
    }
}
function renderRow(article) {
    let title;
    let container = doc.createDiv(article.id.toString(), ["awaitArticleContainer"]);
    if (article.state < 1) {
        title = doc.createA(["awaitArticleTitle"], article.title, `../amp/cikk.php?aid=${article.id}&by=${article.authorName}`);
    }
    else if (article.state === 1) {
        title = doc.createA(["awaitArticleTitle"], article.title, `../amp/cikk_szerk_x.php?aid=${article.id}`);
    }
    else {
        title = doc.createA(["awaitArticleTitle"], article.title, encodeURI(`../cikk.php?aid=${article.id}&cid=${article.columnId}&rovat=${columns.find(c => c.id === article.columnId).name}`));
        title.target = "blank";
    }
    let table = doc.createTable(["awaitArticleTable"]);
    doc.renderTableRow(table, [doc.createA(["awaitArticleAuthorName"], article.authorName, `../amp/szerzo.php?szerzo=${article.authorId}`).outerHTML, getColumnNameById(article.columnId), doc.parseDateHun(article.date)]);
    let lockDiv = renderLock(article);
    let changeStateBtn;
    let editBtn;
    if (article.state > 0) {
        changeStateBtn = doc.createButton(["awaitArticleButton", "red"], '<i class="fas fa-backspace"></i>', () => { switchChangeStateBtn(changeStateBtn, article); });
        doc.append(container, [title, table, changeStateBtn, lockDiv]);
    }
    else {
        doc.append(container, [title, table, lockDiv]);
    }
    if (article.state > 1) {
        editBtn = doc.createA(["anchor-btn", "blue"], '<span><i class="fas fa-edit"></i></span>', `../amp/cikk_szerk_x.php?aid=${article.id}`);
        doc.append(container, [editBtn]);
    }
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
function renderLock(article) {
    let lockDiv = doc.createDiv(null, ["lock"]);
    if (article.isLocked) {
        lockDiv.innerHTML = '<i class="fas fa-lock"></i>';
        if (article.lockedBy === myInfo.permissions[0].authorId) {
            lockDiv.classList.add("locked-by-me");
            lockDiv.title = "Ön által lezárva";
        }
        else {
            lockDiv.classList.add("locked-from-me");
            lockDiv.title = "Más felhasználó által lezárva";
        }
    }
    else {
        lockDiv.innerHTML = '<i class="fas fa-lock-open"></i>';
        lockDiv.classList.add("not-locked");
        lockDiv.title = "Nyitott";
    }
    return lockDiv;
}
function isEditable(article) {
    if (!article.isLocked)
        return true;
    if (article.lockedBy === myInfo.permissions[0].authorId)
        return true;
    return false;
}
function getColumnNameById(columnId) {
    var result = columns.find(c => c.id == columnId);
    return result.name;
}
function displayExpandBtn(articleData) {
    if (articleData.length < articlePerPage) {
        document.getElementById("expand-btn").style.display = "none";
    }
    else {
        document.getElementById("expand-btn").style.display = "inline";
    }
}
//# sourceMappingURL=awaitingarticlesController.js.map