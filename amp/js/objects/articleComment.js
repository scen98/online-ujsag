var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as caller from "./caller.js";
export class ArticleComment {
    constructor(id, text, authorId, date, authorName, articleId) {
        this.id = id;
        this.text = text;
        this.authorId = authorId;
        this.date = date;
        this.authorName = authorName;
        this.articleId = articleId;
    }
    insert() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield caller.POSTAsynch("../amp/includes/requests/insertcomment.php", this);
            try {
                this.id = JSON.parse(response).newId;
            }
            catch (err) {
                console.log(err);
                console.log(response);
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield caller.POSTAsynch("../amp/includes/requests/deletecomment.php", this);
            return caller.IsSuccessful(response);
        });
    }
}
export function selectByArticle(articleId) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            articleId: articleId
        };
        let response = yield caller.POSTAsynch("../amp/includes/requests/selectcomments.php", data);
        try {
            return constrFromJSON(response);
        }
        catch (err) {
            console.log(err);
            console.log(response);
            return [];
        }
    });
}
function constrFromJSON(json) {
    let newArticles = [];
    for (let newComment of JSON.parse(json).articleComments) {
        newArticles.push(new ArticleComment(newComment.id, newComment.text, newComment.authorId, new Date(newComment.date), newComment.authorName));
    }
    return newArticles;
}
//# sourceMappingURL=articleComment.js.map