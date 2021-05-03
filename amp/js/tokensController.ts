import { Token, selectAccessibleTokens } from "./objects/token.js";
import { getColumns, Column } from "./objects/column.js";
import * as utils from "./utils.js";
import * as doc from "./doc.js";
import { Author, getMyInfo } from "./objects/author.js";
let tokenTable: HTMLDivElement = doc.getTable("token-table");
let columnArray: Column[] = [];
let tokenArray: Token[] = [];
let columnSelect: HTMLSelectElement = doc.getSelect("column-select");
let newName: HTMLInputElement = doc.getInput("new-token-name");
let newStatus: HTMLSelectElement = doc.getSelect("active-select");
let newColumn:HTMLSelectElement = doc.getSelect("column-select");
let myInfo: Author;
init();
async function init(){
    await Promise.all([setTokenArray(), setColumns(), setMyInfo(), initElements()]);
    renderPage();
}

async function setMyInfo(){
    myInfo = await getMyInfo();
}

async function setColumns(){
    columnArray = await getColumns();
}

async function setTokenArray(){
    tokenArray = await selectAccessibleTokens();
}

function initElements(){
    doc.addClick("insert-token", insertToken);
}

function renderPage(){
    let highestPerm = myInfo.getHighestPermission();
    if(highestPerm >= 40){ 
        let all = { id: 0, name: "Mind" }
        columnArray = columnArray;
        columnArray.unshift(all);
    } else {
        columnArray = columnArray.filter(col => utils.hasCmlAccesToColumn(myInfo.permissions, col));
    }
    renderColumnSelect(columnSelect);
    for (let token of tokenArray) {
        renderToken(token);
    }
}

async function insertToken(){
    let newToken = new Token(0, newName.value, parseInt(newStatus.value), parseInt(newColumn.value));
    await newToken.insert();
    if(newToken.id != null){
        addToken(newToken);
    } else {
        alert("Hiba a kérés feldolgozásakor.");
    }
}

function addToken(token: Token){
    if(token.id !== 0){
        tokenArray.push(token);
        renderToken(token);
    }
}

function renderToken(token: Token){
    let container = doc.createDiv(token.id.toString(), ["tokenContainer"]);
    let name = doc.createP(["tokenName"], token.name);
    let saveBtn = doc.createButton(["tokenButton", "blue"], '<i class="fas fa-save"></i>', ()=>{
        token.status = parseInt(statusSelect.value);
        token.columnId = parseInt(columnSelect.value);
        token.update(); //ezt le kéne majd valahol ellenőrizni
    });
    let deleteBtn = doc.createButton(["tokenButton", "red"], '<i class="fas fa-trash-alt"></i>', ()=>{
        switchDeleteBtn(deleteBtn, token);
    });
    let statusSelect = renderTokenSelect(token);
    let columnSelect = renderTokenColumnSelect(token);
    doc.append(container, [name, statusSelect, columnSelect, deleteBtn, saveBtn]);
    tokenTable.appendChild(container);
}

function switchDeleteBtn(oldButton: HTMLButtonElement, token: Token){
    let newButton = doc.createButton(["tokenButton", "red"], "Törlés", ()=> {
        deleteToken(token);
    });
    oldButton.parentNode.replaceChild(newButton, oldButton);
}

async function deleteToken(token: Token){
    if(await token.delete()){
        onTokenDelete(token);
    } else{
        alert("Szerver oldali hiba lépett fel a token törlésekor.");
    }
    
}

function onTokenDelete(token: Token){
    tokenArray = tokenArray.filter(f => f.id !== token.id);
    doc.remove(token.id.toString());
}

function renderTokenColumnSelect(token){
    let tokenColumnSelect = doc.createSelect("column-select" + token.id, ["tokenSelect"]);
    renderColumnSelect(tokenColumnSelect);
    tokenColumnSelect.value = token.columnId;
    return tokenColumnSelect;
}

function renderTokenSelect(token){
    let select = doc.createSelect("status-select" + token.id, ["tokenSelect"]);
    doc.renderOption(select, "1", "Aktív");
    doc.renderOption(select, "0", "Inaktív");
   // doc.renderOption(select, "2", "Kötelező");
    select.value = token.status;
    return select;
}

function renderColumnSelect(select: HTMLSelectElement){
    for (let col of columnArray) {
        doc.renderOption(select, col.id.toString(), col.name);
    }
}