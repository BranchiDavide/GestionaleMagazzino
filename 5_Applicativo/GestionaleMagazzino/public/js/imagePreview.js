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