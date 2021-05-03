import { Author, logOut, updatePassword } from "./objects/author.js";
import * as doc from "./doc.js";
import * as utils from "./utils.js";
init();
function init(){
    doc.addClick("logout-btn", logOut);
    doc.addClick("change-pw", changePassword);
}

async function changePassword (){
    let response = await updatePassword(new Author(parseInt(utils.getUrlParameter("szerzo")), null, null), doc.getValue("new-pw-1"), doc.getValue("new-pw-2"), doc.getValue("my-pw"));
    if(response === "200"){
        doc.setText("pw-message", "A jelszó sikeresen meg lett változtatva.");
    } else if(response === "403"){
        doc.setText("pw-message", "Hozzáférés megtagadva. Biztosan helyes jelszót adtál meg?");
    } else if(response == null){
        doc.setText("pw-message", "A két jelszó nem egyezik meg");
    } else {
        doc.setText("pw-message", "A művelet végrehajtása szerver oldali hiba miatt sikertelen.");
    }
    resetPwInputs();
}

function resetPwInputs(){
    doc.setValue("new-pw-1", "");
    doc.setValue("new-pw-2", "");
    doc.setValue("my-pw", "");
}