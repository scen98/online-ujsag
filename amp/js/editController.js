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
import * as doc from "./doc.js";
import { getColumns } from "./objects/column.js";
let columnSelect = doc.getSelect("column-select");
let title = doc.getInput("title");
document.getElementById("title");
let lead = doc.getInput("lead");
document.getElementById("lead");
let imgPath = doc.getInput("img-path");
let text = document.getElementById("txtField");
let article;
let message = doc.get("message");
let modal = doc.getDiv("myModal");
let stateSelect = document.getElementById("state-select");
let columns = [];
doc.addClick("change-state-button", updateState);
doc.addClick("save-article-button", saveArticle);
doc.addClick("delete-btn", displayDeleteModal);
doc.addClick("delete-article-btn", deleteArticle);
doc.addClick("open-img-path-btn", openImgPath);
doc.addClick("hide-modal-btn1", hideDeleteModal);
doc.addClick("hide-modal-btn2", hideDeleteModal);
init();
function init() {
    Promise.all([setArticle(), setColumns()]);
}
function setColumns() {
    return __awaiter(this, void 0, void 0, function* () {
        columns = yield getColumns();
        renderOptions(columns);
    });
}
function setArticle() {
    return __awaiter(this, void 0, void 0, function* () {
        article = yield selectArticle(getId());
        renderArticle();
    });
}
function saveArticle() {
    return __awaiter(this, void 0, void 0, function* () {
        setArticleProperties();
        if (yield article.update()) {
            refreshMessage();
        }
        else {
            alert("A cikk mentése szerver oldali hiba miatt sikertelen.");
        }
    });
}
function displayDeleteModal() {
    modal.style.display = "block";
}
function hideDeleteModal() {
    modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
function deleteArticle() {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield article.delete()) {
            onDelete();
        }
        else {
            alert("A cikk törlése szerver oldali hiba miatt sikertelen.");
        }
    });
}
function openImgPath() {
    window.open(imgPath.value);
}
function updateState() {
    return __awaiter(this, void 0, void 0, function* () {
        article.state = parseInt(stateSelect.value);
        if (!(yield article.updateState())) {
            alert("A státusz beállítása szerver oldali hiba miatt sikertelen.");
        }
        displayDeleteBtn();
    });
}
function onDelete() {
    window.location.href = "../amp/cikkeim.php";
}
function refreshMessage() {
    let d = new Date();
    message.innerHTML = "Legutóbb mentve: " + d.getHours() + ":" + d.getMinutes();
}
function renderArticle() {
    title.value = article.title;
    lead.value = article.lead;
    imgPath.value = article.imgPath;
    text.contentWindow.document.body.innerHTML = article.text;
    stateSelect.value = article.state.toString();
    if (article.state > 1) {
        stateSelect.style.display = "none";
        doc.get("change-state-button").style.display = "none";
    }
    columnSelect.value = article.columnId.toString();
    enableEditMode();
    displayDeleteBtn();
}
function displayDeleteBtn() {
    if (article.state === -1) {
        doc.setDisplay("delete-btn", "inline");
    }
    else {
        doc.setDisplay("delete-btn", "none");
    }
}
function setArticleProperties() {
    article.title = title.value;
    article.lead = lead.value;
    article.imgPath = imgPath.value;
    article.columnId = parseInt(columnSelect.value);
    article.text = text.contentWindow.document.body.innerHTML;
    article.state = parseInt(stateSelect.value);
}
function getId() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return parseInt(urlParams.get("aid"));
}
function renderOptions(columnArray) {
    for (let col of columnArray) {
        doc.renderOption(columnSelect, col.id.toString(), col.name);
    }
}
function enableEditMode() {
    text.contentWindow.document.designMode = "On";
}
//# sourceMappingURL=editController.js.map