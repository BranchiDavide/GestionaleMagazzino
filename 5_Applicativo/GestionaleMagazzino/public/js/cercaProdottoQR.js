const html5QrCode = new Html5Qrcode("reader");
const searchButton = document.getElementById("search-prod-qr-button");
const closeModalButton = document.getElementById("btnCloseModal");
const loadingGif = `<center><img width="100" height="100" src="/img/noleggio/loading.gif"></center>`;

function isTablet() {
    if (/iPad|Android|tablet|kindle/i.test(navigator.userAgent)) {
        return true;
    }
    return false;
}

async function fetchProdotto(id){
    let result = await fetch(`/prodotti/${id}?json=true`);
    if(result.status == 404){
        return null;
    }else{
        return await result.json();
    }
}

searchButton.addEventListener("click", async () => {
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
                    let product = await fetchProdotto(qrCodeMessage);
                    if(product){
                        window.location.href = `/prodotti/${product.codice}`;
                    }else{
                        swal({
                            title: "Prodotto non trovato!",
                            icon: "error"
                        });
                    }
                    $("#exampleModal").modal("hide");
                })
                .catch(err => {
                    swal({
                        title: "Si è verificato un errore!",
                        text: "Impossibile scannerizzare i prodotti, controllare permesso fotocamera!",
                        icon: "error"
                    });
            });
        }
    }).catch(err => {
        swal({
            title: "Si è verificato un errore!",
            text: "Impossibile scannerizzare i prodotti, controllare permesso fotocamera!",
            icon: "error"
        });
    });
});

$('#exampleModal').on('click', function (e) {
    if (e.target === this) {
        html5QrCode.stop();
        $('#exampleModal').modal('hide');
    }
});

closeModalButton.addEventListener("click", () => {
    html5QrCode.stop();
});
