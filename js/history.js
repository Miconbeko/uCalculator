function deleteAllCookies() {
    const cookiesArr = getAllCookieKeys(getAllCookies());

    if (cookiesArr === null)
        return null;
    for (let str of cookiesArr) {
        document.cookie = str + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    }
}

function addCookie(key, value, expDays) {
    const date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    const exp = "expires=" + date.toUTCString();
    document.cookie = key + "=" + value + ";" + exp; 
}

function showAllCookies() {
    const cookiesArr = getAllCookieValues(getAllCookies());
    const wrp = document.querySelector(".history-field");

    console.log(cookiesArr);
    wrp.innerHTML = "";
    if (cookiesArr === null) {
        return null;
    }
    for (let cookie of cookiesArr) {
        cookie = JSON.parse(cookie);

        const block = document.createElement('div');
        const spanExpElem = document.createElement('span');
        const spanNumElem = document.createElement('span');

        block.addEventListener("click", () => {
            setValuesFromCookie(JSON.stringify(cookie));
        })
        
        block.setAttribute('class', 'history-block');
        spanExpElem.setAttribute('class', 'calc-expression-history');
        spanNumElem.setAttribute('class', 'calc-number-history');

        spanExpElem.innerText = `${cookie.expression}`;
        spanNumElem.innerText = `${cookie.number}`
        
        block.appendChild(spanExpElem);
        block.appendChild(spanNumElem);
        wrp.appendChild(block);
    }
}

function getAllCookies() {
    if (document.cookie === "")
        return null;
    return document.cookie.split("; ");
}

function getAllCookieValues(arr) {
    if (arr === null)
        return null;
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].split(/=(.*)/s)[1];
    }
    return arr;
}

function getAllCookieKeys(arr) {
    if (arr === null)
        return null;
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].split(/=(.*)/s)[0];
    }
    return arr;
}

function getCookiesCount() {
    const cookies = getAllCookies();
    if (cookies === null)
        return 0;
    return cookies.length;
}

function init() {    
    let count = getCookiesCount();
    function func(value) {
        addCookie(`n${count}`, value, 30);
        count++;
        showAllCookies();
    }
    return func;
}

// function readTextarea() {
//     return document.getElementById("textarea").value;
// }

// function askForDeleteCookies() {
//     if (confirm("Are you sure about that? O_o"))
//         deleteAllCookies();
// }

// function tryToAddNewCookie() {
//     const str = readTextarea();
//     if (str === "" || str === null || str === undefined)
//         alert(`It's empty. Tryto input something in "Text input"`);
//     else
//         addNextCookie(str);
// }

// deleteAllCookies();
const addNextCookie = init();

showAllCookies();

