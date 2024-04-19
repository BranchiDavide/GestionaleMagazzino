const printBtn = document.getElementById("printBtn");
const qrCodeImg = document.getElementsByClassName("qrCodeImg")[0];

printBtn.addEventListener("click", () => {
    swal({
        title: "Quanti QR si vuole stampare?",
        content: {
          element: "input",
          attributes: {
            type: "number",
            min: 0,
            step: 1
          }
        },
        buttons: {
          cancel: "Annulla",
          confirm: {
            text: "Stampa",
            closeModal: false,
          }
        }
      })
      .then((value) => {
        if (value !== null && value !== "") {
            if(!Number.isNaN(value) && value > 0){
                replicateQr(value);
                swal.close();
                window.print();
                window.location.reload();
            }else{
                swal({
                    title: "Valore inserito non valido!",
                    icon: "error"
                });
            }
        }
        swal.close();
    });
});

function replicateQr(times){
    for(let i = 0; i < times; i++){
        let newQr = qrCodeImg.cloneNode(true);
        document.body.appendChild(newQr);
    }
    qrCodeImg.style.display = "none";
}