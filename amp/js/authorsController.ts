import { Author, selectAllAuthors, getMyInfo } from "./objects/author.js";
import * as doc from "./doc.js";
import * as utils from "./utils.js";
//var utils_1 = require("./utils");
let authorTable: HTMLDivElement = doc.getDiv("author-table");
let authors: Author[] = [];
let searchInput: HTMLInputElement = doc.getInput("search");
let permissionSearchInput: HTMLSelectElement = doc.getSelect("permission-select");
let myInfo = utils.getMyInfo();
init();
async function init() {
    await Promise.all([setAuthors(), initElements()]);
    renderAuthors();
}

async function setAuthors(){
    authors = await selectAllAuthors();
}

function initElements(){
    doc.addClick(doc.getBtn("search-btn"), search);
    doc.addChange(searchInput, search);
    doc.addChange("permission-select", search);
}

function renderAuthors() {
    for (let author of authors) {
        renderAuthor(author);
    }
}
function renderAuthor(author: Author) {
    let container = doc.createDiv("author-container" + author.id, ["authorContainer"]);
    let name = doc.createA(["authorName"], author.userName, `../amp/szerzo.php?szerzo=${encodeURIComponent(author.id)}`);
    let level: HTMLParagraphElement;
    if(author.getHighestPermission() > 0){
        level = doc.createP(["authorLevel"], author.getPermissionName());
    } else {
        level = doc.createP(["authorLevel"], "---");
    }
    doc.append(container, [name, level]);
    authorTable.appendChild(container);
    canUserEdit(author, renderEditButton, [container, author]);
}
function canUserEdit(author: Author, func:any, args:any) {
    let authorHighestPermission = author.getHighestPermission();
    if(myInfo.highestPermission >= 50 && myInfo.highestPermission > authorHighestPermission){
        func.apply(this, args);
    } else if(myInfo.highestPermission >= 30  && myInfo.highestPermission >= authorHighestPermission && authorHighestPermission >= 20) {
        func.apply(this, args);
    }
}
function search(){
    let keyword = searchInput.value.toLowerCase();
    let searchedLevel = permissionSearchInput.value;
    let result = [];
    result = authors.filter(function (a) { return a.userName.toLowerCase().includes(keyword); });
    if (searchedLevel !== "null") {
        result = result.filter(function (a) { return a.getHighestPermission() === parseInt(searchedLevel); });
    }
    authorTable.innerHTML = "";
    for (let author of result) {
        renderAuthor(author);
    }
}

function renderEditButton(parent: HTMLElement, author: Author) {
    let editBtn = doc.createButton(["authorButton", "blue"], '<i class="fas fa-user-edit"></i>', function () { window.location.href = `../amp/szerzo_szerk.php?author=${author.uniqName}`;});
    parent.appendChild(editBtn);
}
//# sourceMappingURL=authorsController.js.map