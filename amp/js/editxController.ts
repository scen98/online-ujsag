import { Article, selectArticle } from "./objects/article.js";
import { Token, selectActiveTokensByColumn } from "./objects/token.js";
import { getColumns, Column } from "./objects/column.js";
import * as doc from "./doc.js";
import { TokenInstance } from "./objects/tokenInstance.js";
import * as utils from "./utils.js";
import { TokenPermission } from "./objects/permission.js";
import { Author, getMyInfo } from "./objects/author.js";
let columns: Column[] = [];
let columnSelect: HTMLSelectElement = doc.getSelect("column-select");
let title: HTMLInputElement = doc.getInput("title");
let lead:HTMLInputElement = doc.getInput("lead");
let imgPath: HTMLInputElement = doc.getInput("img-path");  
let text: HTMLIFrameElement = document.getElementById("txtField") as HTMLIFrameElement;
let article: Article;
let message = document.getElementById("message");
let deleteModal:HTMLDivElement = doc.getDiv("delete-modal");
let state = document.getElementById("state");
let lockMessage = document.getElementById("lock-message");
let lockBtn: HTMLButtonElement = doc.getBtn("lock-btn");
let necessaryTokens: Token[] = [];
let tokenTable = document.getElementById("token-table");
let stateSelect: HTMLSelectElement = doc.getSelect("state-select");
let stateModal: HTMLDivElement = doc.getDiv("state-modal");
let myInfo: Author;

init();
async function init(){
    await Promise.all([setArticle(), setColumns(), setMyInfo()]);
    await setNecessaryTokens();
    renderOptions(columns);
    refreshArticle();
    renderTokens();
    initListeners();
}

async function setMyInfo(){
    myInfo = await getMyInfo();
    //setMyTokenPermissions(myInfo);
}

async function setColumns(){
    columns = await getColumns();
}

async function setArticle(){
    article = await selectArticle(parseInt(utils.getUrlParameter("aid")));
}

async function setNecessaryTokens(){
    necessaryTokens = await selectActiveTokensByColumn(article.columnId);
}

function initListeners(){
    doc.addClick(doc.get("open-img-path-btn"), openImgPath);
    doc.addClick(lockBtn, switchLock);
    doc.addClick("check-btn", checkState);
    doc.addClick("save-article-button", saveArticle);
    doc.addClick("change-close-span", hideStateModal);
    doc.addClick("save-state-btn", saveState);
    doc.addClick("hide-state-modal-btn", hideStateModal);
}

async function saveArticle(){
    setArticle();
    setArticleProperties();
    if(await article.update()){
        refreshMessage();
    } else {
        alert("Cikk mentése sikertelen");
    }
}

function displayStateModal(){
    stateModal.style.display = "block";
}

function hideStateModal(){
    stateModal.style.display = "none";
}

window.onclick = function(event){
    if(event.target == deleteModal){
        deleteModal.style.display = "none";
    }
    if(event.target == stateModal){
        stateModal.style.display = "none";
    }
}

function openImgPath(){
    window.open(imgPath.value);
}

async function switchLock(){
    if(!await article.switchLock(myInfo.permissions[0].authorId)){
        alert("Hozzáférés megtagadva.");
        return;
    }
    setState();
    if(!article.isLocked){
        setArticleProperties();
        article.update();
        refreshMessage();
    }
}

function checkState(){
    article.state = parseInt(stateSelect.value);
    if(!article.hasAllTokenInstances(necessaryTokens) && article.state > 1){
        displayStateModal();
    } else {
        article.updateState();
    }
}

function saveState(){
    article.updateState();
    hideStateModal();
}

function renderTokens(){
    for (let token of necessaryTokens) {
        renderToken(token);
    }
}

function renderToken(token: Token){
    let container = doc.createDiv("token"+token.id, ["tokenContainer"]);
    let name = doc.createP(["tokenName"], token.name);
    let doesExist = article.hasTokenInstance(token);
    let hasAccess = hasAccessToToken(token);
    doc.append(container, [name]);
    if(doesExist && hasAccess){ 
        renderExistingTokenElements(token, container);
    } else if(!doesExist && hasAccess) {
        renderNonExistingTokenElements(token, container);
    } else {
        container.classList.add("redToken");
    }
    doc.append(tokenTable, [container]); 
}

function renderNonExistingTokenElements(token: Token, tokenContainer: HTMLDivElement){
    let addBtn =  doc.createButton(["tokenButton", "green"], '<i class="fas fa-plus-square"></i>', ()=>{
        insertTokeninstanceCommand(new TokenInstance(0, article.id, token.id, myInfo.id, myInfo.userName, new Date()));
    });
    tokenContainer.classList.add("redToken");
    
    doc.append(tokenContainer, [addBtn]);
}

