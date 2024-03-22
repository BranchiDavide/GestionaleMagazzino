const html5QrCode = new Html5Qrcode("reader");
const addProductBtn = document.getElementById("addProduct-btn");
const prodottiNoleggioTable = document.getElementsByClassName("prodottiNoleggio")[0];
const hiddenInput = document.getElementById("postProdottiInput");
const form = document.getElementById("aggiuntaForm");
const loadingGif = `<center><img width="100" height="100" src="/img/noleggio/loading.gif"></center>`
let prodottiNoleggio = [];
addProductBtn.addEventListener("click", async () => {
    document.getElementById("reader").innerHTML = loadingGif;
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
                    $("#exampleModal").modal("hide");
                })
                .catch(err => {
                    alert("Impossibile scannerizzare i prodotti, controllare permesso fotocamera!");
            });
        }
    }).catch(err => {
        alert("Impossibile scannerizzare i prodotti, controllare permesso fotocamera!");
    });
});

$('#exampleModal').on('click', function (e) {
    if (e.target === this) {
        html5QrCode.stop();
        $('#exampleModal').modal('hide');
    }
});

form.addEventListener("submit", (e) => {
    if(prodottiNoleggio.length != 0){
        hiddenInput.value = JSON.stringify(prodottiNoleggio);
    }else{
        e.preventDefault();
        alert("È necessario aggiungere almeno un prodotto per creare il noleggio!");
    }
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
    if(prodottiNoleggio.length == 0){ //Primo prodotto aggiunto
        prodottiNoleggio.push([obj.codice, obj.nome, 1]);
    }else{
        let newProduct = true;
        for(let arr of prodottiNoleggio){
            if(arr[0] == obj.codice){ //Prodotto già presente
                arr[2] += 1; //Incremento quantità
                newProduct = false;
            }
        }
        if(newProduct){
            prodottiNoleggio.push([obj.codice, obj.nome, 1]);
        }
    }
    printTable();
}

function printTable(){
    prodottiNoleggioTable.style.display = "table";
    let tbody = prodottiNoleggioTable.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    for(let arr of prodottiNoleggio){
        let tr = document.createElement("tr");
        for(let item of arr){
            let td = document.createElement("td");
            td.textContent = item;
            tr.appendChild(td);
        }
        let tdIcon = document.createElement("td");
        tdIcon.innerHTML = `<i class='bx bx-trash deleteProduct' ></i>`;
        tr.appendChild(tdIcon);
        tbody.appendChild(tr);
        setDeleteProductListeners();
    }
}

function setDeleteProductListeners(){
    let icons = document.getElementsByClassName("deleteProduct");
    for(let icon of icons){
        if(!icon.getAttribute("isListening")){
            icon.addEventListener("click", () => {
                let id = icon.parentNode.previousSibling.previousSibling.previousSibling.textContent;
                let qta = icon.parentNode.previousSibling.textContent;
                let index = 0;
                for(let arr of prodottiNoleggio){
                    if(arr[0] == id){
                        if(qta > 1){ //Diminuire quantità
                            arr[2] -= 1;
                        }else{ //Eliminare prodotto
                            prodottiNoleggio.splice(index, 1);
                        }
                        break;
                    }
                    index++;
                }
                printTable();
            });
            icon.setAttribute("isListening", "true");
        }
    }
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

document.getElementById("btnCloseModal").addEventListener("click", () => {
    html5QrCode.stop();
});