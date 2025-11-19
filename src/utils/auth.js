// src/utils/auth.js
export function saveToken(token) {
    localStorage.setItem('token', token);
}

export function getToken() {
    return localStorage.getItem('token');
}

export function logout() {
    localStorage.removeItem('token');
}
export function saveUserData(user) {
    console.log("user" , user)
    localStorage.setItem('user',JSON.stringify(user));
}


export const getConfig = () => {
    const getTokenFromLocalStorage = localStorage.getItem("token") || "";

    return {
        headers: {  // Changed from header to headers
            'Authorization': getTokenFromLocalStorage ? `Bearer ${getTokenFromLocalStorage}` : '',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
};


export const checkIsAuthenticated = () => localStorage.getItem('token') ? true : false
