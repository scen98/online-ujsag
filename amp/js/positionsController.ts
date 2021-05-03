import { getColumns, Column } from "./objects/column.js";
import * as doc from "./doc.js";
import * as utils from "./utils.js";
import { Position, selectByBlock } from "./objects/position.js";
import { Article, selectArticlesByState, selectArticles }from "./objects/article.js";
import { PositionBlock, updateBlock, selectByColumn } from "./objects/positionBlock.js";
import { Author, getMyInfo } from "./objects/author.js";
let articleTable: HTMLDivElement = doc.getDiv("article-table");
let positionTable: HTMLDivElement = doc.getDiv("position-table");
let columnSelect: HTMLSelectElement = doc.getSelect("column-select");
let blockSelect: HTMLSelectElement = doc.getSelect("block-select");
let columns: Column[] = [];
let blocks: PositionBlock[] = [];
let articles: Article[] = [];
let archivedArticles: Article[] = []; //azok a cikkek, amik már archív státuszban vannak, de még jelen vannak az újságban
let searchSelect: HTMLSelectElement = doc.getSelect("search-select");
let searchInput: HTMLInputElement = doc.getInput("search-input");
let myInfo: Author;

init();
async function init(){
    myInfo = await getMyInfo(); 
    await setColumns();
    await Promise.all([setArticles(), setBlocks()]);
    await setArchives();
    await Promise.all([renderPositions(), renderArticles()]);
    initListeners();
}

async function setColumns(){
    columns = await getColumns();
    let highestPerm = myInfo.getHighestPermission();
    if(highestPerm >= 40){ 
        let all = { id: 0, name: "Címlap" }
        columns.unshift(all);
    } else {
        columns = columns.filter(col => utils.hasCmlAccesToColumn(myInfo.permissions, col));
    }
    renderColumnSelect(columnSelect);
    renderColumnSearch();
}

async function setArticles(){
    articles = await selectArticlesByState("", 100000, 0, parseInt(columnSelect.value), 2);
}

async function setBlocks(){
    blocks = await selectByColumn(parseInt(columnSelect.value));
    renderBlockSelect();
}

async function setArchives(){
    archivedArticles = await selectArticles(getArchivedIds());
    articles = articles.concat(archivedArticles);
}

async function changeColumn(){
    await Promise.all([setArticles(), setBlocks()]);
    await setArchives();
    await Promise.all([renderPositions(), renderArticles()]);
}

function renderBlockSelect(){
    blockSelect.innerHTML = "";
    for (let block of blocks) {
        doc.renderOption(blockSelect, block.id.toString(), block.name);
    }
}

function initListeners(){
    doc.addChange(columnSelect, changeColumn);
    doc.addChange(blockSelect, renderPositions);
    doc.addChange(searchInput, searchArticles);
    doc.addChange(searchSelect, searchArticles);
    doc.addClick("search-btn", searchArticles);
    doc.addClick(doc.getBtn("save-btn"), save);
    doc.addClick(doc.getBtn("reset-btn"), resetBlocks);
}

async function resetBlocks(){
    blocks = await selectByColumn(parseInt(columnSelect.value));
    await Promise.all([renderPositions(), renderArticles()]);
}

async function save(){
    let toSave = blocks.find(b=> b.id === parseInt(blockSelect.value));
    if(await updateBlock(toSave)){
        //majd vmi success message
    } else {
        alert("Mentés sikertelen.");
    }
}

function searchArticles(){
    let results = articles;
    if(parseInt(searchSelect.value) !== 0){
        results = results.filter(a=> a.columnId === parseInt(searchSelect.value));
    }
    if(searchInput.value !== "" && searchInput.value != null && searchInput.value != undefined){
        let keyword = searchInput.value.toLowerCase();
        results = results.filter(a=> a.title.toLowerCase().includes(keyword) || a.lead.toLowerCase().includes(keyword) || a.authorName.toLowerCase().includes(keyword));
    }
    articleTable.innerHTML = "";
    for (let art of results) {
        renderArticle(art);
    }
}

