var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getColumns } from "./objects/column.js";
import * as doc from "./doc.js";
import * as utils from "./utils.js";
import { selectArticlesByState, selectArticles } from "./objects/article.js";
import { updateBlock, selectByColumn } from "./objects/positionBlock.js";
import { getMyInfo } from "./objects/author.js";
let articleTable = doc.getDiv("article-table");
let positionTable = doc.getDiv("position-table");
let columnSelect = doc.getSelect("column-select");
let blockSelect = doc.getSelect("block-select");
let columns = [];
let blocks = [];
let articles = [];
let archivedArticles = []; //azok a cikkek, amik már archív státuszban vannak, de még jelen vannak az újságban
let searchSelect = doc.getSelect("search-select");
let searchInput = doc.getInput("search-input");
let myInfo;
init();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        myInfo = yield getMyInfo();
        yield setColumns();
        yield Promise.all([setArticles(), setBlocks()]);
        yield setArchives();
        yield Promise.all([renderPositions(), renderArticles()]);
        initListeners();
    });
}
function setColumns() {
    return __awaiter(this, void 0, void 0, function* () {
        columns = yield getColumns();
        let highestPerm = myInfo.getHighestPermission();
        if (highestPerm >= 40) {
            let all = { id: 0, name: "Címlap" };
            columns.unshift(all);
        }
        else {
            columns = columns.filter(col => utils.hasCmlAccesToColumn(myInfo.permissions, col));
        }
        renderColumnSelect(columnSelect);
        renderColumnSearch();
    });
}
function setArticles() {
    return __awaiter(this, void 0, void 0, function* () {
        articles = yield selectArticlesByState("", 100000, 0, parseInt(columnSelect.value), 2);
    });
}
function setBlocks() {
    return __awaiter(this, void 0, void 0, function* () {
        blocks = yield selectByColumn(parseInt(columnSelect.value));
        renderBlockSelect();
    });
}
function setArchives() {
    return __awaiter(this, void 0, void 0, function* () {
        archivedArticles = yield selectArticles(getArchivedIds());
        articles = articles.concat(archivedArticles);
    });
}
function changeColumn() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([setArticles(), setBlocks()]);
        yield setArchives();
        yield Promise.all([renderPositions(), renderArticles()]);
    });
}
function renderBlockSelect() {
    blockSelect.innerHTML = "";
    for (let block of blocks) {
        doc.renderOption(blockSelect, block.id.toString(), block.name);
    }
}
function initListeners() {
    doc.addChange(columnSelect, changeColumn);
    doc.addChange(blockSelect, renderPositions);
    doc.addChange(searchInput, searchArticles);
    doc.addChange(searchSelect, searchArticles);
    doc.addClick("search-btn", searchArticles);
    doc.addClick(doc.getBtn("save-btn"), save);
    doc.addClick(doc.getBtn("reset-btn"), resetBlocks);
}
function resetBlocks() {
    return __awaiter(this, void 0, void 0, function* () {
        blocks = yield selectByColumn(parseInt(columnSelect.value));
        yield Promise.all([renderPositions(), renderArticles()]);
    });
}
function save() {
    return __awaiter(this, void 0, void 0, function* () {
        let toSave = blocks.find(b => b.id === parseInt(blockSelect.value));
        if (yield updateBlock(toSave)) {
            //majd vmi success message
        }
        else {
            alert("Mentés sikertelen.");
        }
    });
}
function searchArticles() {
    let results = articles;
    if (parseInt(searchSelect.value) !== 0) {
        results = results.filter(a => a.columnId === parseInt(searchSelect.value));
    }
    if (searchInput.value !== "" && searchInput.value != null && searchInput.value != undefined) {
        let keyword = searchInput.value.toLowerCase();
        results = results.filter(a => a.title.toLowerCase().includes(keyword) || a.lead.toLowerCase().includes(keyword) || a.authorName.toLowerCase().includes(keyword));
    }
    articleTable.innerHTML = "";
    for (let art of results) {
        renderArticle(art);
    }
}
function renderColumnSelect(select) {
    for (let col of columns) {
        doc.renderOption(select, col.id.toString(), col.name);
    }
}
function renderArticles() {
    articleTable.innerHTML = "";
    for (let art of articles) {
        renderArticle(art);
    }
}
function renderArticle(article) {
    doc.append(articleTable, [createArticleElement(article)]);
}
function createArticleElement(article) {
    let container = doc.createDiv(article.id.toString(), ["positionArticleContainer"]);
    let title = doc.createA(["positionArticleTitle"], article.title, `./cikk_szerk_x.php?aid=${article.id}`);
    let table = document.createElement("table");
    let editBtn = doc.createButton(["positionArticleButton", "blue"], '<i class="fas fa-edit"></i>', () => {
        openEditor(article);
    });
    let archiveBtn;
    if (article.state < 3) {
        archiveBtn = doc.createButton(["positionArticleButton", "yellow"], '<i class="fas fa-archive"></i>', () => {
            archiveArticle(article);
        });
    }
    else {
        archiveBtn = doc.createP(["positionArticleArchive"], "Archív");
    }
    let stateBackBtn;
    if (article.state > 1) {
        stateBackBtn = doc.createButton(["positionArticleButton", "red"], '<i class="fas fa-share"></i>', () => {
            setStateBack(article);
            refreshArticleElement(article.id);
        });
    }
    else {
        stateBackBtn = doc.createDiv(null, []);
    }
    let positionNames = doc.createDiv(null, []);
    for (let name of getPositionNames(article.id)) {
        positionNames.appendChild(createPositionName(name));
    }
    doc.addDrag(container, article);
    doc.renderTableRow(table, [columns.find(c => c.id === article.columnId).name, doc.createA([], article.authorName, `../amp/szerzo.php?szerzo=${article.authorId}`).outerHTML, doc.parseDateHun(article.date)]);
    doc.append(container, [title, editBtn, archiveBtn, stateBackBtn, table, positionNames]);
    return container;
}
function createPositionName(name) {
    let positionElement = doc.createP(["articlePosition"], name);
    doc.addClick(positionElement, () => {
        blockSelect.value = blocks.find(b => b.name === name.split(":")[0]).id.toString(); //igen, ez elég szörnyű, de csak így nem kell átírni 3 másik functiont
        renderPositions();
    });
    return positionElement;
}
function getPositionNames(articleId) {
    let names = [];
    for (let block of blocks) {
        names = names.concat(getPositionNameByArticleId(block, articleId));
    }
    return names;
}
function getPositionNameByArticleId(block, articleId) {
    let names = [];
    for (let pos of block.positions) {
        if (pos.articleId === articleId)
            names.push(`${block.name}: ${pos.name}`);
    }
    return names;
}
function openEditor(article) {
    window.open(`./cikk_szerk_x.php?aid=${article.id}`);
}
function archiveArticle(article) {
    return __awaiter(this, void 0, void 0, function* () {
        article.state = 3;
        if (yield article.updateState()) {
            refreshArticleElement(article.id);
        }
        else {
            alert("Hiba a kérelem feldolgozásakor");
        }
    });
}
function setStateBack(article) {
    return __awaiter(this, void 0, void 0, function* () {
        article.state--;
        if (yield article.updateState()) {
            refreshArticleElement(article.id);
        }
        else {
            alert("Hiba a kérelem feldolgozásakor.");
        }
    });
}
function getArchivedIds() {
    let archiveIds = [];
    for (let b of blocks) { //undorító
        for (let position of b.positions) {
            if (position.articleId != null) {
                if (!articles.some(a => a.id === position.articleId))
                    archiveIds.push(position.articleId);
            }
        }
    }
    return archiveIds;
}
function renderPositions() {
    positionTable.innerHTML = "";
    let selectedBlock = blocks.find(b => b.id === parseInt(blockSelect.value));
    for (let position of selectedBlock.positions) {
        renderPosition(position, selectedBlock);
    }
}
function renderPosition(position, block) {
    let container = doc.createDiv("pos" + position.id, ["positionContainer"]);
    let name = doc.createP(["positionName"], position.name);
    let positionSpace = doc.createDiv(null, ["positionSpace"]);
    let oldId; //drophoz kell, hogy a updatelhessük azt a cikket is ami az update előtt volt megadva
    doc.addDrop(positionSpace, (article) => {
        oldId = position.articleId;
        position.articleId = article.id;
        article.date = new Date(article.date); //szóval a date stringből megint datet kell csinálnunk
        if (container.childNodes.length > 2) {
            container.removeChild(container.childNodes[2]);
            container.removeChild(container.childNodes[2]);
        }
        renderPositionButtons(container, positionSpace, position, block);
        renderPositionSpace(positionSpace, article);
        if (oldId)
            refreshArticleElement(oldId);
        if (position.articleId)
            refreshArticleElement(position.articleId);
    });
    doc.append(container, [name, positionSpace]);
    if (position.articleId != null) {
        renderPositionButtons(container, positionSpace, position, block);
        renderPositionSpace(positionSpace, articles.concat(archivedArticles).find(a => a.id === position.articleId));
    }
    doc.append(positionTable, [container]);
}
function refreshArticleElement(articleId) {
    let toDelete = doc.get(articleId.toString());
    toDelete.parentNode.replaceChild(createArticleElement(articles.find(a => a.id === articleId)), toDelete);
}
function renderPositionButtons(container, positionSpace, position, block) {
    let oldId = position.articleId;
    let emptyBtn = doc.createButton(["positionArticleButton", "red"], '<i class="far fa-folder-open"></i>', () => {
        emptyPosition(container, position, positionSpace);
        refreshArticleElement(oldId);
    });
    let sortDown = doc.createButton(["positionArticleButton", "green"], '<i class="fas fa-chevron-circle-down"></i>', () => {
        pushDown(position, block);
        renderArticles();
    });
    doc.append(container, [sortDown, emptyBtn]);
}
function pushDown(position, block) {
    let index = block.positions.findIndex(p => p.id === position.id);
    let i = block.positions.length - 1;
    while (i > index) {
        block.positions[i].articleId = block.positions[i - 1].articleId;
        i--;
    }
    block.positions[index].articleId = null;
    renderPositions();
}
function emptyPosition(container, position, positionSpace) {
    container.removeChild(container.childNodes[2]);
    container.removeChild(container.childNodes[2]);
    position.articleId = null;
    positionSpace.innerHTML = "";
}
function renderPositionSpace(parent, article) {
    parent.innerHTML = "";
    let container = doc.createDiv(null, ["innerContainer"]);
    let title = doc.createA(["positionArticleTitle"], article.title, `./cikk_szerk_x.php?aid=${article.id}`);
    let table = document.createElement("table");
    doc.addDrag(container, article);
    doc.renderTableRow(table, [columns.find(c => c.id === article.columnId).name, doc.createA([], article.authorName, `../amp/szerzo.php?szerzo=${article.authorId}`).outerHTML, doc.parseDateHun(article.date)]);
    doc.append(container, [title, table]);
    doc.append(parent, [container]);
}
function renderColumnSearch() {
    let highestPerm = myInfo.getHighestPermission();
    let accessibleColumns = [];
    if (highestPerm >= 40) {
        let all = { id: 0, name: "Mind" };
        accessibleColumns = columns;
        accessibleColumns[0] = all;
    }
    else {
        accessibleColumns = columns.filter(col => utils.hasCmlAccesToColumn(myInfo.permissions, col));
    }
    for (let col of accessibleColumns) {
        doc.renderOption(searchSelect, col.id, col.name);
    }
}
//# sourceMappingURL=positionsController.js.map