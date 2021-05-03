export function GET(url: string, func: (objects: string)=>void){
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        try{
            func(this.responseText);
        }catch(err) {
            console.log(err);
            console.log(this.responseText);
        }
    };    
    xhttp.open("GET", url, true);
    xhttp.send();
}

export function POST(url: string, message: any, func: (resp: string)=>void){
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", url); 
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(message);
    xhttp.onload = () => {
        try{
            func(xhttp.responseText); 
        } catch(err){
            console.log(err);
            console.log(xhttp.responseText)
        }
    }
}

export async function GETAsynch(url: string){
    const response = await fetch(url, {
        method: "GET",
        cache: "no-cache",
        credentials: "same-origin"
    });
    if(response.ok){
        return response.text();
    } else {
        console.log(response);
        return response.status.toString();
    }
}

export async function POSTAsynch(url: string, data: any): Promise<string> {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    if(response.ok){
        return response.text();
    } else {
        console.log(response);
        return response.status.toString();
    }
}

export function IsSuccessful(json: string){
    if(JSON.parse(json).msg === "success"){
        return true;
    }
    console.log(json);
    return false;
}