function renderColumnSelect(select: HTMLSelectElement){
    for (let col of columns) {
        doc.renderOption(select, col.id.toString(), col.name);
    }
}

function renderArticles(){ 
    articleTable.innerHTML = "";
    for (let art of articles) {
        renderArticle(art);
    }
}   

function renderArticle(article: Article){
    doc.append(articleTable, [createArticleElement(article)]);
}

function createArticleElement(article: Article): HTMLDivElement{
    let container = doc.createDiv(article.id.toString(), ["positionArticleContainer"]);
    let title = doc.createA(["positionArticleTitle"], article.title, `./cikk_szerk_x.php?aid=${article.id}`);
    let table = document.createElement("table");
    let editBtn = doc.createButton(["positionArticleButton", "blue"], '<i class="fas fa-edit"></i>', ()=>{
        openEditor(article);
    });
    let archiveBtn: HTMLElement;
    if(article.state < 3){
        archiveBtn = doc.createButton(["positionArticleButton", "yellow"], '<i class="fas fa-archive"></i>', ()=>{
            archiveArticle(article);
        });
    } else {
        archiveBtn = doc.createP(["positionArticleArchive"], "Archív");
    }
    
    let stateBackBtn: HTMLElement;
    if(article.state > 1){
        stateBackBtn = doc.createButton(["positionArticleButton", "red"], '<i class="fas fa-share"></i>', ()=>{
            setStateBack(article);
            refreshArticleElement(article.id);
        });
    } else {
        stateBackBtn = doc.createDiv(null, []);
    }
    let positionNames = doc.createDiv(null, []);
    for (let name of getPositionNames(article.id)) {
        positionNames.appendChild(createPositionName(name));
    }
    doc.addDrag(container, article);
    doc.renderTableRow(table, [columns.find(c=> c.id === article.columnId).name, doc.createA([], article.authorName, `../amp/szerzo.php?szerzo=${article.authorId}`).outerHTML, doc.parseDateHun(article.date)]);
    doc.append(container, [title, editBtn, archiveBtn, stateBackBtn, table, positionNames]);
    return container;
}

function createPositionName(name: string){
    let positionElement =  doc.createP(["articlePosition"], name);
    doc.addClick(positionElement, ()=>{
        blockSelect.value = blocks.find(b=> b.name === name.split(":")[0]).id.toString(); //igen, ez elég szörnyű, de csak így nem kell átírni 3 másik functiont
        renderPositions();
    });
    return positionElement;
}

function getPositionNames(articleId: number): string[]{
    let names: string[] = [];
    for (let block of blocks) {
        names = names.concat(getPositionNameByArticleId(block, articleId));
    }
    return names;
}

function getPositionNameByArticleId(block: PositionBlock, articleId: number): string[]{
    let names: string[] = [];
    for (let pos of block.positions) {
        if(pos.articleId === articleId) names.push(`${block.name}: ${pos.name}`);
    }
    return names;
}

function openEditor(article: Article){
    window.open(`./cikk_szerk_x.php?aid=${article.id}`);
}

async function archiveArticle(article: Article){
    article.state = 3;
    if(await article.updateState()){
        refreshArticleElement(article.id)
    } else {
        alert("Hiba a kérelem feldolgozásakor");
    }
    
}

async function setStateBack(article: Article){
    article.state--;
    if(await article.updateState()){
        refreshArticleElement(article.id);
    } else {
        alert("Hiba a kérelem feldolgozásakor.");
    }    
}

function getArchivedIds(){
    let archiveIds = [];
    for (let b of blocks) { //undorító
        for (let position of b.positions) {
            if(position.articleId != null){
                if(!articles.some(a=> a.id === position.articleId)) archiveIds.push(position.articleId);
            }
        }
    }
    return archiveIds;
}

function renderPositions(){
    positionTable.innerHTML = "";
    let selectedBlock : PositionBlock = blocks.find(b=> b.id === parseInt(blockSelect.value));
    for (let position of selectedBlock.positions) {
        renderPosition(position, selectedBlock);
    }
}

