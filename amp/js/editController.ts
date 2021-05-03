import { Article, selectArticle } from "./objects/article.js";
import * as doc from "./doc.js";
import { getColumns, Column } from "./objects/column.js";
let columnSelect: HTMLSelectElement = doc.getSelect("column-select"); 
let title: HTMLInputElement = doc.getInput("title"); <HTMLInputElement>document.getElementById("title");
let lead: HTMLInputElement = doc.getInput("lead"); <HTMLInputElement>document.getElementById("lead");
let imgPath: HTMLInputElement = doc.getInput("img-path");  
let text: HTMLIFrameElement = document.getElementById("txtField") as HTMLIFrameElement;
let article: Article;
let message: HTMLElement = doc.get("message");
let modal: HTMLDivElement =doc.getDiv("myModal");
let stateSelect = <HTMLInputElement>document.getElementById("state-select");
let columns: Column[] = [];
doc.addClick("change-state-button", updateState);
doc.addClick("save-article-button", saveArticle);
doc.addClick("delete-btn", displayDeleteModal);
doc.addClick("delete-article-btn", deleteArticle);
doc.addClick("open-img-path-btn", openImgPath);
doc.addClick("hide-modal-btn1", hideDeleteModal);
doc.addClick("hide-modal-btn2", hideDeleteModal);
init();

function init(){
   Promise.all([setArticle(), setColumns()]);
}

async function setColumns(){
    columns = await getColumns();
    renderOptions(columns);
}

async function setArticle(){
    article = await selectArticle(getId());
    renderArticle();
}

async function saveArticle(){
    setArticleProperties();
    if(await article.update()){
        refreshMessage();
    } else {
        alert("A cikk mentése szerver oldali hiba miatt sikertelen.");
    }
}

function displayDeleteModal(){
    modal.style.display = "block";
}

function hideDeleteModal(){
    modal.style.display = "none";
}

window.onclick = function(event){
    if(event.target == modal){
        modal.style.display = "none";
    }
}

async function deleteArticle(){
    if(await article.delete()){
        onDelete();
    } else {
        alert("A cikk törlése szerver oldali hiba miatt sikertelen.");
    }
}

function openImgPath(){
    window.open(imgPath.value);
}

async function updateState(){
    article.state = parseInt(stateSelect.value);
    if(!await article.updateState()){
        alert("A státusz beállítása szerver oldali hiba miatt sikertelen.");
    }
    displayDeleteBtn();
}

function onDelete(){
    window.location.href = "../amp/cikkeim.php";
}

function refreshMessage(){    
    let d = new Date();
    message.innerHTML = "Legutóbb mentve: "+d.getHours() + ":" + d.getMinutes();
}

function renderArticle(){
    title.value = article.title;
    lead.value = article.lead;
    imgPath.value = article.imgPath;
    text.contentWindow.document.body.innerHTML = article.text;
    stateSelect.value = article.state.toString();
    if(article.state > 1){
        stateSelect.style.display = "none";
        doc.get("change-state-button").style.display = "none";
    } 
    columnSelect.value = article.columnId.toString();
    enableEditMode();
    displayDeleteBtn();
}

function displayDeleteBtn(){
    if(article.state === -1){
        doc.setDisplay("delete-btn", "inline");
    } else {
        doc.setDisplay("delete-btn", "none");
    }
}

function setArticleProperties(){
    article.title = title.value;
    article.lead = lead.value;
    article.imgPath = imgPath.value
    article.columnId = parseInt(columnSelect.value);
    article.text = text.contentWindow.document.body.innerHTML;
    article.state = parseInt(stateSelect.value);
}

function getId(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return parseInt(urlParams.get("aid"));
}

function renderOptions(columnArray: Column[]){  
    for (let col of columnArray) {
        doc.renderOption(columnSelect, col.id.toString(), col.name);
    }
}

function enableEditMode() {
    text.contentWindow.document.designMode = "On";
}

