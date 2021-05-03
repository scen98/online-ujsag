var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function GET(url, func) {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        try {
            func(this.responseText);
        }
        catch (err) {
            console.log(err);
            console.log(this.responseText);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}
export function POST(url, message, func) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", url);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(message);
    xhttp.onload = () => {
        try {
            func(xhttp.responseText);
        }
        catch (err) {
            console.log(err);
            console.log(xhttp.responseText);
        }
    };
}
export function GETAsynch(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url, {
            method: "GET",
            cache: "no-cache",
            credentials: "same-origin"
        });
        if (response.ok) {
            return response.text();
        }
        else {
            console.log(response);
            return response.status.toString();
        }
    });
}
export function POSTAsynch(url, data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Default options are marked with *
        const response = yield fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        if (response.ok) {
            return response.text();
        }
        else {
            console.log(response);
            return response.status.toString();
        }
    });
}
export function IsSuccessful(json) {
    if (JSON.parse(json).msg === "success") {
        return true;
    }
    console.log(json);
    return false;
}
//# sourceMappingURL=caller.js.map