function renderPosition(position: Position, block: PositionBlock){
    let container = doc.createDiv("pos"+position.id, ["positionContainer"]);
    let name = doc.createP(["positionName"], position.name);
    let positionSpace = doc.createDiv(null, ["positionSpace"]);
    let oldId: number; //drophoz kell, hogy a updatelhessük azt a cikket is ami az update előtt volt megadva
    doc.addDrop(positionSpace, (article: Article)=>{ //ez nem igazi Article, mert JSON.parse() készíti nekünk        
        oldId = position.articleId; 
        position.articleId = article.id;
        article.date = new Date(article.date); //szóval a date stringből megint datet kell csinálnunk
        if(container.childNodes.length > 2){
            container.removeChild(container.childNodes[2]);
            container.removeChild(container.childNodes[2]);
        }
        renderPositionButtons(container, positionSpace, position, block);
        renderPositionSpace(positionSpace, article);
        if(oldId) refreshArticleElement(oldId);
        if(position.articleId) refreshArticleElement(position.articleId);
    });
    doc.append(container, [name, positionSpace]);
    if(position.articleId != null){
        renderPositionButtons(container, positionSpace, position, block);
        renderPositionSpace(positionSpace, articles.concat(archivedArticles).find(a=> a.id === position.articleId));
    }
    doc.append(positionTable, [container]);
}

function refreshArticleElement(articleId: number){
    let toDelete = doc.get(articleId.toString());
    toDelete.parentNode.replaceChild(createArticleElement(articles.find(a=> a.id === articleId)), toDelete);
}

function renderPositionButtons(container: HTMLDivElement, positionSpace: HTMLDivElement, position: Position, block: PositionBlock){
    let oldId = position.articleId;
    let emptyBtn = doc.createButton(["positionArticleButton", "red"], '<i class="far fa-folder-open"></i>', ()=>{    
        emptyPosition(container, position, positionSpace);
        refreshArticleElement(oldId);
    });
    let sortDown = doc.createButton(["positionArticleButton", "green"], '<i class="fas fa-chevron-circle-down"></i>', ()=>{
        pushDown(position, block);
        renderArticles();
    });
    doc.append(container, [sortDown, emptyBtn]);
}

function pushDown(position: Position, block: PositionBlock){
    let index = block.positions.findIndex(p=> p.id === position.id);
    let i = block.positions.length-1;
    while(i > index){
        block.positions[i].articleId = block.positions[i-1].articleId;
        i--;
    }
    block.positions[index].articleId = null;
    renderPositions();
}

function emptyPosition(container: HTMLDivElement, position: Position, positionSpace: HTMLDivElement){
    container.removeChild(container.childNodes[2]);
    container.removeChild(container.childNodes[2]);
    position.articleId = null;
    positionSpace.innerHTML = "";
}

function renderPositionSpace(parent: HTMLElement, article: Article){
    parent.innerHTML = "";
    let container = doc.createDiv(null, ["innerContainer"]);
    let title = doc.createA(["positionArticleTitle"], article.title, `./cikk_szerk_x.php?aid=${article.id}`);
    let table = document.createElement("table");
    doc.addDrag(container, article);
    doc.renderTableRow(table, [columns.find(c=> c.id === article.columnId).name, doc.createA([], article.authorName, `../amp/szerzo.php?szerzo=${article.authorId}`).outerHTML, doc.parseDateHun(article.date)]);
    doc.append(container, [title, table]);
    doc.append(parent, [container]);
}

function renderColumnSearch(){
    let highestPerm = myInfo.getHighestPermission();
    let accessibleColumns = [];
    if(highestPerm >= 40){ 
        let all = { id: 0, name: "Mind" }
        accessibleColumns = columns;
        accessibleColumns[0] = all;
    } else {
        accessibleColumns = columns.filter(col => utils.hasCmlAccesToColumn(myInfo.permissions, col));
    }
    for (let col of accessibleColumns) {
        doc.renderOption(searchSelect, col.id, col.name);
    }
}
