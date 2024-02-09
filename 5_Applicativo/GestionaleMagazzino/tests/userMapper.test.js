const dotenv = require('dotenv');
dotenv.config({ path: './test.env' });
const db = require("./../database/db");

test('adds 1 + 2 to equal 3', async () => {
    const [result] = await db.query("SELECT * FROM utente");
    console.log(result)
    expect(1 + 2).toBe(3);
});