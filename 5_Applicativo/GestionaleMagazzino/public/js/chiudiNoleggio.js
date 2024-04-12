const html5QrCode = new Html5Qrcode("reader");
const addProductBtn = document.getElementById("addProduct-btn")
const closeBtn = document.getElementById("close-btn");
const closeForceBtn = document.getElementById("close-force-btn");
const closeForceDiv = document.getElementsByClassName("close-force-div")[0];
const toScanTable = document.getElementsByClassName("toScanTable")[0];
const scannedTable = document.getElementsByClassName("scannedTable")[0];
const form = document.getElementsByTagName("form")[0];
const hiddenInput = document.getElementById("postProdottiNoleggio");
const loadingGif = `<center><img width="100" height="100" src="/img/noleggio/loading.gif"></center>`;
const checkboxes = document.getElementsByClassName("cons-cb");
const consumabileCheckbox = `<input style="width: 25px; height: 25px;" class="form-check-input cons-cb" type="checkbox" id="checkboxNoLabel" value="" aria-label="...">`;
let toScanProducts = [];
let scannedProducts = [];

addProductBtn.addEventListener("click", async () => {
    document.getElementById("reader").innerHTML = loadingGif;
    const isMobile = navigator.userAgentData.mobile;
    let scanOptions = {
        fps: 10,
        qrbox: 200
    }
    if(isMobile || isTablet()){
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
            html5QrCode.start(
                cameraId,
                scanOptions,
                async qrCodeMessage => {
                    html5QrCode.stop();
                    if(addScannedProduct(qrCodeMessage)){
                        updateTables();
                        updateButtons();
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

function addScannedProduct(id){
    let found = false;
    for(let arr of toScanProducts){
        if(arr[0] == id){
            found = true;
            insertIntoScannedProducts(arr);
            removeFromToScanProducts(arr);
            break;
        }
    }
    return found;
}

function insertIntoScannedProducts(product){
    let alreadyInserted = false;
    for(let arr of scannedProducts){
        if(arr[0] == product[0]){
            arr[2]++;
            alreadyInserted = true;
            break;
        }
    }
    if(!alreadyInserted){
        let newProduct = new Array(product[0], product[1], product[2]);
        newProduct[2] = 1;
        scannedProducts.push(newProduct);
    }
}

function removeFromToScanProducts(product){
    for(let arr of toScanProducts){
        if(arr[0] == product[0]){
            if(arr[2] - 1 > 0){
                arr[2]--;
            }else{
                toScanProducts.splice(toScanProducts.indexOf(arr), 1);
            }
            break;
        }
    }
}

$('#exampleModal').on('click', function (e) {
    if (e.target === this) {
        html5QrCode.stop();
        $('#exampleModal').modal('hide');
    }
});

window.onload = () =>{
    //Lettura dei prodotti da scansionare e memorizzazione nell'array toScanProducts
    let tbody = toScanTable.getElementsByTagName("tbody")[0];
    let trs = tbody.getElementsByTagName("tr");
    for(let tr of trs){
        let tds = tr.getElementsByTagName("td");
        let tmpProduct = [];
        for(let td of tds){
            tmpProduct.push(td.textContent.trim());
        }
        toScanProducts.push(tmpProduct);
    }
    setCheckboxesListeners();
}

form.addEventListener("submit", () => {
    hiddenInput.value = JSON.stringify(scannedProducts);
});

function updateToScanTable(){
    let tbody = toScanTable.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    for(let arr of toScanProducts){
        let tr = document.createElement("tr");
        for(let item of arr){
            let td = document.createElement("td");
            if(item == ""){
                td.innerHTML = consumabileCheckbox;
            }else{
                td.textContent = item;
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}

function updateScannedTable(){
    let tbody = scannedTable.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    for(let arr of scannedProducts){
        let tr = document.createElement("tr");
        for(let item of arr){
            let td = document.createElement("td");
            td.textContent = item;
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}

function updateTables(){
    updateToScanTable();
    updateScannedTable();
    setCheckboxesListeners();
}

function updateButtons(){
    let allChecked = true;
    for(let checkbox of checkboxes){
        if(!checkbox.checked){
            allChecked = false;
            break;
        }
    }
    for(let arr of toScanProducts){
        if(arr[3] == "Non consumabile"){
            allChecked = false;
            break;
        }
    }
    if(toScanProducts.length == 0 || allChecked){
        addProductBtn.style.display = "none";
        addProductBtn.nextElementSibling.style.display = "none";
        closeBtn.removeAttribute("disabled");
        closeBtn.classList.remove("btn-outline-danger");
        closeBtn.classList.add("btn-danger");
        closeForceDiv.style.display = "none";
    }else{
        addProductBtn.style.display = "";
        addProductBtn.nextElementSibling.style.display = "block";
        closeBtn.setAttribute("disabled", "");
        closeBtn.classList.remove("btn-danger");
        closeBtn.classList.add("btn-outline-danger");
        closeForceDiv.style.display = "block";
    }
}

function setCheckboxesListeners(){
    for(let checkbox of checkboxes){
        if(!checkbox.getAttribute("isListening")){
            checkbox.addEventListener("click", () => {
                updateButtons();
            });
            checkbox.setAttribute("isListening", "true");
        }
    }
}

function isTablet() {
    if (/iPad|Android|tablet|kindle/i.test(navigator.userAgent)) {
        return true;
    }
    return false;
}

closeForceBtn.addEventListener("click", (e) => {
    if(confirm("Sei sicuro di voler chiudere in maniera forzata questo noleggio?\n\nLa chiusura forzata deve essere utilizzata unicamente in caso di smarrimento di prodotti")){
        form.action = form.action.replace("chiudi", "chiudi-force");
    }else{
        e.preventDefault();
    }
});

document.getElementById("btnCloseModal").addEventListener("click", () => {
    html5QrCode.stop();
});