const dotenv = require('dotenv');
dotenv.config({ path: './test.env' });
const db = require("./../database/db");
const User = require("./../models/User");
const userMapper = require("./../models/mappers/userMapper");

//Chiusura connessione db al termine di tutti i tests
afterAll(done => {
    db.end();
    done();
});

//Creazione e rollback di una transazione per tutti i test in modo
//da garantire il corretto funzionamento di tutti i test
beforeEach(async () => {
   await db.query("START TRANSACTION");
});

afterEach(async () => {
    await db.query("ROLLBACK");
});

test("_01_getAll", async () => {
    let result = await userMapper.getAll();
    expect(result.length).toBeGreaterThan(0);
    for(let item of result){
        expect(item instanceof User).toBeTruthy();
        expect(item.email).toBeDefined();
        expect(item.password).toBeDefined();
    }
});

test("_02_getByEmail_Exists", async () => {
    let result = await userMapper.getByEmail("sophia.taylor@example.com");
    expect(result).not.toBeNull();
    expect(result instanceof User).toBeTruthy();
    expect(result.email).toBeDefined();
    expect(result.password).toBeDefined();
    expect(result.email).toBe("sophia.taylor@example.com");
});

test("_03_getByEmail_NotExists", async () => {
    let result = await userMapper.getByEmail("does.not@exists.com");
    expect(result).toBeNull();
});

test("_04_getById_Exists", async () => {
    let result = await userMapper.getById(2);
    expect(result).not.toBeNull();
    expect(result instanceof User).toBeTruthy();
    expect(result.email).toBeDefined();
    expect(result.password).toBeDefined();
    expect(result.id).toBe(2);
});

test("_05_getById_NotExists", async () => {
    let result = await userMapper.getById(200);
    expect(result).toBeNull();
});

test("_06_insertUser", async () => {
    let result = await userMapper.insertUser("NewUser", "LastName", "/path/to/photoXY.jpg", "1970-01-01", "new@test.ch", "269a7595f623c7391801c75f738af128e420812c214aa4e05a949f35763e3b78", "gestore");
    expect(result).toBeDefined();
    expect(result).toBeGreaterThan(0);
    let insertResult = await userMapper.getById(result);
    expect(insertResult instanceof User).toBeTruthy();
    expect(insertResult.nome).toBe("NewUser");
});

test("_07_updateUser", async () => {
    let user = await userMapper.getById(1);
    user.nome = "UpdatedUser";
    user.cognome = "UpdatedLastName";
    let result = await userMapper.updateUser(user.id, user.nome, user.cognome, user.riferimentoFoto, user.dataNascita, user.email, user.password, user.ruolo);
    expect(result).toBeTruthy();
    let userUpdated = await userMapper.getById(1);
    expect(userUpdated.nome).toBe("UpdatedUser");
    expect(userUpdated.cognome).toBe("UpdatedLastName");
});

test("_08_deleteUser", async () => {
    let result = await userMapper.deleteUser(1);
    let userDeleted = await userMapper.getById(1);
    expect(result).toBeTruthy();
    expect(userDeleted).toBeNull();
});