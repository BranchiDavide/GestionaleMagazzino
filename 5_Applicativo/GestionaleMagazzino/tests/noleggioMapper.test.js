const dotenv = require('dotenv');
dotenv.config({ path: './test.env' });
const db = require("./../database/db");
const Noleggio = require("../models/Noleggio");
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

test("_01_getAll", async() =>{
    let result = await noleggioMapper.getAll();
    expect(result.length).toBeGreaterThan(0);
    for(let item of result){
        expect(item instanceof Noleggio).toBeTruthy();
        expect(item.nome).toBeDefined();
        expect(item.idUtente).toBeDefined();
    }
});

test("_02_getById_Exists", async() =>{
    let result = await noleggioMapper.getById(1);
    expect(result).not.toBeNull();
    expect(result instanceof Noleggio).toBeTruthy();
    expect(result.nome).toBeDefined();
    expect(result.idUtente).toBeDefined();
    expect(result.id).toBe(1);
});

test("_03_getById_NotExists", async() =>{
    let result = await noleggioMapper.getById(200);
    expect(result).toBeNull();
});

test("_04_getMaterialeOfNoleggio", async() =>{
    let expectedResult = [
        [new Materiale(1, "Television", "/path/to/photo35.jpg", 8, 0, 1, "Elettronica"), 2],
        [new Materiale(4, "Garden hose", "/path/to/photo38.jpg", 12, 0, 1, "Giardino"), 1]
    ];
    let actualResult = await noleggioMapper.getMaterialeOfNoleggio(1);
    expect(actualResult).toEqual(expectedResult);
});

test("_05_insertNoleggio", async() =>{
    let materiali = [
        [new Materiale(1, "Television", "/path/to/photo35.jpg", 8, 0, 1, "Elettronica"), 8],
        [new Materiale(4, "Garden hose", "/path/to/photo38.jpg", 12, 0, 1, "Giardino"), 5]
    ];
    let materialiAfterInsert = [
        [new Materiale(1, "Television", "/path/to/photo35.jpg", 0, 0, 0, "Elettronica"), 8],
        [new Materiale(4, "Garden hose", "/path/to/photo38.jpg", 7, 0, 1, "Giardino"), 5]
    ];
    let result = await noleggioMapper.insertNoleggio("NewNoleggio", "/path/to/photoXY.jpg", "2024-03-01", "2024-04-01", 1, 0, materiali);
    let materialiResult = await noleggioMapper.getMaterialeOfNoleggio(result);
    expect(result).toBeDefined();
    expect(materialiResult).toEqual(materialiAfterInsert);
    let mat1 = await materialeMapper.getByCodice(1);
    let mat2 = await materialeMapper.getByCodice(4);
    expect(mat1.quantita).toBe(0);
    expect(mat1.isDisponibile).toBe(0);
    expect(mat2.quantita).toBe(7);
    expect(mat2.isDisponibile).toBe(1);
});

test("_06_closeNoleggio", async() =>{
    let result = await noleggioMapper.closeNoleggio(1, 0);
    expect(result).toBeTruthy();
    let noleggioDeleted = await noleggioMapper.getById(1);
    expect(noleggioDeleted).toBeNull();
    let materialiNoleggioDeleted = await noleggioMapper.getMaterialeOfNoleggio(1);
    expect(materialiNoleggioDeleted).toEqual([]);
    let mat1Expected = new Materiale(1, "Television", "/path/to/photo35.jpg", 10, 0, 1, "Elettronica");
    let mat2Expected = new Materiale(4, "Garden hose", "/path/to/photo38.jpg", 13, 0, 1, "Giardino");
    let mat1 = await materialeMapper.getByCodice(1);
    let mat2 = await materialeMapper.getByCodice(4);
    expect(mat1).toEqual(mat1Expected);
    expect(mat2).toEqual(mat2Expected);
});

test("_07_changeIdUtenteToNome", async() =>{
    let noleggi = await noleggioMapper.getAll();
    noleggi = await noleggioMapper.changeIdUtenteToNome(noleggi);
    for(let item of noleggi){
        expect(typeof item.idUtente).toBe("string")
    }
});

test("_08_getNoleggiOfUtente", async() =>{
    let result = await noleggioMapper.getNoleggiOfUtente(1);
    expect(result.length).toBeGreaterThan(0);
    for(let item of result){
        expect(item instanceof Noleggio).toBeTruthy();
        expect(item.nome).toBeDefined();
        expect(item.idUtente).toBeDefined();
        expect(item.idUtente).toBe(1);
    }
});

test("_09_getNoleggiByNoleggiId", async () => {
    let id = [1,2,3,4,5,5];
    let result = await noleggioMapper.getNoleggiByNoleggiId(id);
    expect(result.length).toBeGreaterThan(0);
});

test("_10_changeIdUtenteToNome_Singolo", async() =>{
    let noleggi = await noleggioMapper.getById(1);
    noleggi = await noleggioMapper.changeIdUtenteToNome(noleggi);
    expect(typeof noleggi.idUtente).toBe("string");
});

test("_11_changeIdUtenteToNome_Singolo", async() =>{
    let noleggi = await noleggioMapper.getById(1);
    noleggi = await noleggioMapper.changeIdUtenteToNome(noleggi);
    expect(typeof noleggi.idUtente).toBe("string");
});

test("_12_getAllByDate", async() =>{
    let noleggi = await noleggioMapper.getAllByDate();
    let lastChecked = null;
    for(let item of noleggi){
        if(lastChecked){
            expect(new Date(item.dataFine).getTime()).toBeGreaterThanOrEqual(new Date(lastChecked).getTime());
        }
        lastChecked = item.dataFine;
    }
});
