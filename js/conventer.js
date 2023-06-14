function getAllGroups(menuName) {
    return document.querySelectorAll(`.converter-menu-${menuName} > .converter-menu-content > .conventer-group`);
}

function displayAllGroups(menuName, except) {
    const groups = getAllGroups(menuName);

    for (const g of groups) {
        g.style.display = "block";
        if (except === g.getAttribute("class").split(' ')[1]) {
            g.style.display = "none";
        }
    }
}

function hideAllGroups(menuName, except) {
    const groups = getAllGroups(menuName);

    for (const g of groups) {
        g.style.display = "none";
        if (except === g.getAttribute("class").split(' ')[1]) {
            g.style.display = "block";
        }
    }
}


const groupMenues = document.querySelectorAll(".converter-menu-content");
const converterMenues = document.querySelector(".converter").children;

let selectedConvertFrom = document.getElementById("defaultConvertFrom"),
    selectedConvertTo = document.getElementById("defaultConvertTo");

hideAllGroups("to", "distance-group");

for (let i = 0; i < 2; i++) {
    converterMenues[i].addEventListener("click", () => {
        if (groupMenues[i].style.display === "block") {
            groupMenues[i].style.display = "none";
        } else {
            groupMenues[i].style.display = "block";
        } 
    });

    groupMenues[i].addEventListener("click", () => {
        if (groupMenues[i].style.display === "block") {
            groupMenues[i].style.display = "none";
        } else {
            groupMenues[i].style.display = "block";
        } 
    });

    for (const groupMenue of groupMenues[i].children) {
        const groupClass = groupMenue.getAttribute("class").split(' ')[1];
        let selectedField, anotherSelectedField;

        if (i == 0) {
            selectedField = document.querySelector(".selected-convert-from");
            anotherSelectedField = document.querySelector(".selected-convert-to");
        } else {
            selectedField = document.querySelector(".selected-convert-to");
            anotherSelectedField = document.querySelector(".selected-convert-from");
        }
    
        for (const menuContent of groupMenue.querySelector(".conventer-group-menu").children) {
            menuContent.addEventListener("click", () => {
                if (i === 0) {
                    hideAllGroups("to", groupClass);
                    selectedConvertFrom = menuContent;

                    selectedField.innerText = selectedConvertFrom.innerText;
                    if (selectedConvertTo !== null && selectedConvertFrom.parentElement.parentElement.className !== selectedConvertTo.parentElement.parentElement.className) {
                        selectedConvertTo = null;
                        anotherSelectedField.innerText = "";
                    }
                } else {
                    selectedConvertTo = menuContent;
                    selectedField.innerText = selectedConvertTo.innerText;
                }
                selectedField.innerText = menuContent.innerText;
                groupMenues[i].style.display = "none";
            });
        }
    }
}

document.getElementById("convert").parentElement.addEventListener("click", () => {
    if (selectedConvertFrom === null || selectedConvertTo === null)
        return;
    console.log(parseInt(selectedConvertFrom.getAttribute("num")), -parseInt(selectedConvertTo.getAttribute("num")));
});

function getSelectedElements() {
    return [selectedConvertFrom, selectedConvertTo];
}
