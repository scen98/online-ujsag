import { Article, selectArticlesByState } from "./objects/article.js"
import { getColumns, Column } from "./objects/column.js";
import * as doc from "./doc.js";
import * as utils from "./utils.js";
import{ Token, selectAccessibleTokens, selectTokensByColumn, selectActiveTokensByColumn } from "./objects/token.js";
import { Author, getMyInfo } from "./objects/author.js";

let articleTable: HTMLDivElement = doc.getDiv("article-table");
let columnSelect: HTMLSelectElement = doc.getSelect("column-select");
let articles: Article[] = [];
let columns: Column[] = [];
let tokens: Token[] = []; //aktív tokenek
let myAccessibleTokens: Token[] = [] //tokenek amikhez nekünk van jogosultságunk
let articlePerPage: number = 15;
let searchInput: HTMLInputElement = doc.getInput("search");
let stateSelect: HTMLSelectElement = doc.getSelect("state-select");
let tokenSelect: HTMLSelectElement = doc.getSelect("token-select");
let excludeLocked: HTMLInputElement = doc.getInput("exclude-locked");
let myInfo: Author;
init();
async function init(){
    stateSelect.value = "1";
    searchInput.value = "";
    await Promise.all([setColumns(), setMyInfo(), setMyAccessibleTokens(), initElements()]);
    renderColumnSelect();
    renderMyAccessibleTokens();
    await Promise.all([setArticles(), setTokens()]);
    renderArticles();
    displayExpandBtn(articles);
}

async function setMyInfo(){
    myInfo = await getMyInfo();
}

async function setColumns(){
    columns = await getColumns();
}

async function setMyAccessibleTokens(){
    myAccessibleTokens = await selectAccessibleTokens();
}

function renderMyAccessibleTokens(){
    tokenSelect.innerHTML = "";
    doc.renderOption(tokenSelect, "0", "---");
    if(columnSelect.value === "0"){
        renderAccessibleTokensForAllColumns();
    } else {
        renderAccessibleTokensForOneColumn();
    }
}

function renderAccessibleTokensForAllColumns(){
    for (let token of myAccessibleTokens.filter(t=> t.status != 0)) {
        doc.renderOption(tokenSelect, token.id.toString(), `${token.name} / ${columns.find(c=> c.id === token.columnId).name}`);
    }
}

function renderAccessibleTokensForOneColumn(){
    for (let token of myAccessibleTokens.filter(t=> t.status != 0 && (t.columnId === 0 || t.columnId === parseInt(columnSelect.value)))) {
        doc.renderOption(tokenSelect, token.id.toString(), `${token.name} / ${columns.find(c=> c.id === token.columnId).name}`);
    }
}

function initElements(){
    doc.addChange(tokenSelect, renderArticles);
    doc.addChange(excludeLocked, renderArticles);
    doc.addClick("search-btn", search);
    doc.addClick("expand-btn", expand);
    doc.addChange(stateSelect, search);
    doc.addChange(columnSelect, ()=>{ 
        renderMyAccessibleTokens();
        search();
    } );
    doc.addChange(tokenSelect, search);
    addSearchListener();
}

async function setArticles(){
    articles = await selectArticlesByState(searchInput.value, articlePerPage, 0, parseInt(columnSelect.value), parseInt(stateSelect.value));
}

async function setTokens(){
    tokens = await selectActiveTokensByColumn(parseInt(columnSelect.value));
}

async function expand(){
    try {
        let newArticles = await selectArticlesByState(searchInput.value, articlePerPage, articles.length, parseInt(columnSelect.value), parseInt(stateSelect.value));
        articles = articles.concat(newArticles);
        renderArticles();
        displayExpandBtn(newArticles);
        
    }
    catch {
        doc.get("expand-btn").style.display = "none";
    }  
}

async function search(){
    await setArticles();
    renderArticles();
    displayExpandBtn(articles);
}

function editArticle(article: Article){
    if(article.state > 0){
        window.location.href =  `../amp/cikk_szerk_x.php?aid=${article.id}`;
    } else {
        window.location.href =  `../amp/cikk.php?aid=${article.id}&by=${article.authorName}`;
    }
}

function switchChangeStateBtn(oldButton: HTMLButtonElement, article: Article){
    let newButton = doc.create("button", null, ["red", "awaitArticleButton"], "Visszaküldés");
    newButton.addEventListener("click", function() { changeState(article); });
    oldButton.parentNode.replaceChild(newButton, oldButton);
    setTimeout(()=> { newButton.parentNode.replaceChild(oldButton, newButton); }, 5000);
}

function changeState(article: Article){
    article.state = article.state - 1;
    article.updateState();
    doc.remove(article.id.toString());
    articles = articles.filter(a => a.id !== article.id);
}

function renderArticles(){
    articleTable.innerHTML = "";
    if(parseInt(stateSelect.value) === 0){
        render0StateArticles();
    } else {
        renderHigherStateArticles();
    }
}

