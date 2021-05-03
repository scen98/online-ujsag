var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { selectArticle } from "./objects/article.js";
import { selectActiveTokensByColumn } from "./objects/token.js";
import { getColumns } from "./objects/column.js";
import * as doc from "./doc.js";
import { TokenInstance } from "./objects/tokenInstance.js";
import * as utils from "./utils.js";
import { getMyInfo } from "./objects/author.js";
let columns = [];
let columnSelect = doc.getSelect("column-select");
let title = doc.getInput("title");
let lead = doc.getInput("lead");
let imgPath = doc.getInput("img-path");
let text = document.getElementById("txtField");
let article;
let message = document.getElementById("message");
let deleteModal = doc.getDiv("delete-modal");
let state = document.getElementById("state");
let lockMessage = document.getElementById("lock-message");
let lockBtn = doc.getBtn("lock-btn");
let necessaryTokens = [];
let tokenTable = document.getElementById("token-table");
let stateSelect = doc.getSelect("state-select");
let stateModal = doc.getDiv("state-modal");
let myInfo;
init();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([setArticle(), setColumns(), setMyInfo()]);
        yield setNecessaryTokens();
        renderOptions(columns);
        refreshArticle();
        renderTokens();
        initListeners();
    });
}
function setMyInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        myInfo = yield getMyInfo();
        //setMyTokenPermissions(myInfo);
    });
}
function setColumns() {
    return __awaiter(this, void 0, void 0, function* () {
        columns = yield getColumns();
    });
}
function setArticle() {
    return __awaiter(this, void 0, void 0, function* () {
        article = yield selectArticle(parseInt(utils.getUrlParameter("aid")));
    });
}
function setNecessaryTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        necessaryTokens = yield selectActiveTokensByColumn(article.columnId);
    });
}
function initListeners() {
    doc.addClick(doc.get("open-img-path-btn"), openImgPath);
    doc.addClick(lockBtn, switchLock);
    doc.addClick("check-btn", checkState);
    doc.addClick("save-article-button", saveArticle);
    doc.addClick("change-close-span", hideStateModal);
    doc.addClick("save-state-btn", saveState);
    doc.addClick("hide-state-modal-btn", hideStateModal);
}
function saveArticle() {
    return __awaiter(this, void 0, void 0, function* () {
        setArticle();
        setArticleProperties();
        if (yield article.update()) {
            refreshMessage();
        }
        else {
            alert("Cikk mentése sikertelen");
        }
    });
}
function displayStateModal() {
    stateModal.style.display = "block";
}
function hideStateModal() {
    stateModal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == deleteModal) {
        deleteModal.style.display = "none";
    }
    if (event.target == stateModal) {
        stateModal.style.display = "none";
    }
};
function openImgPath() {
    window.open(imgPath.value);
}
function switchLock() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield article.switchLock(myInfo.permissions[0].authorId))) {
            alert("Hozzáférés megtagadva.");
            return;
        }
        setState();
        if (!article.isLocked) {
            setArticleProperties();
            article.update();
            refreshMessage();
        }
    });
}
function checkState() {
    article.state = parseInt(stateSelect.value);
    if (!article.hasAllTokenInstances(necessaryTokens) && article.state > 1) {
        displayStateModal();
    }
    else {
        article.updateState();
    }
}
function saveState() {
    article.updateState();
    hideStateModal();
}
function renderTokens() {
    for (let token of necessaryTokens) {
        renderToken(token);
    }
}
function renderToken(token) {
    let container = doc.createDiv("token" + token.id, ["tokenContainer"]);
    let name = doc.createP(["tokenName"], token.name);
    let doesExist = article.hasTokenInstance(token);
    let hasAccess = hasAccessToToken(token);
    doc.append(container, [name]);
    if (doesExist && hasAccess) {
        renderExistingTokenElements(token, container);
    }
    else if (!doesExist && hasAccess) {
        renderNonExistingTokenElements(token, container);
    }
    else {
        container.classList.add("redToken");
    }
    doc.append(tokenTable, [container]);
}
function renderNonExistingTokenElements(token, tokenContainer) {
    let addBtn = doc.createButton(["tokenButton", "green"], '<i class="fas fa-plus-square"></i>', () => {
        insertTokeninstanceCommand(new TokenInstance(0, article.id, token.id, myInfo.id, myInfo.userName, new Date()));
    });
    tokenContainer.classList.add("redToken");
    doc.append(tokenContainer, [addBtn]);
}
function insertTokeninstanceCommand(newTokenInstance) {
    return __awaiter(this, void 0, void 0, function* () {
        yield newTokenInstance.insert();
        article.tokenInstances.push(newTokenInstance);
        tokenTable.innerHTML = "";
        for (let token of necessaryTokens) {
            renderToken(token);
        }
    });
}
function renderExistingTokenElements(token, tokenContainer) {
    let tokenInstance = article.tokenInstances.find(t => t.tokenId === token.id);
    let deleteBtn = doc.createButton(["tokenButton", "red"], '<i class="fas fa-minus-circle"></i>', () => {
        switchDeleteButton(deleteBtn, tokenInstance);
    });
    tokenContainer.classList.add("green");
    let tokenAuthor = doc.createP(["tokenInfo"], tokenInstance.authorName + ": ");
    let tokenDate = doc.createP(["tokenInfo"], doc.parseDateHun(tokenInstance.date));
    doc.append(tokenContainer, [tokenAuthor, tokenDate, deleteBtn]);
}
function switchDeleteButton(oldButton, toDelete) {
    let newBtn = doc.createButton(["tokenButton", "red"], "Eltávolít", () => {
        deleteTokenInstanceCommand(toDelete);
    });
    oldButton.parentNode.replaceChild(newBtn, oldButton);
    setTimeout(() => { newBtn.parentNode.replaceChild(oldButton, newBtn); }, 5000);
}
function deleteTokenInstanceCommand(toDelete) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield toDelete.delete())) {
            alert("A művelet végrehajtása sikertelen.");
        }
        article.tokenInstances = article.tokenInstances.filter(t => t.id !== toDelete.id);
        tokenTable.innerHTML = "";
        for (let token of necessaryTokens) {
            renderToken(token);
        }
    });
}
function hasAccessToToken(token) {
    if (myInfo.permissions[0].level >= 40) {
        return true;
    }
    if (myInfo.getHighestPermission() >= 30) {
        if (myInfo.permissions.some(p => p.columnId === token.columnId))
            return true;
    }
    return myInfo.tokenPermissions.some(ti => ti.tokenId === token.id);
}
function refreshMessage() {
    let d = new Date();
    message.innerHTML = `Legutóbb mentve: ${doc.parseDatehhdd(d)}`;
}
function refreshArticle() {
    title.value = article.title;
    lead.value = article.lead;
    imgPath.value = article.imgPath;
    columnSelect.value = article.columnId.toString();
    text.contentWindow.document.body.innerHTML = article.text;
    stateSelect.value = article.state.toString();
    setState();
}
function setState() {
    if (!article.isLocked) {
        openState();
    }
    else if (article.isLocked && article.lockedBy == myInfo.permissions[0].authorId) {
        closeState();
    }
    else {
        noAccessState();
    }
}
function openState() {
    state.innerText = "Nyitott";
    state.className = "unlocked";
    lockMessage.innerText = "A szerkesztés megkezdésekor a rendszer zárt állapotba helyezi azt, ezzel meggátolva hogy más felhasználók is módosításokat hajtsanak végre, amíg ön ezt a zárat fel nem oldja..";
    lockBtn.style.display = "block";
    lockBtn.innerHTML = "Szerkesztés megkezdése";
    lockBtn.className = "lockBtn";
    setArticle();
    toggleEditOff();
}
function closeState() {
    state.innerText = "Zárt";
    state.className = "locked";
    lockMessage.innerText = "A cikkhez jelen pillanatban csak ez a felhasználó fér hozzá.";
    lockBtn.innerHTML = "Szerkesztés befejezése";
    lockBtn.className = "unlockBtn";
    toggleEditOn();
}
function noAccessState() {
    state.innerText = "Más által zárolva.";
    lockMessage.innerText = "A cikk egy másik felhasználó által lett zárolva, így addig nem végezhető változtatás, amíg azt ő fel nem oldja.";
    document.getElementById("lock-btn").style.display = "none";
    toggleEditOff();
}
function setArticleProperties() {
    article.title = title.value;
    article.lead = lead.value;
    article.imgPath = imgPath.value;
    article.columnId = parseInt(columnSelect.value);
    article.text = text.contentWindow.document.body.innerHTML;
}
function renderOptions(columnArray) {
    let highestPerm = myInfo.getHighestPermission();
    if (highestPerm < 40) {
        columnArray = columnArray.filter(col => utils.hasCmlAccesToColumn(myInfo.permissions, col));
    }
    for (let col of columnArray) {
        doc.renderOption(columnSelect, col.id.toString(), col.name);
    }
}
function toggleEditOn() {
    text.contentWindow.document.designMode = "On";
}
function toggleEditOff() {
    text.contentWindow.document.designMode = "Off";
}
//# sourceMappingURL=editxController.js.map