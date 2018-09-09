var d = new Date();
document.querySelector(".year").innerHTML = d.getFullYear();

function showAddAmountForm() {
    var x = document.getElementById("addAmount");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function areYouSureDialog() {
    document.getElementById('areYouSure').style.display = "block";
}

document.getElementById('cancelButton').addEventListener("click", function() {
    document.getElementById('areYouSure').style.display = "none";
});

function showInviteForm() {
    var x = document.getElementById("invite");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

// source: https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
function copyLink() {
    var copyText = document.getElementById("itemLink");
    copyText.select();
    document.execCommand("copy");
}