async function insertTokeninstanceCommand(newTokenInstance: TokenInstance){
    await newTokenInstance.insert();
    article.tokenInstances.push(newTokenInstance);
    tokenTable.innerHTML = "";
    for (let token of necessaryTokens) {
        renderToken(token);
    }
}

function renderExistingTokenElements(token: Token, tokenContainer: HTMLDivElement){
    let tokenInstance = article.tokenInstances.find(t=> t.tokenId === token.id);
    let deleteBtn =  doc.createButton(["tokenButton", "red"], '<i class="fas fa-minus-circle"></i>', ()=>{
        switchDeleteButton(deleteBtn, tokenInstance);
    });
    tokenContainer.classList.add("green");
    
    let tokenAuthor = doc.createP(["tokenInfo"], tokenInstance.authorName + ": ");
    let tokenDate = doc.createP(["tokenInfo"], doc.parseDateHun(tokenInstance.date));
    doc.append(tokenContainer, [tokenAuthor, tokenDate, deleteBtn]);
    
}

function switchDeleteButton(oldButton: HTMLButtonElement, toDelete: TokenInstance){
    let newBtn = doc.createButton(["tokenButton", "red"], "Eltávolít", ()=>{
        deleteTokenInstanceCommand(toDelete);
    });
    oldButton.parentNode.replaceChild(newBtn, oldButton);
    setTimeout(()=> { newBtn.parentNode.replaceChild(oldButton, newBtn); }, 5000);
}

async function deleteTokenInstanceCommand(toDelete: TokenInstance){
    if(!await toDelete.delete()){
        alert("A művelet végrehajtása sikertelen.");
    }
    article.tokenInstances = article.tokenInstances.filter(t=> t.id !== toDelete.id);
    tokenTable.innerHTML = "";
    for (let token of necessaryTokens) {
        renderToken(token);
    }
}

function hasAccessToToken(token: Token){
    if(myInfo.permissions[0].level >= 40){
        return true;
    }
    if(myInfo.getHighestPermission() >= 30){
        if(myInfo.permissions.some(p=> p.columnId === token.columnId)) return true;
    }
    return myInfo.tokenPermissions.some(ti=> ti.tokenId === token.id);
}

function refreshMessage(){    
    let d = new Date();
    message.innerHTML = `Legutóbb mentve: ${doc.parseDatehhdd(d)}`;
}

function refreshArticle(){
    title.value = article.title;
    lead.value = article.lead;
    imgPath.value = article.imgPath;
    columnSelect.value = article.columnId.toString();
    text.contentWindow.document.body.innerHTML = article.text;
    stateSelect.value = article.state.toString();
    setState();
}

function setState(){
    if(!article.isLocked){
        openState();
    } else if(article.isLocked && article.lockedBy == myInfo.permissions[0].authorId){
        closeState();
    } else {
        noAccessState();
    }
}

function openState(){
    state.innerText = "Nyitott";
    state.className = "unlocked";
    lockMessage.innerText = "A szerkesztés megkezdésekor a rendszer zárt állapotba helyezi azt, ezzel meggátolva hogy más felhasználók is módosításokat hajtsanak végre, amíg ön ezt a zárat fel nem oldja.."
    lockBtn.style.display = "block";
    lockBtn.innerHTML = "Szerkesztés megkezdése";
    lockBtn.className = "lockBtn";
    setArticle();
    toggleEditOff();
}

function closeState(){
    state.innerText = "Zárt";
    state.className = "locked";
    lockMessage.innerText = "A cikkhez jelen pillanatban csak ez a felhasználó fér hozzá.";
    lockBtn.innerHTML = "Szerkesztés befejezése";
    lockBtn.className = "unlockBtn";
    toggleEditOn();
}

function noAccessState(){
    state.innerText = "Más által zárolva.";
        lockMessage.innerText = "A cikk egy másik felhasználó által lett zárolva, így addig nem végezhető változtatás, amíg azt ő fel nem oldja."
        document.getElementById("lock-btn").style.display = "none";
        toggleEditOff();
}

function setArticleProperties(){
    article.title = title.value;
    article.lead = lead.value;
    article.imgPath = imgPath.value;
    article.columnId = parseInt(columnSelect.value);
    article.text = text.contentWindow.document.body.innerHTML;

}

function renderOptions(columnArray: Column[]){
    let highestPerm = myInfo.getHighestPermission();
    if(highestPerm < 40){ 
        columnArray = columnArray.filter(col => utils.hasCmlAccesToColumn(myInfo.permissions, col));
    }
    for (let col of columnArray) {
        doc.renderOption(columnSelect, col.id.toString(), col.name);
    }
}

function toggleEditOn(){
    text.contentWindow.document.designMode = "On";
}

function toggleEditOff(){
    text.contentWindow.document.designMode = "Off";
}