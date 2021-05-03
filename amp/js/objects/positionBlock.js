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
import * as pos from "./position.js";
export class PositionBlock {
    constructor(id, name, columnId, positions) {
        this.id = id;
        this.name = name;
        this.columnId = columnId;
        this.positions = positions;
    }
}
export function updateBlock(block) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            positionBlock: block
        };
        let response = yield caller.POSTAsynch("../amp/includes/requests/updateblock.php", data);
        return caller.IsSuccessful(response);
    });
}
export function selectByColumn(columnId) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = {
            columnId: columnId
        };
        let response = yield caller.POSTAsynch("../amp/includes/requests/selectpositionblockbycolumn.php", data);
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
    let pos_array = [];
    for (let positionBlock of JSON.parse(json).positionBlocks) {
        let block = new PositionBlock(positionBlock.id, positionBlock.name, positionBlock.columnId, pos.parseArray(positionBlock.positions));
        pos_array.push(block);
    }
    return pos_array;
}
//# sourceMappingURL=positionBlock.js.map