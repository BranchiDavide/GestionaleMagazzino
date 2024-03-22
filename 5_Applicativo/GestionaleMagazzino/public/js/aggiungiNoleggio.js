const html5QrCode = new Html5Qrcode("reader");
const addProductBtn = document.getElementById("addProduct-btn");
const prodottiNoleggioTable = document.getElementsByClassName("prodottiNoleggio")[0];
const hiddenInput = document.getElementById("postProdottiInput");
const form = document.getElementById("aggiuntaForm");

let prodottiNoleggio = [];
addProductBtn.addEventListener("click", async () => {
    const isMobile = navigator.userAgentData.mobile;
    let scanOptions = {
        fps: 10,
        qrbox: 200
    }
    if(isMobile){
        scanOptions = {
            fps: 10,
            videoConstraints: {
                facingMode: { exact: "environment" },
            },
            qrbox: 200,
        }
    }
    Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
            let cameraId = devices[0].id;
            // .. use this to start scanning.
            html5QrCode.start(
                cameraId,
                scanOptions,
                async qrCodeMessage => {
                    html5QrCode.stop();
                    let product = await fetchProdotto(qrCodeMessage);
                    if(product){
                        addProdotto(product);
                    }else{
                        alert("Prodotto non trovato!");
                    }
                })
                .catch(err => {
                    alert("Impossibile scannerizzare i prodotti, controllare permesso fotocamera!");
            });
        }
    }).catch(err => {
        alert("Impossibile scannerizzare i prodotti, controllare permesso fotocamera!");
    });
});

form.addEventListener("submit", () => {
    hiddenInput.value = JSON.stringify(prodottiNoleggio);
});

async function fetchProdotto(id){
    let result = await fetch(`/prodotti/${id}?json=true`);
    if(result.status == 404){
        return null;
    }else{
        return await result.json();
    }
}

function addProdotto(obj){
    prodottiNoleggioTable.style.display = "block";
    let tbody = prodottiNoleggioTable.getElementsByTagName("tbody")[0];
    let tr = document.createElement("tr");
    let codiceTd = document.createElement("td");
    let nomeTd = document.createElement("td");
    let quantitaTd = document.createElement("td");
    let quantitaInput = document.createElement("input");
    quantitaInput.setAttribute("type", "number");
    quantitaInput.setAttribute("min", "1");
    quantitaInput.setAttribute("max", obj.quantita);
    quantitaTd.appendChild(quantitaInput);
    codiceTd.textContent = obj.codice;
    nomeTd.textContent = obj.nome;
    tr.appendChild(codiceTd);
    tr.appendChild(nomeTd);
    tr.appendChild(quantitaTd);
    tbody.appendChild(tr);
}

function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

window.onload = () => {
    document.getElementsByName("dataInizio")[0].value = getCurrentDate();
    document.getElementsByName("dataFine")[0].setAttribute("min", getCurrentDate());
}

document.getElementById("formFile").addEventListener("change", (e) => {
    let file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const previewImage = document.getElementById("previewImage");
            previewImage.src = e.target.result;
            document.getElementsByClassName("item-picture")[0].style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});