function render0StateArticles(){
    for (var art of articles.filter(a=> !a.hasTokenInstance(new Token(parseInt(tokenSelect.value))))) {
        renderRow(art)
    }
}

function renderHigherStateArticles(){
    for (var art of articles.filter(a=> !a.hasTokenInstance(new Token(parseInt(tokenSelect.value))))) {
        if(isEditable(art) == excludeLocked.checked) renderRow(art); 
    }
}

function addSearchListener(){
    let input = doc.get("search");
    doc.addEnter(input, () => { document.getElementById("search-btn").click(); });
}

function renderColumnSelect(){
    let highestPerm = myInfo.getHighestPermission();
    let accessibleColumns = [];
    if(highestPerm >= 40){ 
        let all = { id: 0, name: "Mind" }
        accessibleColumns = columns;
        accessibleColumns.unshift(all);
    } else {
        accessibleColumns = columns.filter(col => utils.hasCmlAccesToColumn(myInfo.permissions, col));
    }
    
    for (let column of accessibleColumns) {
        doc.renderOption(columnSelect, column.id, column.name);
    }
}

function renderRow(article: Article){
    let title:HTMLAnchorElement;
    let container = doc.createDiv(article.id.toString(), ["awaitArticleContainer"]);
    if(article.state < 1){
        title = doc.createA(["awaitArticleTitle"], article.title, `../amp/cikk.php?aid=${article.id}&by=${article.authorName}`);
    } else if(article.state === 1){
        title = doc.createA(["awaitArticleTitle"], article.title, `../amp/cikk_szerk_x.php?aid=${article.id}`);
    } else {
        title = doc.createA(["awaitArticleTitle"], article.title, encodeURI(`../cikk.php?aid=${article.id}&cid=${article.columnId}&rovat=${columns.find(c=> c.id === article.columnId).name}`))
        title.target = "blank";
    }

    let table = doc.createTable(["awaitArticleTable"]);
    doc.renderTableRow(table, [doc.createA(["awaitArticleAuthorName"], article.authorName, `../amp/szerzo.php?szerzo=${article.authorId}`).outerHTML, getColumnNameById(article.columnId), doc.parseDateHun(article.date)]);
    let lockDiv = renderLock(article);
    let changeStateBtn: HTMLButtonElement;
    let editBtn: HTMLAnchorElement;
    if(article.state > 0){
        changeStateBtn = doc.createButton(["awaitArticleButton", "red"], '<i class="fas fa-backspace"></i>', () => { switchChangeStateBtn(changeStateBtn, article); });
        doc.append(container, [title, table, changeStateBtn, lockDiv]);
    } else {
        doc.append(container, [title, table, lockDiv]);
    }
    if(article.state > 1){
        editBtn = doc.createA(["anchor-btn", "blue"], '<span><i class="fas fa-edit"></i></span>', `../amp/cikk_szerk_x.php?aid=${article.id}`);
        doc.append(container, [editBtn])
    }
    
    renderTokenInstances(container, article);
    articleTable.appendChild(container);
}

function renderTokenInstances(container: HTMLDivElement, article: Article){
    for (let token of tokens) {
        if(isTokenNecessary(token, article)) renderTokenInstance(container, article, token);
    }
}

function renderTokenInstance(container: HTMLDivElement, article: Article, token: Token){
    let tokenDiv = doc.createDiv(null, ["redAwaitingToken"]);
        if(article.hasTokenInstance(token)){
            tokenDiv.className = "greenAwaitingToken";
        }
        tokenDiv.innerText = token.name;
        doc.append(container, [tokenDiv]);
}

function isTokenNecessary(token: Token, article: Article){
    if(token.columnId === 0) return true;
     return article.columnId === token.columnId;
}

function renderLock(article: Article){
    let lockDiv = doc.createDiv(null, ["lock"]);
    if(article.isLocked){
        lockDiv.innerHTML = '<i class="fas fa-lock"></i>';
        if(article.lockedBy === myInfo.permissions[0].authorId){
            lockDiv.classList.add("locked-by-me");
            lockDiv.title = "Ön által lezárva";
        } else {
            lockDiv.classList.add("locked-from-me");
            lockDiv.title = "Más felhasználó által lezárva";
        }
    } else {
        lockDiv.innerHTML = '<i class="fas fa-lock-open"></i>';
        lockDiv.classList.add("not-locked");
        lockDiv.title = "Nyitott";
    }
    return lockDiv;
}

function isEditable(article: Article){
    if(!article.isLocked) return true;
    if(article.lockedBy === myInfo.permissions[0].authorId) return true;
    return false;
}

function getColumnNameById(columnId: number){
    var result = columns.find(c => c.id == columnId);
    return result.name;
}
function displayExpandBtn(articleData: Article[]){
    if(articleData.length < articlePerPage){
        document.getElementById("expand-btn").style.display = "none";
    } else {
        document.getElementById("expand-btn").style.display = "inline";
    }
}
