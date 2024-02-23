const dotenv = require('dotenv');
dotenv.config({ path: './test.env' });
const db = require("./../database/db");
const Categoria = require("../models/Categoria");
const categoriaMapper = require("../models/mappers/categoriaMapper");

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
    let result = await categoriaMapper.getAll();
    expect(result.length).toBeGreaterThan(0);
    for(let item of result){
        expect(item instanceof Categoria).toBeTruthy();
        expect(item.nome).toBeDefined();
    }
});

test("_02_getByNome_Exists", async() => {
    let result = await categoriaMapper.getByNome("Film");
    expect(result).not.toBeNull();
    expect(result instanceof Categoria).toBeTruthy();
    expect(result.nome).toBe("Film");
});

test("_03_getByNome_NotExists", async() => {
    let result = await categoriaMapper.getByNome("DoesNotExists");
    expect(result).toBeNull();
});

test("_04_insertCategoria", async() =>{
    let result = await categoriaMapper.insertCategoria("NewCategoria");
    let insertResult = await categoriaMapper.getByNome("NewCategoria");
    expect(insertResult instanceof Categoria).toBeTruthy();
    expect(insertResult.nome).toBe("NewCategoria");
});

test("_05_deleteCategoria", async() =>{
    let result = await categoriaMapper.deleteCategoria("Film");
    expect(result).toBeTruthy();
    let deleteResult = await categoriaMapper.getByNome("Film");
    expect(deleteResult).toBeNull();
});