let QRCode = require("qrcode");

async function toBase64String(value){
    let qrData = await QRCode.toDataURL(value);
    return qrData;
}

module.exports = {toBase64String};