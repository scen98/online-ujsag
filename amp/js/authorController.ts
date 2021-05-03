import * as doc from "./doc.js";
import * as utils from "./utils.js";
import { Author, getMyInfo, permissionName, selectAuthor, selectAuthorByName } from "./objects/author.js";
import { Article, selectByAuthorId } from "./objects/article.js";
import { Column, getColumns } from "./objects/column.js";
let tokenPermissionTable: HTMLUListElement = doc.getUl("token-permission-list");
let searchInput: HTMLInputElement = doc.getInput("search-input");
let columnSelect: HTMLSelectElement = doc.getSelect("column-select");
let articleTable: HTMLDivElement = doc.getDiv("article-container");
let stateSelect: HTMLSelectElement = doc.getSelect("state-select");
let author: Author;
let columns: Column[] = [];
let articlePerPage = 15;
let articles: Article[] = [];
let myInfo: Author;
init();

async function init(){
    await Promise.all([setArticles(), setAuthor(), setColumns(), setMyInfo(), initElements()]);
    renderArticles();  
}

async function setAuthor(){
    author = await selectAuthor(parseInt(utils.getUrlParameter("szerzo")));
    renderAuthor();
}

async function setMyInfo(){
    myInfo = await getMyInfo();
}

async function setArticles(){
    let newArticles = await selectByAuthorId(parseInt(utils.getUrlParameter("szerzo")), "", parseInt(stateSelect.value),  parseInt(columnSelect.value), articlePerPage, 0);
    articles = articles.concat(newArticles);
    displayExpandBtn(newArticles);
}

async function setColumns(){
    columns = await getColumns();
    renderColumns();
}

function renderColumns(){
    for (let column of columns) {
        doc.renderOption(columnSelect, column.id.toString(), column.name);
    }
}

function initElements(){
    doc.addClick("search-btn", search);
    doc.addClick("expand-btn", expand);
    doc.addChange("state-select", search);
    doc.addChange("column-select", search);
    doc.addChange(searchInput, search);
}

function renderAuthor(){
    doc.setText("author-name", author.userName);
    if(author.permissions != null && author.permissions.length > 0) author.permissions.forEach(p=> renderAuthorPermission(p));
    if(author.tokenPermissions != null && author.tokenPermissions.length > 0){
        renderTokenPermissions();
    } else {
        doc.get("token-permission-title").style.display = "none";
    }
}

function renderAuthorPermission(permission){
    let column: Column = columns.find(c=> c.id === permission.columnId);
    let columnName : string;
    if(column != null){
        columnName = `(${column.name})`;
    } else {
        columnName = "";
    }
    doc.renderLi("permission-list", `${permissionName(permission)} ${columnName}`);
}

async function search(){
    let newArticles = await selectByAuthorId(author.id, searchInput.value, parseInt(stateSelect.value), parseInt(columnSelect.value), articlePerPage, 0);
    articles = newArticles;
    renderArticles();
    displayExpandBtn(newArticles);
}

async function expand(){
    try {
        let newArticles = await selectByAuthorId(author.id, searchInput.value, parseInt(stateSelect.value), parseInt(columnSelect.value), articlePerPage, articles.length);
        articles = articles.concat(newArticles);
        expandArticles(newArticles);
    }
    catch {
        doc.get("expand-btn").style.display = "none";
    }  
}

function renderArticles(){
    articleTable.innerHTML = "";
    for (var art of articles) {
        renderRow(art);
    }
}

function expandArticles(articleData: Article[]){
    if(articleData.length > 0){
        renderArticles();     
    } 
    displayExpandBtn(articleData);
}

function renderRow(article: Article){
    let container = doc.createDiv(article.id.toString(), ["awaitArticleContainer"]);
    let title = doc.createA(["awaitArticleTitle"], article.title, `../amp/cikk.php?aid=${article.id}&by=${encodeURIComponent(author.userName)}`);
    let lead = doc.createP(["articleLead"], article.lead);
    let table = doc.createTable(["awaitArticleTable"]);
    doc.renderTableRow(table, [getColumnNameById(article.columnId), doc.parseDateHun(article.date)]);
    doc.append(container, [title, lead, table]);
    if(isArticleEditable(article)){
        renderEditBtn(container, article);
    } 
    articleTable.appendChild(container);
}

function renderTokenPermissions(){
    for (let tokenPermission of author.tokenPermissions) {
        doc.renderLi("token-permission-list", tokenPermission.tokenName);
    }
}

function renderEditBtn(parent: HTMLElement, article: Article){
    let button = doc.createButton(["awaitArticleButton", "blue"], '<i class="fas fa-edit"></i>', ()=>{
        window.open(`../amp/cikk_szerk_x.php?aid=${article.id}`);
    });
    parent.appendChild(button);
}

function getColumnNameById(columnId: number){
    var result = columns.find(c => c.id == columnId);
    return result.name;
}

function isArticleEditable(article: Article){
    if(article.state < 1) return false;
    if(myInfo.getHighestPermission() >= 40) return true;        
    return myInfo.permissions.some(p=> p.columnId === article.columnId);
}

function displayExpandBtn(articleData: Article[]){
    if(articleData.length < articlePerPage || articleData.length === 0){
        document.getElementById("expand-btn").style.display = "none";
    } else {
        document.getElementById("expand-btn").style.display = "inline";
    }
}