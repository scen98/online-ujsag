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
import * as utils from "./utils.js";
import { getColumns } from "./objects/column.js";
let article;
let columns = [];
init();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([setArticle(), setColumns()]);
        renderArticle();
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
function renderArticle() {
    doc.getImg("main-img").src = article.imgPath;
    doc.get("title").innerText = article.title;
    doc.get("details").innerText = `${utils.getUrlParameter("by")}, ${columns.find(c => c.id === article.columnId).name}, ${doc.parseDateHun(article.date)}`;
    doc.get("lead").innerText = article.lead;
    doc.get("text").innerHTML = article.text;
}
//# sourceMappingURL=articleController.js.map