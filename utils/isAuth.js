function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }

    return null;
}

export const isAuth = () => {

    let token = getCookie("auth_token");

    if (!token) {
        console.log("Token Can't Find");
        window.location.href = "http://isosofts.com/los";
        return false;
    }

    console.log("Token Find And ReDirecting");
    window.location.href = "http://algebra.isosofts.com";
    return true;
}