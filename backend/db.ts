import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user:'postgres',
    host:'localhost',
    database:'slide_snip',
    password:'mono532',
    port:5432,
});

export default pool;