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
window.onscroll = function () { handleHeader(); };
let createUser = document.getElementById("create-user");
let header = document.getElementById("top-nav");
let sticky = header.offsetTop;
let tokens = document.getElementById("tokens");
let awaiting = document.getElementById("awaiting-articles");
let positionPage = document.getElementById("position-page");
let myInfo = utils.getMyInfo();
init();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        displayContent();
        doc.addClick("hamburger-menu", displayMenu);
    });
}
function displayMenu() {
    let x = doc.get("top-nav");
    if (!x.classList.contains("responsive")) {
        x.classList.add("responsive");
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
    else {
        x.classList.remove("responsive");
    }
}
function handleHeader() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    }
    else {
        header.classList.remove("sticky");
    }
}
function displayContent() {
    if (myInfo.highestPermission <= 10) {
        hideFromNormal();
    }
    else if (myInfo.highestPermission <= 20) {
        hideFromCma();
    }
    else if (myInfo.highestPermission <= 30) {
        hideFromCml();
    }
    else if (myInfo.highestPermission <= 40) {
        hideFromAdmin();
    }
}
function hideFromNormal() {
    tokens.style.display = "none";
    createUser.style.display = "none";
    awaiting.style.display = "none";
    positionPage.style.display = "none";
}
function hideFromCma() {
    tokens.style.display = "none";
    createUser.style.display = "none";
    positionPage.style.display = "none";
}
function hideFromCml() {
    createUser.style.display = "none";
}
function hideFromAdmin() {
    createUser.style.display = "none";
}
window.onscroll = function () {
    headerHandler();
};
function headerHandler() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    }
    else {
        header.classList.remove("sticky");
    }
}
//# sourceMappingURL=headerController.js.map