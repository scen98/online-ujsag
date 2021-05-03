import * as doc from "./doc.js";
import * as utils from "./utils.js";
import * as author from "./objects/author.js";

const userNameInput: HTMLInputElement = doc.name("userName") as HTMLInputElement;
const passwordInput: HTMLInputElement = doc.name("password") as HTMLInputElement;

init();

async function init(){
    doc.addClick("login", startLoginProcess);
}

function startLoginProcess(){
    if(checkInputs()){
        login();
    }
}

function checkInputs(){
    if(userNameInput.value.length < 1){
        doc.setText("login-msg", "Üres felhasználónév.");
        return false;
    }
    if(passwordInput.value.length < 1){
        doc.setText("login-msg", "Üres jelszó.");
        return false;
    }
    return true;
}

async function login(){
    const wasSuccessful = await author.login(userNameInput.value, passwordInput.value);
    if(wasSuccessful){
        window.location.href = "cikkeim.php";
    } else {
        doc.setText("login-msg", "Hibás bejelentkezési adatok.");
    }
}