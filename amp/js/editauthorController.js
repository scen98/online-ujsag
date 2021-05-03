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
import { selectAccessibleTokens } from "./objects/token.js";
import { selectAuthorByName, permissionName, getMyInfo, updatePassword } from "./objects/author.js";
import { Permission, deletePermission, insertTokenPermission, deleteTokenPermission } from "./objects/permission.js";
import * as utils from "./utils.js";
import * as doc from "./doc.js";
let permissionTable = doc.getDiv("permission-table");
let columns = [];
let author;
let permissionType = doc.getSelect("permission-type");
let addPermission = doc.getDiv("add-permission");
let accessibleTokens = [];
let myTokenTable = doc.getDiv("my-token-table");
let authorTokenTable = doc.getDiv("author-token-table");
let myInfo;
init();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([setColumns(), setAccessibleTokens(), setMyInfo(), setAuthor()]);
        renderAuthor();
        renderTokenBox();
        initElements();
    });
}
function setColumns() {
    return __awaiter(this, void 0, void 0, function* () {
        columns = yield getColumns();
        renderColumnSelect(doc.getSelect("permission-column-select"));
    });
}
function setAccessibleTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        accessibleTokens = yield selectAccessibleTokens();
    });
}
function setMyInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        myInfo = yield getMyInfo();
    });
}
function setAuthor() {
    return __awaiter(this, void 0, void 0, function* () {
        author = yield selectAuthorByName(getAuthorName());
    });
}
function renderAuthor() {
    doc.get("user-name").innerText = author.userName;
    doc.get("uniq-name").innerText = author.uniqName;
    renderTokenBox();
    if (utils.getHighestPermission(myInfo.permissions) >= 50) {
        renderPermissions();
    }
}
function initElements() {
    doc.addClick("change-permission-btn", changePermission);
    doc.addClick("add-column-permission-btn", addColumnPermission);
    if (myInfo.getHighestPermission() >= 50) {
        doc.setDisplay("password-change-box", "block");
        doc.addClick("change-pw", changePassword);
    }
}
function getAuthorName() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get("author");
}
//---PERMISSIONS
function changePermission() {
    let newPermission = new Permission(0, parseInt(permissionType.value), author.id);
    if (doesPermissionExist(newPermission)) {
        alert("Ez a jogosultságtípus már be van állítva.");
    }
    else {
        permissionTable.innerHTML = "";
        newPermission.change();
        updateAuthorPermissions(newPermission);
    }
}
function addColumnPermission() {
    return __awaiter(this, void 0, void 0, function* () {
        let newPermission = new Permission(0, parseInt(doc.getValue("column-permission-level")), author.id);
        newPermission.columnId = parseInt(doc.getValue("permission-column-select"));
        if (doesPermissionExist(newPermission)) {
            alert("Ilyen jogosultság már létezik.");
        }
        else {
            newPermission.insert();
            onInsert(newPermission);
        }
        renderTokenBox();
    });
}
function onInsert(newPermission) {
    if (newPermission.id != null) {
        author.permissions.push(newPermission);
        renderPermission(newPermission);
        renderTokenBox();
    }
    else {
        alert("A művelet végrehajtása szerveroldali hiba miatt sikertelenül zárult.");
    }
}
function doesPermissionExist(newPermission) {
    if (author.permissions == null || author.permissions.length === 0) {
        return false;
    }
    for (let perm of author.permissions) {
        if (arePermissionsEqual(perm, newPermission))
            return true;
    }
    return false;
}
function arePermissionsEqual(perm1, perm2) {
    if (perm1.hasOwnProperty("columnId") && perm2.hasOwnProperty("columnId")) {
        if (perm1.level == perm2.level && perm1.columnId == perm2.columnId)
            return true;
    }
    else {
        if (perm1.level == perm2.level)
            return true;
    }
    return false;
}
function onPermissionDelete(permission) {
    doc.remove(permission.id.toString());
    author.permissions = author.permissions.filter(p => p.id !== permission.id);
    let tokensToDelete = accessibleTokens.filter(t => t.columnId === permission.columnId);
    for (let token of tokensToDelete) {
        author.tokenPermissions = author.tokenPermissions.filter(t => t.tokenId !== token.id);
    }
}
function updateAuthorPermissions(permission) {
    author.permissions = [];
    author.tokenPermissions = [];
    if (permission.level <= 10 || permission.level >= 40) {
        renderPermission(permission);
        author.permissions.push(permission);
    }
    displayPermissionAdder();
    if (utils.getHighestPermission(myInfo.permissions) >= 30 && parseInt(permissionType.value) === 20) { //////////////////////////////////////////////////////MAYBE PROBLEM????
        document.getElementById("token-permissions").style.display = "block";
    }
    renderTokenBox();
}
function renderPermissions() {
    doc.get("permission-settings").style.display = "block";
    if (author.permissions == null || author.permissions.length === 0) {
        renderNoPermissionsMessage();
    }
    else {
        for (let perm of author.permissions) {
            renderPermission(perm);
        }
        setPermissionType();
        displayPermissionAdder();
    }
}
function renderPermission(permission) {
    let perm = doc.createDiv(permission.id.toString(), ["permissionContainer"]);
    let columnName = doc.createP(["permissionColumn"], "");
    let permName = doc.createP(["permissionName"], permissionName(permission));
    let deleteBtn = doc.createButton(["permissionButton", "red"], '<i class="fas fa-trash-alt"></i>', () => { switchDeleteBtn(deleteBtn, permission); });
    if (author.getHighestPermission() <= 10 || author.getHighestPermission() >= 40) {
        columnName.innerText = "Mind";
    }
    else {
        columnName.innerText = columns.find(c => c.id === permission.columnId).name;
    }
    doc.append(perm, [permName, columnName, deleteBtn]);
    permissionTable.appendChild(perm);
}
function displayPermissionAdder() {
    if (parseInt(permissionType.value) === 20) {
        addPermission.style.display = "block";
    }
    else {
        addPermission.style.display = "none";
    }
}
function setPermissionType() {
    if (author.getHighestPermission() <= 10 && author.permissions.length > 0) {
        permissionType.value = "10";
    }
    else if (author.getHighestPermission() >= 40) {
        permissionType.value = "40";
    }
    else {
        permissionType.value = "20";
    }
}
function renderNoPermissionsMessage() {
    let p = document.createElement("p");
    p.innerText = "A felhasználó nem rendelkezik jogosultságokkal, így nem tudja használni az oldalt.";
    p.style.fontStyle = "italic";
    permissionTable.appendChild(p);
}
function renderColumnSelect(select) {
    for (let col of columns) {
        doc.renderOption(select, col.id.toString(), col.name);
    }
}
function switchDeleteBtn(oldButton, permission) {
    return __awaiter(this, void 0, void 0, function* () {
        let newButton = doc.createButton(["permissionButton", "red"], "Törlés");
        doc.addClick(newButton, () => {
            deletePermissionCommand(permission);
        });
        oldButton.parentNode.replaceChild(newButton, oldButton);
    });
}
function deletePermissionCommand(permission) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield deletePermission(permission)) {
            onPermissionDelete(permission);
            renderTokenBox();
        }
        else {
            alert("Törlés sikertelen.");
        }
    });
}
//PERMISSIONS---
//---TOKENS
function renderTokenBox() {
    if (author.permissions != null && !author.permissions.some(p => p.level === 20)) {
        doc.get("token-permissions").style.display = "none";
        return;
    }
    doc.get("token-permissions").style.display = "block";
    authorTokenTable.innerHTML = "";
    renderMyTokens();
    if (utils.getHighestPermission(myInfo.permissions) >= 30 && (parseInt(permissionType.value) === 20 || author.getHighestPermission() >= 20) && author.getHighestPermission() < 40) {
        if (author.tokenPermissions != null)
            renderAuthorTokenPermissions();
        document.getElementById("token-permissions").style.display = "block";
    }
    else {
        document.getElementById("token-permissions").style.display = "none";
    }
}
function onTokenPermissionInsert(newPermission) {
    author.tokenPermissions.push(newPermission);
    renderAuthorTokenPermission(newPermission);
}
function renderAuthorTokenPermissions() {
    authorTokenTable.innerHTML = "";
    for (let perm of author.tokenPermissions) {
        renderAuthorTokenPermission(perm);
    }
}
function renderAuthorTokenPermission(tokenPermission) {
    let container = doc.createDiv("author-token-" + tokenPermission.id, ["tokenContainer"]);
    let tokenName = doc.createP(["tokenName"], tokenPermission.tokenName);
    let tokenColumn = document.createElement("p");
    tokenColumn.className = "permissionColumn";
    if (tokenPermission.columnId == null || tokenPermission.columnId === 0) {
        tokenColumn.innerText = "Mind";
    }
    else {
        tokenColumn.innerText = columns.find(c => c.id === tokenPermission.columnId).name;
    }
    doc.append(container, [tokenName, tokenColumn]);
    if (hasAccessToToken(tokenPermission)) {
        createTokenDeleteBtn(container, tokenPermission);
    }
    authorTokenTable.appendChild(container);
}
function createTokenDeleteBtn(container, tokenPermission) {
    let deleteBtn = doc.createButton(["tokenButton", "red"], '<i class="fas fa-trash-alt"></i>', () => { switchTokenDeleteBtn(tokenPermission, deleteBtn); });
    container.appendChild(deleteBtn);
}
function switchTokenDeleteBtn(tokenPermission, oldButton) {
    let newButton = doc.createButton(["tokenButton", "red"], "Törlés", () => { deleteTokenCommand(tokenPermission); });
    oldButton.parentNode.replaceChild(newButton, oldButton);
}
function deleteTokenCommand(tokenPermission) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield deleteTokenPermission(tokenPermission)) {
            onTokenPermissionDelete(tokenPermission);
        }
        else {
            alert("Törlés sikertelen.");
        }
    });
}
function doesTokenPermissionExist(newTokenPermission) {
    if (author.tokenPermissions == null || author.tokenPermissions.length === 0) {
        return false;
    }
    for (let tp of author.tokenPermissions) {
        if (newTokenPermission.tokenId === tp.tokenId)
            return true;
    }
    return false;
}
function onTokenPermissionDelete(tokenPermission) {
    author.tokenPermissions.filter(t => t.id !== tokenPermission.id);
    document.getElementById("author-token-" + tokenPermission.id).remove();
}
function hasAccessToToken(token) {
    if (utils.getHighestPermission(myInfo.permissions) >= 40) {
        return true;
    }
    for (let perm of myInfo.permissions) {
        if (perm.columnId === token.columnId)
            return true;
    }
    return false;
}
function renderMyTokens() {
    myTokenTable.innerHTML = "";
    for (let token of accessibleTokens.filter(t => isTokenRelevant(t))) {
        renderAccessibleToken(token);
    }
}
function isTokenRelevant(token) {
    let permission = author.permissions.find(t => t.columnId === token.columnId);
    return permission != null && permission.level < 30;
}
function renderAccessibleToken(token) {
    let container = doc.createDiv(null, ["tokenContainer"]);
    let name = doc.createP(["tokenName"], token.name);
    let columnName = doc.createP(["permissionColumn"], ""); //permission igen
    let addBtn = doc.createButton(["green", "tokenButton"], '<i class="fas fa-user-plus"></i>', () => {
        if (doesTokenPermissionExist(newTokenPermission)) {
            alert("A felhasználó már rendelkezik ezzel a jogosultsággal.");
        }
        else {
            insertTokenPermissionCommand(newTokenPermission);
        }
    });
    let newTokenPermission = {
        id: null,
        authorId: author.id,
        columnId: token.columnId,
        tokenId: token.id,
        tokenName: token.name
    };
    if (token.columnId === 0) {
        columnName.innerText = "Mind";
    }
    else {
        columnName.innerText = columns.find(c => c.id === token.columnId).name;
    }
    doc.append(container, [name, columnName, addBtn]);
    myTokenTable.appendChild(container);
}
function insertTokenPermissionCommand(newTokenPermission) {
    return __awaiter(this, void 0, void 0, function* () {
        yield insertTokenPermission(newTokenPermission);
        onTokenPermissionInsert(newTokenPermission);
    });
}
function changePassword() {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield updatePassword(author, doc.getValue("new-pw-1"), doc.getValue("new-pw-2"), doc.getValue("my-pw"));
        if (response === "200") {
            doc.setText("pw-message", "A jelszó sikeresen meg lett változtatva.");
        }
        else if (response === "403") {
            doc.setText("pw-message", "Hozzáférés megtagadva.");
        }
        else if (response == null) {
            doc.setText("pw-message", "A két jelszó nem egyezik meg");
        }
        else {
            doc.setText("pw-message", "A művelet végrehajtása szerver oldali hiba miatt sikertelen.");
        }
        resetPwInputs();
    });
}
function resetPwInputs() {
    doc.setValue("new-pw-1", "");
    doc.setValue("new-pw-2", "");
    doc.setValue("my-pw", "");
}
//TOKENS---
//# sourceMappingURL=editauthorController.js.map