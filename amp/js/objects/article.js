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
import * as ti from "./tokenInstance.js";
export class Article {
    constructor(id, title, lead, authorId, date, imgPath, columnId, text, isLocked, lockedBy, state, authorName, tokenInstances) {
        this.id = id;
        this.title = title;
        this.lead = lead;
        this.authorId = authorId;
        this.date = date;
        this.imgPath = imgPath;
        this.columnId = columnId;
        this.text = text;
        this.isLocked = isLocked;
        this.lockedBy = lockedBy;
        this.state = state;
        this.authorName = authorName;
        this.tokenInstances = tokenInstances;
    }
    insert() {
        return __awaiter(this, void 0, void 0, function* () {
            let newIdRaw = yield caller.POSTAsynch("../amp/includes/requests/insertarticle.php", this);
            this.id = JSON.parse(newIdRaw).newId;
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield caller.POSTAsynch("../amp/includes/requests/updatearticle.php", this);
            return caller.IsSuccessful(response);
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield caller.POSTAsynch("../amp/includes/requests/deletearticle.php", this);
            return caller.IsSuccessful(response);
        });
    }
    switchLock(authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            invertLock(this, authorId);
            let response;
            if (this.isLocked) {
                response = yield caller.POSTAsynch("../amp/includes/requests/lockarticle.php", this);
            }
            else {
                response = yield caller.POSTAsynch("../amp/includes/requests/unlockarticle.php", this);
            }
            if (JSON.parse(response).msg === "success") {
                return true;
            }
            else if (JSON.parse(response).msg === "fail") {
                alert("Ezt a cikket már egy másik felhasználó zárolta.");
                return false;
            }
            else {
                invertLock(this, authorId);
                console.log(response);
                return false;
            }
        });
    }
    updateState() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                id: this.id,
                state: this.state,
                columnId: this.columnId
            };
            let response = yield caller.POSTAsynch("../amp/includes/requests/updatearticlestate.php", data);
            return caller.IsSuccessful(response);
        });
    }
    hasTokenInstance(token) {
        if (this.tokenInstances == null) {
            return false;
        }
        return this.tokenInstances.some(ti => ti.tokenId === token.id);
    }
    hasAllTokenInstances(necessaryTokens) {
        return necessaryTokens.every(t => this.hasTokenInstance(t));
    }
}
export function invertLock(article, authorId) {
    if (!article.isLocked) {
        article.isLocked = true;
        article.lockedBy = authorId;
    }
    else {
        article.isLocked = false;
    }
}
export function selectArticle(articleId) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            id: articleId
        };
        let response = yield caller.POSTAsynch("../amp/includes/requests/selectarticle.php", data);
        return constrFromJSON(response);
    });
}
export function selectArticles(articleIdArray) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            ids: articleIdArray
        };
        let response = yield caller.POSTAsynch("../amp/includes/requests/selectarticles.php", data);
        return parseArray(response);
    });
}
export function selectByAuthorId(authorId, keyword, state, columnId, limit, offset) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            authorId: authorId,
            keyword: keyword,
            limit: limit,
            offset: offset,
            state: state,
            columnId: columnId
        };
        let response = yield caller.POSTAsynch("../amp/includes/requests/selectarticlesbyauthor.php", data);
        return parseArray(response);
    });
}
export function selectArticlesByState(keyword, limit, offset, columnId, state) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            keyword: keyword,
            limit: limit,
            offset: offset,
            columnId: columnId,
            state: state
        };
        let response = yield caller.POSTAsynch("../amp/includes/requests/selectarticlesbystate.php", data);
        try {
            return parseArray(response);
        }
        catch (err) {
            console.log(err);
            console.log(response);
            return [];
        }
    });
}
function parseArray(json) {
    let articleArray = Array();
    for (let art of JSON.parse(json).articles) {
        let newArticle = new Article(art.id, art.title, art.lead, art.authorId, new Date(art.date), art.imgP, art.columnId, art.text, art.isLocked == 1, art.lockedBy, art.state, art.authorName, ti.constrArray(art.tokenInstances));
        articleArray.push(newArticle);
    }
    return articleArray;
}
export function constrFromJSON(json) {
    let art = JSON.parse(json).article;
    let article = new Article(art.id, art.title, art.lead, art.authorId, new Date(art.date), art.imgPath, art.columnId, art.text, art.isLocked == 1, art.lockedBy, art.state, art.authorName);
    if (art.state > 0 && art.tokenInstances != null && art.tokenInstances.length > 0) { //asd //???
        article.tokenInstances = ti.constrArray(art.tokenInstances);
    }
    else {
        article.tokenInstances = [];
    }
    return article;
}
//# sourceMappingURL=article.js.map