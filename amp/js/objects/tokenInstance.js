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
export class TokenInstance {
    constructor(id, articleId, tokenId, authorId, authorName, date) {
        this.id = id;
        this.articleId = articleId;
        this.tokenId = tokenId;
        this.authorId = authorId;
        this.authorName = authorName;
        this.date = date;
    }
    insert() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield caller.POSTAsynch("../amp/includes/requests/inserttokeninstance.php", this);
            this.id = JSON.parse(response).newId;
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield caller.POSTAsynch("../amp/includes/requests/deletetokeninstance.php", this);
            return caller.IsSuccessful(response);
        });
    }
}
export function constrFromJson(json) {
    return constrArray(JSON.parse(json).article.tokenInstances);
    /*   let instanceArray: TokenInstance[];
       for (let instance of JSON.parse(json).article.tokenInstances) {
           let newTokenInstance = new TokenInstance(instance.id, instance.articleId, instance.tokenId, instance.authorId, instance.authorName, new Date(instance.date));
           instanceArray.push(newTokenInstance);
       }
       return instanceArray; */
}
export function constrArray(raw) {
    let instanceArray = [];
    if (raw == null) {
        return undefined;
    }
    for (let instance of raw) {
        let newTokenInstance = new TokenInstance(instance.id, instance.articleId, instance.tokenId, instance.authorId, instance.authorName, new Date(instance.date));
        instanceArray.push(newTokenInstance);
    }
    return instanceArray;
}
//# sourceMappingURL=tokenInstance.js.map