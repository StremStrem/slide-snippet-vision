import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user:'slide_snip',
    host:'dpg-d1nr67adbo4c73ev3ifg-a.frankfurt-postgres.render.com',
    database:'slide_snip_db',
    password:'PlIbIntp5xoSwI7KPjxf1ZQxTtGsRYxK',
    port:5432,
});

export default pool;