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
export class Position {
    constructor(id, name, htmlId, articleId) {
        this.id = id;
        this.name = name;
        this.htmlId = htmlId;
        this.articleId = articleId;
    }
}
export function updatePositions(positions) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield caller.POSTAsynch("../amp/includes/requests/updatepositions.php", positions);
        return caller.IsSuccessful(response);
    });
}
export function selectByBlock(func, blockId) {
    return __awaiter(this, void 0, void 0, function* () {
        let f = (response) => {
            func(parseArray(JSON.parse(response).positions));
        };
        let data = {
            blockId: blockId
        };
        let response = yield caller.POSTAsynch("../amp/includes/requests/selectpositionbyblock.php", data);
        return parseArray(JSON.parse(response).positions);
    });
}
export function parseArray(raw) {
    let pos_array = [];
    for (let pos of raw) {
        let position = new Position(pos.id, pos.name, pos.htmlId, pos.articleId);
        pos_array.push(position);
    }
    return pos_array;
}
//# sourceMappingURL=position.js.map