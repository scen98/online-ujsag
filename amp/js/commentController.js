var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as doc from "./doc.js";
import * as utils from "./utils.js";
import { ArticleComment, selectByArticle } from "./objects/articleComment.js";
let commentTable = doc.getDiv("comment-container");
let comments = [];
let myInfo = utils.getMyInfo();
let articleId = parseInt(utils.getUrlParameter("aid"));
init();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        comments = yield selectByArticle(articleId);
        renderComments();
        doc.addClick("post-comment", postComment);
    });
}
function postComment() {
    return __awaiter(this, void 0, void 0, function* () {
        let newComment = new ArticleComment(null, doc.getValue("new-comment"), myInfo.id, new Date(), myInfo.userName, articleId);
        yield newComment.insert();
        if (newComment.id) {
            renderComment(newComment);
            doc.getInput("new-comment").value = "";
        }
        else {
            alert("A művelet végrehajtása szerveroldali hiba miatt nem iskerült.");
        }
    });
}
function renderComments() {
    for (let comment of comments) {
        renderComment(comment);
    }
}
function renderComment(comment) {
    return __awaiter(this, void 0, void 0, function* () {
        let container = doc.createDiv(`comment${comment.id}`, ["comment-container"]);
        let authorName = doc.createA(["comment-author"], comment.authorName, `../amp/szerzo.php?szerzo=${(comment.authorId)}`);
        let date = doc.createP(["comment-date"], doc.parseDateHun(comment.date));
        let text = doc.createP(["comment-content"], comment.text);
        doc.append(container, [authorName, date, text]);
        if (myInfo.id === comment.authorId) {
            container.classList.add("my-comment");
            container.appendChild(createDeleteBtn(comment));
        }
        doc.append(commentTable, [container]);
    });
}
function createDeleteBtn(comment) {
    let deleteBtn = doc.createButton(["delete-btn", "red"], "Törlés");
    doc.addClick(deleteBtn, () => {
        deleteComment(comment);
    });
    return deleteBtn;
}
function deleteComment(comment) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield comment.delete()) {
            doc.remove(`comment${comment.id}`);
        }
        else {
            alert("A művelet végrehajtása szerveroldali hiba miatt nem sikerült.");
        }
    });
}
//# sourceMappingURL=commentController.js.map