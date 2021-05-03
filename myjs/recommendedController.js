var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as utils from "../amp/js/utils.js";
import { selectSideArticles } from "./positionedArticle.js";
let articles = [];
init();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        articles = yield selectSideArticles(getColumnId());
        renderArticles();
    });
}
function renderArticles() {
    for (let article of articles) {
        article.render();
    }
}
function getColumnId() {
    let columnId = parseInt(utils.getUrlParameter("cid"));
    if (columnId == null) {
        columnId = 0;
    }
    return columnId;
}
//# sourceMappingURL=recommendedController.js.map