var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as doc from "./doc.js";
import * as utils from "./utils.js";
import { getMyInfo, permissionName, selectAuthor } from "./objects/author.js";
import { selectByAuthorId } from "./objects/article.js";
import { getColumns } from "./objects/column.js";
let tokenPermissionTable = doc.getUl("token-permission-list");
let searchInput = doc.getInput("search-input");
let columnSelect = doc.getSelect("column-select");
let articleTable = doc.getDiv("article-container");
let stateSelect = doc.getSelect("state-select");
let author;
let columns = [];
let articlePerPage = 15;
let articles = [];
let myInfo;
init();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([setArticles(), setAuthor(), setColumns(), setMyInfo(), initElements()]);
        renderArticles();
    });
}
function setAuthor() {
    return __awaiter(this, void 0, void 0, function* () {
        author = yield selectAuthor(parseInt(utils.getUrlParameter("szerzo")));
        renderAuthor();
    });
}
function setMyInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        myInfo = yield getMyInfo();
    });
}
function setArticles() {
    return __awaiter(this, void 0, void 0, function* () {
        let newArticles = yield selectByAuthorId(parseInt(utils.getUrlParameter("szerzo")), "", parseInt(stateSelect.value), parseInt(columnSelect.value), articlePerPage, 0);
        articles = articles.concat(newArticles);
        displayExpandBtn(newArticles);
    });
}
function setColumns() {
    return __awaiter(this, void 0, void 0, function* () {
        columns = yield getColumns();
        renderColumns();
    });
}
function renderColumns() {
    for (let column of columns) {
        doc.renderOption(columnSelect, column.id.toString(), column.name);
    }
}
function initElements() {
    doc.addClick("search-btn", search);
    doc.addClick("expand-btn", expand);
    doc.addChange("state-select", search);
    doc.addChange("column-select", search);
    doc.addChange(searchInput, search);
}
function renderAuthor() {
    doc.setText("author-name", author.userName);
    if (author.permissions != null && author.permissions.length > 0)
        author.permissions.forEach(p => renderAuthorPermission(p));
    if (author.tokenPermissions != null && author.tokenPermissions.length > 0) {
        renderTokenPermissions();
    }
    else {
        doc.get("token-permission-title").style.display = "none";
    }
}
function renderAuthorPermission(permission) {
    let column = columns.find(c => c.id === permission.columnId);
    let columnName;
    if (column != null) {
        columnName = `(${column.name})`;
    }
    else {
        columnName = "";
    }
    doc.renderLi("permission-list", `${permissionName(permission)} ${columnName}`);
}
function search() {
    return __awaiter(this, void 0, void 0, function* () {
        let newArticles = yield selectByAuthorId(author.id, searchInput.value, parseInt(stateSelect.value), parseInt(columnSelect.value), articlePerPage, 0);
        articles = newArticles;
        renderArticles();
        displayExpandBtn(newArticles);
    });
}
function expand() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let newArticles = yield selectByAuthorId(author.id, searchInput.value, parseInt(stateSelect.value), parseInt(columnSelect.value), articlePerPage, articles.length);
            articles = articles.concat(newArticles);
            expandArticles(newArticles);
        }
        catch (_a) {
            doc.get("expand-btn").style.display = "none";
        }
    });
}
function renderArticles() {
    articleTable.innerHTML = "";
    for (var art of articles) {
        renderRow(art);
    }
}
function expandArticles(articleData) {
    if (articleData.length > 0) {
        renderArticles();
    }
    displayExpandBtn(articleData);
}
function renderRow(article) {
    let container = doc.createDiv(article.id.toString(), ["awaitArticleContainer"]);
    let title = doc.createA(["awaitArticleTitle"], article.title, `../amp/cikk.php?aid=${article.id}&by=${encodeURIComponent(author.userName)}`);
    let lead = doc.createP(["articleLead"], article.lead);
    let table = doc.createTable(["awaitArticleTable"]);
    doc.renderTableRow(table, [getColumnNameById(article.columnId), doc.parseDateHun(article.date)]);
    doc.append(container, [title, lead, table]);
    if (isArticleEditable(article)) {
        renderEditBtn(container, article);
    }
    articleTable.appendChild(container);
}
function renderTokenPermissions() {
    for (let tokenPermission of author.tokenPermissions) {
        doc.renderLi("token-permission-list", tokenPermission.tokenName);
    }
}
function renderEditBtn(parent, article) {
    let button = doc.createButton(["awaitArticleButton", "blue"], '<i class="fas fa-edit"></i>', () => {
        window.open(`../amp/cikk_szerk_x.php?aid=${article.id}`);
    });
    parent.appendChild(button);
}
function getColumnNameById(columnId) {
    var result = columns.find(c => c.id == columnId);
    return result.name;
}
function isArticleEditable(article) {
    if (article.state < 1)
        return false;
    if (myInfo.getHighestPermission() >= 40)
        return true;
    return myInfo.permissions.some(p => p.columnId === article.columnId);
}
function displayExpandBtn(articleData) {
    if (articleData.length < articlePerPage || articleData.length === 0) {
        document.getElementById("expand-btn").style.display = "none";
    }
    else {
        document.getElementById("expand-btn").style.display = "inline";
    }
}
//# sourceMappingURL=authorController.js.map