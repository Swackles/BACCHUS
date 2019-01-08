sessionStorage.removeItem("filterByCat");

function addBid(itemId) {
    let element = document.getElementById("bid-" + itemId).elements;

    if ($("#product-" + itemId)[0].children[2].innerHTML == "EXPIRED") {
        alert("This auction has expired");
        $("#product-" + itemId).remove();
        return;
    }

    if (element.namedItem("forname").value == "") {
        alert("Forname is invalid");
        element.namedItem("forname").className += " false";
        return;
    }
    element.namedItem("forname").className = element.namedItem("forname").className.replace(" false", "");
    if (element.namedItem("surname").value == "") {
        alert("Surname is invalid");
        element.namedItem("surname").className += " false";
        return;
    }
    element.namedItem("surname").className = element.namedItem("surname").className.replace(" false", "");
    if (element.namedItem("amount").value == "") {
        alert("Amount is invalid");
        element.namedItem("amount").className += " false";
        return;
    }
    let BidElement = document.getElementById("product-" + itemId).children[2];
    if (parseInt(element.namedItem("amount").value) < parseInt(BidElement.children[0].innerHTML.replace("Your Highest Bid: ", ""))) {
        alert("You already have a bid with higher amount");
        element.namedItem("amount").className += " false";
        return;
    }
    element.namedItem("amount").className = element.namedItem("amount").className.replace(" false", "");

    $.ajax({
        url: '/bid',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            "Id": itemId,
            "Forname": element.namedItem("forname").value,
            "Surname": element.namedItem("surname").value,
            "Amount": element.namedItem("amount").value
        }),
        success: (data, textStatus, jQxhr) => {
            alert(data);

            if (!data.includes("ERROR")) {
                BidElement.className = BidElement.className.replace(" hidden", "");
                BidElement.children[0].innerHTML += element.namedItem("amount").value;
            }
        },
        error: () => {
            alert("Something went wrong")
        }
    });
}

function filterReset() {
    sessionStorage.removeItem("filterByCat");

    $(".hidden").each((index, value) => {
        if (!value.className.includes("product")) return true;
        if (value.className.includes("product-component")) return true;
        value.className = value.className.replace(/ hidden/g, "");
    });

    $(".selected").each((index, value) => {
        value.className = value.className.replace(/ selected/g, "");
        value.nextSibling.className += " hidden";
    });

    $(".menu-pointer-container").each((index, value) => {
        value.className += " hidden";
    });
}

function filterByCat(category) {

    category = category.replace(/-/g, " ");

    function loopTrough(cat) {
        $(".product").each((index, value) => {
            if (cat.includes(value.className.split(" ")[2].replace(/-/g, " "))) {
                value.className = value.className.replace(/ hidden/g, "");
            } else {
                value.className += " hidden";
            }
        });
        $(".menu-item").each((index, value) => {
            if (index == $(".menu-item").length - 1) return true;
            if (cat.includes(value.className.split(" ")[1].replace(/-/, " "))) {
                value.children[0].className += " selected";
                value.children[1].className = value.children[1].className.replace(/ hidden/g, "");
            } else {
                value.children[0].className = value.children[0].className.replace(/ selected/g, "");
                value.children[1].className += " hidden";
            }

            
        });
    }

    let filteredCategories = sessionStorage.getItem("filterByCat");

    if (filteredCategories == null || filteredCategories == "") {
        filteredCategories = [category];
        loopTrough(filteredCategories)
    } else if (filteredCategories.split(",").length == 1 && filteredCategories.split(",")[0] == category) {
        console.log("false");
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