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
import { Article } from "./objects/article.js";
import * as doc from "./doc.js";
let columnSelect = doc.getSelect("column-select");
let newTitle = document.getElementById("new-title");
let lead = document.getElementById("lead");
let imgPath = document.getElementById("img-path");
let text = document.getElementById("txtField");
init();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        let [columns] = yield Promise.all([getColumns(), initElements()]);
        renderOptions(columns);
    });
}
function initElements() {
    enableEditMode();
    doc.addClick(document.getElementById("save-article-btn"), insertArticle);
    doc.addClick("open-img-path-btn", () => { window.open(imgPath.value); });
}
function insertArticle() {
    return __awaiter(this, void 0, void 0, function* () {
        let newArticle = new Article(0, newTitle.value, lead.value, undefined, undefined, imgPath.value, parseInt(columnSelect.value), text.contentWindow.document.body.innerHTML);
        yield newArticle.insert();
        if (newArticle.id != null) {
            moveToEditor(newArticle);
        }
        else {
            alert("Szerver oldali hiba lépett fel az oldal metnésekor.");
        }
    });
}
function moveToEditor(article) {
    window.location.href = `../amp/cikk_szerk.php?aid=${article.id}&cim=${article.title}`;
}
function renderOptions(columnArray) {
    for (let col of columnArray) {
        doc.renderOption(columnSelect, col.id.toString(), col.name);
    }
    enableEditMode(); //ez a szar bugos firefoxon és olyamatosan hívogatni kell
}
function enableEditMode() {
    text.contentWindow.document.designMode = "On";
}
//# sourceMappingURL=writeController.js.map