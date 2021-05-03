var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { selectReadableArticle } from "./positionedArticle.js";
import * as doc from "../amp/js/doc.js";
import * as utils from "../amp/js/utils.js";
init();
/*
function init(){
    //selectReadableArticle(setArticle, parseInt(utils.getUrlParameter("aid")));
    setArticle();
}*/
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        let articleData = yield selectReadableArticle(parseInt(utils.getUrlParameter("aid")));
        let columnName = utils.getUrlParameter("rovat");
        let authorName = doc.get("author-name");
        doc.get("title").innerText = articleData.title;
        doc.get("lead").innerText = articleData.lead;
        doc.get("text").innerHTML = articleData.text;
        doc.get("date").innerText = doc.parseDateYYYYMMDD(articleData.date);
        authorName.innerText = articleData.authorName;
        authorName.href = `../magazine/szerzo.php?aid=${articleData.authorId}&nev=${encodeURIComponent(articleData.authorName)}`;
        doc.getImg("main-img").src = articleData.imgPath;
        let columnAnchor = doc.get("column-name");
        columnAnchor.innerText = columnName;
        columnAnchor.href = encodeURI(`../magazine/rovat.php?cid=${articleData.columnId}&rovat=${encodeURIComponent(columnName)}`);
    });
}
//# sourceMappingURL=postController.js.map