var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Token, selectAccessibleTokens } from "./objects/token.js";
import { getColumns } from "./objects/column.js";
import * as utils from "./utils.js";
import * as doc from "./doc.js";
import { getMyInfo } from "./objects/author.js";
let tokenTable = doc.getTable("token-table");
let columnArray = [];
let tokenArray = [];
let columnSelect = doc.getSelect("column-select");
let newName = doc.getInput("new-token-name");
let newStatus = doc.getSelect("active-select");
let newColumn = doc.getSelect("column-select");
let myInfo;
init();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([setTokenArray(), setColumns(), setMyInfo(), initElements()]);
        renderPage();
    });
}
function setMyInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        myInfo = yield getMyInfo();
    });
}
function setColumns() {
    return __awaiter(this, void 0, void 0, function* () {
        columnArray = yield getColumns();
    });
}
function setTokenArray() {
    return __awaiter(this, void 0, void 0, function* () {
        tokenArray = yield selectAccessibleTokens();
    });
}
function initElements() {
    doc.addClick("insert-token", insertToken);
}
function renderPage() {
    let highestPerm = myInfo.getHighestPermission();
    if (highestPerm >= 40) {
        let all = { id: 0, name: "Mind" };
        columnArray = columnArray;
        columnArray.unshift(all);
    }
    else {
        columnArray = columnArray.filter(col => utils.hasCmlAccesToColumn(myInfo.permissions, col));
    }
    renderColumnSelect(columnSelect);
    for (let token of tokenArray) {
        renderToken(token);
    }
}
function insertToken() {
    return __awaiter(this, void 0, void 0, function* () {
        let newToken = new Token(0, newName.value, parseInt(newStatus.value), parseInt(newColumn.value));
        yield newToken.insert();
        if (newToken.id != null) {
            addToken(newToken);
        }
        else {
            alert("Hiba a kérés feldolgozásakor.");
        }
    });
}
function addToken(token) {
    if (token.id !== 0) {
        tokenArray.push(token);
        renderToken(token);
    }
}
function renderToken(token) {
    let container = doc.createDiv(token.id.toString(), ["tokenContainer"]);
    let name = doc.createP(["tokenName"], token.name);
    let saveBtn = doc.createButton(["tokenButton", "blue"], '<i class="fas fa-save"></i>', () => {
        token.status = parseInt(statusSelect.value);
        token.columnId = parseInt(columnSelect.value);
        token.update(); //ezt le kéne majd valahol ellenőrizni
    });
    let deleteBtn = doc.createButton(["tokenButton", "red"], '<i class="fas fa-trash-alt"></i>', () => {
        switchDeleteBtn(deleteBtn, token);
    });
    let statusSelect = renderTokenSelect(token);
    let columnSelect = renderTokenColumnSelect(token);
    doc.append(container, [name, statusSelect, columnSelect, deleteBtn, saveBtn]);
    tokenTable.appendChild(container);
}
function switchDeleteBtn(oldButton, token) {
    let newButton = doc.createButton(["tokenButton", "red"], "Törlés", () => {
        deleteToken(token);
    });
    oldButton.parentNode.replaceChild(newButton, oldButton);
}
function deleteToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield token.delete()) {
            onTokenDelete(token);
        }
        else {
            alert("Szerver oldali hiba lépett fel a token törlésekor.");
        }
    });
}
function onTokenDelete(token) {
    tokenArray = tokenArray.filter(f => f.id !== token.id);
    doc.remove(token.id.toString());
}
function renderTokenColumnSelect(token) {
    let tokenColumnSelect = doc.createSelect("column-select" + token.id, ["tokenSelect"]);
    renderColumnSelect(tokenColumnSelect);
    tokenColumnSelect.value = token.columnId;
    return tokenColumnSelect;
}
function renderTokenSelect(token) {
    let select = doc.createSelect("status-select" + token.id, ["tokenSelect"]);
    doc.renderOption(select, "1", "Aktív");
    doc.renderOption(select, "0", "Inaktív");
    // doc.renderOption(select, "2", "Kötelező");
    select.value = token.status;
    return select;
}
function renderColumnSelect(select) {
    for (let col of columnArray) {
        doc.renderOption(select, col.id.toString(), col.name);
    }
}
//# sourceMappingURL=tokensController.js.map