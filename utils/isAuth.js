export const isAuth = () => {
    let token = getCookie("auth_token") || null;
    if (!!token == null) {
        window.location.href = "http://isosofts.com/los";
        console.log(" Token Can't Find")
    } else {
        console.log(" Token Find And ReDirecting ")
        window.location.href = "http://algebra.isosofts.com";
        return !!token
    }
} 