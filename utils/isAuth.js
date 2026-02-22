export const isAuth = () => {
    let token = localStorage.getItem("token");
    console.log(" Searching For Token ")
    if (!!token == false) {
        console.log(" Token Can't Find")
        return !!token
    }
    console.log(" Token Find And ReDirecting ")
    window.location.href = "http://algebra.isosofts.com";
    return !!token
} 