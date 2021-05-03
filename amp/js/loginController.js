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
import * as author from "./objects/author.js";
const userNameInput = doc.name("userName");
const passwordInput = doc.name("password");
init();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        doc.addClick("login", startLoginProcess);
    });
}
function startLoginProcess() {
    if (checkInputs()) {
        login();
    }
}
function checkInputs() {
    if (userNameInput.value.length < 1) {
        doc.setText("login-msg", "Üres felhasználónév.");
        return false;
    }
    if (passwordInput.value.length < 1) {
        doc.setText("login-msg", "Üres jelszó.");
        return false;
    }
    return true;
}
function login() {
    return __awaiter(this, void 0, void 0, function* () {
        const wasSuccessful = yield author.login(userNameInput.value, passwordInput.value);
        if (wasSuccessful) {
            window.location.href = "cikkeim.php";
        }
        else {
            doc.setText("login-msg", "Hibás bejelentkezési adatok.");
        }
    });
}
//# sourceMappingURL=loginController.js.map