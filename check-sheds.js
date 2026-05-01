const { createServerSupabaseClient } = require('./lib/supabase.ts');

async function checkShedsTable() {
  try {
    console.log('Verificando conexión a Supabase...');
    const supabase = createServerSupabaseClient();
    console.log('Cliente creado, consultando tabla sheds...');

    const { data, error } = await supabase.from('sheds').select('*').limit(1);

    if (error) {
      console.log('❌ Tabla sheds NO existe:', error.message);
      return false;
    } else {
      console.log('✅ Tabla sheds existe');
      console.log('Datos de ejemplo:', data);
      return true;
    }
  } catch (err) {
    console.log('❌ Error conectando a Supabase:', err.message);
    return false;
  }
}

checkShedsTable();