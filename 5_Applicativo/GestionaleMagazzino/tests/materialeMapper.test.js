const dotenv = require('dotenv');
dotenv.config({ path: './test.env' });
const db = require("./../database/db");
const Materiale = require("../models/Materiale");
const noleggioMapper = require("../models/mappers/noleggioMapper");
const materialeMapper = require("../models/mappers/materialeMapper");

afterAll(done => {
    db.end();
    done();
});

beforeEach(async () => {
    await db.query("START TRANSACTION");
});

afterEach(async () => {
    await db.query("ROLLBACK");
});

test("_01_getAll", async() => {
    let result = await materialeMapper.getAll();
    expect(result.length).toBeGreaterThan(0);
    for(let item of result){
        expect(item instanceof Materiale).toBeTruthy();
        expect(item.nome).toBeDefined();
    }
});

test("_02_getByCodice_Exists", async() => {
    let result = await materialeMapper.getByCodice(4);
    expect(result).not.toBeNull();
    expect(result instanceof Materiale).toBeTruthy();
    expect(result.codice).toBe(4);
});

test("_03_getByCodice_NotExists", async() => {
    let result = await materialeMapper.getByCodice(200);
    expect(result).toBeNull();
});

test("_04_insertMateriale", async() => {
    let result = await materialeMapper.insertMateriale("NewMateriale", "/path/to/photoXY.jpg", 44, 0, 1, "Film");
    expect(result).toBeGreaterThan(0);
    let insertResult = await materialeMapper.getByCodice(result);
    expect(insertResult instanceof Materiale).toBeTruthy();
    expect(insertResult.nome).toBe("NewMateriale");
});

test("_05_updateMateriale", async() => {
    let materiale = await materialeMapper.getByCodice(1);
    materiale.nome = "UpdatedMateriale";
    materiale.quantita = 22;
    let result = await materialeMapper.updateMateriale(materiale.codice, materiale.nome, materiale.riferimentoFoto, materiale.quantita, materiale.isConsumabile, materiale.isDisponibile, materiale.categoria);
    expect(result).toBeTruthy();
    let resultUpdate = await materialeMapper.getByCodice(1);
    expect(resultUpdate.nome).toBe("UpdatedMateriale");
    expect(resultUpdate.quantita).toBe(22);
});

test("_06_deleteUser", async() => {
    let result = await materialeMapper.deleteMateriale(1);
    expect(result).toBeTruthy();
    let resultDelete = await materialeMapper.getByCodice(1);
    expect(resultDelete).toBeNull();
});

test("_07_updateQuantita_Inc", async() => {
    let result = await materialeMapper.updateQuantita(1, 10);
    expect(result).toBeTruthy();
    let resultUpdateQuantita = await materialeMapper.getByCodice(1);
    expect(resultUpdateQuantita.quantita).toBe(18);
});

test("_08_updateQuantita_Dec", async() => {
    let result = await materialeMapper.updateQuantita(1, -2);
    expect(result).toBeTruthy();
    let resultUpdateQuantita = await materialeMapper.getByCodice(1);
    expect(resultUpdateQuantita.quantita).toBe(6);
});

test("_09_updateQuantita_DecMaxTo0", async() => {
    let result = await materialeMapper.updateQuantita(1, -200);
    expect(result).toBeTruthy();
    let resultUpdateQuantita = await materialeMapper.getByCodice(1);
    expect(resultUpdateQuantita.quantita).toBe(0);
});

test("_10_updateQuantita_SetIsDisponibile", async() => {
    let result = await materialeMapper.updateQuantita(1, -200);
    expect(result).toBeTruthy();
    let resultUpdateQuantita = await materialeMapper.getByCodice(1);
    expect(resultUpdateQuantita.isDisponibile).toBe(0);
    let result2 = await materialeMapper.updateQuantita(1, 20);
    expect(result2).toBeTruthy();
    let resultUpdateQuantita2 = await materialeMapper.getByCodice(1);
    expect(resultUpdateQuantita2.isDisponibile).toBe(1);
});

test("_11_search_Exists", async() => {
    let result = await materialeMapper.search("co");
    expect(result.length).toBeGreaterThan(0);
    for(let item of result){
        expect(item instanceof Materiale).toBeTruthy();
        expect(item.nome).toBeDefined();
    }
});

test("_12_search_NotExists", async() => {
    let result = await materialeMapper.search("DoesNotExists");
    expect(result).toEqual([]);
});

test("_13_getNoleggiIdByMaterialeCodice", async() => {
    const result = await materialeMapper.getNoleggiIdByMaterialeCodice(4);
    expect(result.length).toBeGreaterThan(0);
});

test("_14_getNoleggiIdByMaterialeCodice_notExists", async() => {
    const result = await materialeMapper.getNoleggiIdByMaterialeCodice(1555);
    expect(result).toEqual([]);
});

test("_15_getQuantitaMaterialeNoleggio", async () => {
    const result = await materialeMapper.getQuantitaMaterialeNoleggio(1, 1);
    expect(result).toBe(2);
});

test("_16_getDataDisponibilitaByNoleggi", async () => {
    const noleggiId = await materialeMapper.getNoleggiIdByMaterialeCodice(4);
    const noleggi = await noleggioMapper.getNoleggiByNoleggiId(noleggiId);
    const result = materialeMapper.getDataDisponibilitaByNoleggi(noleggi);
    
    expect(result).toBeDefined();
    expect(result).toEqual("25.01.2024");
});
