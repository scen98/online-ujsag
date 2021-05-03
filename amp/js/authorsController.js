var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { selectAllAuthors } from "./objects/author.js";
import * as doc from "./doc.js";
import * as utils from "./utils.js";
//var utils_1 = require("./utils");
let authorTable = doc.getDiv("author-table");
let authors = [];
let searchInput = doc.getInput("search");
let permissionSearchInput = doc.getSelect("permission-select");
let myInfo = utils.getMyInfo();
init();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([setAuthors(), initElements()]);
        renderAuthors();
    });
}
function setAuthors() {
    return __awaiter(this, void 0, void 0, function* () {
        authors = yield selectAllAuthors();
    });
}
function initElements() {
    doc.addClick(doc.getBtn("search-btn"), search);
    doc.addChange(searchInput, search);
    doc.addChange("permission-select", search);
}
function renderAuthors() {
    for (let author of authors) {
        renderAuthor(author);
    }
}
function renderAuthor(author) {
    let container = doc.createDiv("author-container" + author.id, ["authorContainer"]);
    let name = doc.createA(["authorName"], author.userName, `../amp/szerzo.php?szerzo=${encodeURIComponent(author.id)}`);
    let level;
    if (author.getHighestPermission() > 0) {
        level = doc.createP(["authorLevel"], author.getPermissionName());
    }
    else {
        level = doc.createP(["authorLevel"], "---");
    }
    doc.append(container, [name, level]);
    authorTable.appendChild(container);
    canUserEdit(author, renderEditButton, [container, author]);
}
function canUserEdit(author, func, args) {
    let authorHighestPermission = author.getHighestPermission();
    if (myInfo.highestPermission >= 50 && myInfo.highestPermission > authorHighestPermission) {
        func.apply(this, args);
    }
    else if (myInfo.highestPermission >= 30 && myInfo.highestPermission >= authorHighestPermission && authorHighestPermission >= 20) {
        func.apply(this, args);
    }
}
function search() {
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
function renderEditButton(parent, author) {
    let editBtn = doc.createButton(["authorButton", "blue"], '<i class="fas fa-user-edit"></i>', function () { window.location.href = `../amp/szerzo_szerk.php?author=${author.uniqName}`; });
    parent.appendChild(editBtn);
}
//# sourceMappingURL=authorsController.js.map
//# sourceMappingURL=authorsController.js.map