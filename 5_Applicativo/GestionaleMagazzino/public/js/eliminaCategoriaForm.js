const form = document.getElementById("deleteCategoriaForm");

form.addEventListener('submit', (e) => {
    e.preventDefault();
    swal({
        title: "Sei sicuro di voler eliminare questa categoria?",
        text: "L'eliminazione della categoria è immediata, quindi non sarà possibile recuperarla in alcun modo.",
        icon: "warning",
        buttons: {
        cancel: "Annulla",
        confirm: {
            text: "Si",
            value: "yes",
            className: "confirm-btn"
        }
        },
    }).then(async (value) => {
        if (value === "yes") {
            form.submit();
        }
    });
});
