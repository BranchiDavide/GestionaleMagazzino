function tableSearch(value, colIndexes){
    value = value.toUpperCase();
    let table = document.getElementsByClassName("searchable-table")[0];
    let trs = table.getElementsByTagName("tr");
    let colorSwitcher = 0;
    for(let i = 1; i < trs.length; i++){ //Start da 1 per escludere gli headers
        let tds = trs[i].getElementsByTagName("td");
        let found = false;
        for(let x of colIndexes){
            if(tds[x].textContent.toUpperCase().indexOf(value) > -1){
                found = true;
            }
        }
        if(found){
            if(colorSwitcher%2){
                trs[i].style.background = "#eeebf7";
            }else{
                trs[i].style.background = "#ffffff";
            }
            colorSwitcher++;
            trs[i].style.display = "";
        }else{
            trs[i].style.display = "none";
        }
    }
}