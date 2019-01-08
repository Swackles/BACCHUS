sessionStorage.removeItem("filterByCat");

function getHistory() {
    let element = document.getElementsByClassName("product-form")[0].elements;

    if (element.namedItem("forname").value == "") {
        alert("Forname is invalid");
        element.namedItem("forname").className += " false";
        return;
    }
    element.namedItem("forname").className = element.namedItem("forname").className.replace(/ false/g, "");
    if (element.namedItem("surname").value == "") {
        alert("Surname is invalid");
        element.namedItem("surname").className += " false";
        return;
    }
    element.namedItem("surname").className = element.namedItem("surname").className.replace(/ false/g, "");

    $.ajax({
        accepts: {
            html: 'text/html'
        },
        contentType: 'application/json',
        url: '/History/get',
        type: 'POST',
        data: JSON.stringify({
            "Forname": element.namedItem("forname").value,
            "Surname": element.namedItem("surname").value
        }),
        complete: (res) => {
            if(res.statusCode = 200) {
                if (res.responseText.includes("ERROR")) {
                    alert(res.responseText);
                    return;
                }

                document.getElementsByClassName("product-container")[0].innerHTML = res.responseText;

                let categories = [];

                let table = document.getElementsByClassName("history-table")[0];
                for (let i = 0; i < table.rows.length; i++) {
                    let row = table.rows[i];
                    if (!row.className.includes("product-row")) continue;

                    if (categories.indexOf(row.cells[2].innerHTML) == -1) categories.push(row.cells[2].innerHTML);
                }

                let menu = document.getElementsByClassName("menu-list")[0];
                for (let i = 0; i < categories.length; i++) {
                    let category = categories[i];

                    let li = document.createElement("li");
                    li.className = "menu-item " + category.replace(/ /g, "-");

                    let button = document.createElement("button");
                    button.className = "menu-button";
                    button.addEventListener("click", () => { filterByCat(category) });
                    button.innerHTML = category;

                    li.appendChild(button);

                    menu.insertBefore(li, menu.children[menu.children.length - 1]);
                }
            } else {
                alert("Something went wrong");
            }
        }
    });
}

function showBids(id) {
    var element = document.getElementById("bids-" + id);

    if (element.className.includes(" hidden")) {
        element.className = element.className.replace(/ hidden/g, "");
    } else {
        element.className += " hidden";
    }
}

function filterReset() {
    sessionStorage.removeItem("filterByCat");

    $(".hidden").each((index, value) => {
        if (!value.className.includes("product-row")) return true;
        value.className = value.className.replace(/ hidden/g, "");
    });

    $(".selected").each((index, value) => {
        value.className = value.className.replace(/ selected/g, "");
    });
}

function filterByCat(category) {

    function loopTrough(cat) {
        $(".product-row").each((index, value) => {
            if (cat.includes(value.className.split(" ")[1].replace(/-/, " "))) {
                value.className = value.className.replace(/ hidden/g, "");
            } else {
                value.className += " hidden";
            }
        });
        $(".menu-item").each((index, value) => {
            if (index == $(".menu-item").length - 1) return true;
            if (cat.includes(value.className.split(" ")[1].replace(/-/, " "))) {
                value.className += " selected";
            } else {
                value.className = value.className.replace(/ selected/g, "");
            }
        });
    }

    let filteredCategories = sessionStorage.getItem("filterByCat")

    if (filteredCategories == null || filteredCategories == "") {
        filteredCategories = [category];
        loopTrough(filteredCategories)
    } else if (filteredCategories.split(",").length == 1 && filteredCategories.split(",")[0] == category) {
        filteredCategories = [];
        filterReset();
    } else {
        filteredCategories = filteredCategories.split(",");
        if (filteredCategories.indexOf(category) == -1) {
            filteredCategories.push(category);
        } else {
            filteredCategories.splice(filteredCategories.indexOf(category), 1);
        }

        loopTrough(filteredCategories);
    }
    sessionStorage.setItem("filterByCat", filteredCategories.toString());
}