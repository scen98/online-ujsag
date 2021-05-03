var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as caller from "../amp/js/objects/caller.js";
import { Article, constrFromJSON } from "../amp/js/objects/article.js";
import * as doc from "../amp/js/doc.js";
export class PositionedArticle extends Article {
    constructor(id, title, lead, authorId, date, imgPath, columnId, authorName, columnName, htmlId) {
        super(id, title, lead, authorId, date, imgPath, columnId);
        super.authorName = authorName;
        this.columnName = columnName;
        this.htmlId = htmlId;
    }
    cutLead(charCount) {
        let shortenedLead = this.lead.substring(0, charCount);
        if (this.lead.length > charCount) {
            shortenedLead += "...";
        }
        return shortenedLead;
    }
    render() {
        let title = doc.get(`${this.htmlId}-title`);
        if (title != null)
            title.innerText = `${this.title}`;
        let lead = doc.get(`${this.htmlId}-lead`);
        if (lead != null)
            lead.innerText = this.cutLead(150);
        let frontImg = doc.getImg(`${this.htmlId}-img`);
        if (frontImg != null) {
            if (this.imgPath) {
                frontImg.src = this.imgPath;
            }
            else {
                frontImg.src = "./img/default.jpg";
            }
        }
        let column = doc.get(`${this.htmlId}-column`);
        if (column != null) {
            column.innerText = this.columnName;
            column.href = encodeURI(`../magazine/rovat.php?cid=${this.columnId}&rovat=${encodeURIComponent(this.columnName)}`);
        }
        let date = doc.get(`${this.htmlId}-date`);
        if (date != null)
            date.innerText = doc.parseDateYYYYMMDD(this.date);
        let author = doc.get(`${this.htmlId}-author`);
        if (author != null) {
            author.innerText = this.authorName;
            author.href = `../magazine/szerzo.php?aid=${this.authorId}&nev=${encodeURIComponent(this.authorName)}`;
        }
        for (let art of document.getElementsByName(this.htmlId)) {
            art.href = encodeURI(`../magazine/cikk.php?aid=${this.id}&cid=${this.columnId}&rovat=${encodeURIComponent(this.columnName)}`);
        }
    }
}
export function selectPositionedArticles(columnId) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            columnId: columnId
        };
        let result = yield caller.POSTAsynch("./amp/includes/requests/selectarticlesbycolumnblock.php", data);
        try {
            return parsePositionedArticles(result);
        }
        catch (err) {
            console.log(err);
            console.log(result);
            return [];
        }
    });
}
export function selectReadableArticle(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            id: id
        };
        let result = yield caller.POSTAsynch("../magazine/amp/includes/requests/selectreadablearticle.php", data);
        try {
            return constrFromJSON(result);
        }
        catch (Exception) {
            console.log(Exception);
            console.log(result);
            return undefined;
        }
    });
}
export function selectSideArticles(columnId) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            columnId: columnId
        };
        let result = yield caller.POSTAsynch("./amp/includes/requests/selectsidearticles.php", data);
        try {
            return parsePositionedArticles(result);
        }
        catch (err) {
            console.log(err);
            console.log(result);
            return [];
        }
    });
}
export function searchArticles(keyword, limit, offset) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            keyword: keyword,
            limit: limit,
            offset: offset
        };
        let result = yield caller.POSTAsynch("./amp/includes/requests/selectusersearch.php", data);
        try {
            return parsePositionedArticles(result);
        }
        catch (err) {
            console.log(err);
            console.log(result);
            return [new PositionedArticle(0, "Hiba a kérelem feldolgozásakor.", null, null, null, null, null, null, null)];
        }
    });
}
export function selectPositionedArticlesByAuthor(authorId, limit, offset) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            authorId: authorId,
            limit: limit,
            offset: offset
        };
        let result = yield caller.POSTAsynch("./amp/includes/requests/selectusersearch.php", data);
        try {
            return parsePositionedArticles(result);
        }
        catch (err) {
            console.log(err);
            console.log(result);
            return [new PositionedArticle(0, "Hiba a kérelem feldolgozásakor.", null, null, null, null, null, null, null)];
        }
    });
}
export function selectPositionedArticlesByBlock(blockId) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            blockId: blockId
        };
        let result = yield caller.POSTAsynch("./amp/includes/requests/selectarticlesbyblock.php", data);
        try {
            return parsePositionedArticles(result);
        }
        catch (err) {
            console.log(err);
            console.log(result);
            return [new PositionedArticle(0, "Hiba a kérelem feldolgozásakor.", null, null, null, null, null, null, null)];
        }
    });
}
export function parsePositionedArticles(json) {
    let articles = JSON.parse(json).articles;
    let result = [];
    for (let art of articles) {
        let newArticle = new PositionedArticle(art.id, art.title, art.lead, art.authorId, new Date(art.date), art.imgPath, art.columnId, art.authorName, art.columnName, art.htmlId);
        result.push(newArticle);
    }
    return result;
}
//# sourceMappingURL=positionedArticle.js.map