const printBtn = document.getElementById("printBtn");
const qrCodeImg = document.getElementsByClassName("qrCodeImg")[0];

printBtn.addEventListener("click", () => {
    let promptBox = prompt("Quanti QR si vuole stampare?");
    promptBox = parseInt(promptBox);
    if(promptBox != null && !Number.isNaN(promptBox)){
        replicateQr(promptBox);
        window.print();
        window.location.reload();
    }else{
        alert("Valore inserito non valido!");
    }
});

function replicateQr(times){
    for(let i = 0; i < times; i++){
        let newQr = qrCodeImg.cloneNode(true);
        document.body.appendChild(newQr);
    }
    qrCodeImg.style.display = "none";
}