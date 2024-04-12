const dotenv = require('dotenv');
dotenv.config({ path: './test.env' });
const db = require("./../database/db");
const NoleggioArchivio = require("../models/NoleggioArchivio");
const Materiale = require("../models/Materiale");
const noleggioArchivioMapper = require("./../models/mappers/noleggioArchivioMapper");

afterAll(done => {
    db.end();
    done();
});

beforeEach(async () => {
    await db.query("START TRANSACTION");
    //Eliminazione di un noleggio per avere dei dati di test in archivio
    const noleggioMapper = require("./../models/mappers/noleggioMapper");
    const materialeNoleggio = await noleggioMapper.getMaterialeOfNoleggio(1);
    await noleggioMapper.closeNoleggio(1, 0, materialeNoleggio);
});

afterEach(async () => {
    await db.query("ROLLBACK");
});

test("_01_getAll", async() => {
    let result = await noleggioArchivioMapper.getAll();
    expect(result.length).toBeGreaterThan(0);
    for(let item of result){
        expect(item instanceof NoleggioArchivio).toBeTruthy();
        expect(item.nome).toBeDefined();
        expect(item.idUtente).toBeDefined();
    }
});

test("_02_getById_Exists", async() => {
    let result = await noleggioArchivioMapper.getById(1);
    expect(result).not.toBeNull();
    expect(result instanceof NoleggioArchivio).toBeTruthy();
    expect(result.nome).toBeDefined();
    expect(result.idUtente).toBeDefined();
    expect(result.idNoleggio).toBe(1);
});

test("_03_getById_NotExists", async () => {
    let result = await noleggioArchivioMapper.getById(200);
    expect(result).toBeNull();
});

test("_04_getMaterialeOfNoleggio", async() => {
    let result = await noleggioArchivioMapper.getMaterialeOfNoleggio(1);
    expect(result.length).toBeGreaterThan(0);
    for(let arr of result){
        expect(arr[0] instanceof Materiale).toBeTruthy();
        expect(Number.isInteger(arr[1])).toBeTruthy();
    }
});

test("_05_getAllByDate", async() => {
    let result = await noleggioArchivioMapper.getAllByDate();
    let lastChecked = null;
    for(let item of result){
        if(lastChecked){
            expect(new Date(item.dataFine).getTime()).toBeGreaterThanOrEqual(new Date(lastChecked).getTime());
        }
        lastChecked = item.dataFine;
    }
});