let currentYear = new Date();
document.querySelector(".copy__year").textContent = currentYear.getFullYear();

function showAddAmountForm() {
    var x = document.getElementById("addAmount");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
<<<<<<< HEAD
}

function areYouSureDialog() {
    document.getElementById('areYouSure').style.display = "block";
}

<<<<<<< HEAD
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
=======
>>>>>>> parent of a7ef24b... delete works but can't close modal
}
=======
document.getElementById('cancelButton').onclick = document.getElementById('areYouSure').style.display = "none";
>>>>>>> parent of 83e2e0d... added edit page. cancel button works now
