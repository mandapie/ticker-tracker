let currentYear = new Date();
document.querySelector(".copy__year").textContent = currentYear.getFullYear();

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

document.getElementById('cancelButton').onclick = document.getElementById('areYouSure').style.display = "none";