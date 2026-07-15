(async ()=>{
  const { pool } = require('../db');
  try{
    const res = await pool.query("SELECT column_name,data_type FROM information_schema.columns WHERE table_name='orders' ORDER BY ordinal_position");
    console.log(JSON.stringify(res.rows,null,2));
  }catch(e){
    console.error('Query error:', e.message);
  }finally{
    await pool.end();
  }
})();
