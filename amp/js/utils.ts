export function getUrlParameter(url: string): string{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return decodeURIComponent(urlParams.get(url));    
}

export function getMyInfo(){
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
      let [k,v] = el.split('=');
      cookie[k.trim()] = v;
    });
    let me = {
        id: parseInt(decodeURIComponent(cookie["uid"])),
        userName: decodeURIComponent(cookie["userName"]).replace("+", " "),
        uniqName: decodeURIComponent(cookie["uniqName"]).replace("+", " "),
        highestPermission: parseInt(decodeURIComponent(cookie["highestPerm"]))
    }
    return me;
}

export function getHighestPermission(permissions){
    if(permissions.length === 0){
        return 0;
    }
    return Math.max.apply(Math, permissions.map(function(p) { return p.level; }));
}

export function hasCmlAccesToColumn(permissions, column){
    for (let perm of permissions) {
       if(perm.columnId == column.id) return true;
    }
    return false;
}

export function isNormal(permission){
    if(permission.level <= 10){
        return true;
    }
    return false;
}

export function isCma(permission){
    if(permission.level >= 20){
        return true;
    }
    return false;
}

export function isCml(permission){
    if(permission.level >= 30){
        return true;
    }
    return false;
}

export function isAdmin(permission){
    if(permission.level >= 40){
        return true;
    }
    return false;
}

export function isSuperAdmin(permission){
    if(permission.level >= 50){
        return true;
    }
    return false;
}