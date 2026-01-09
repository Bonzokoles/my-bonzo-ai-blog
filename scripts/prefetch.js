// Critical paths - run via GitHub Actions or cron
const paths = [
  '/pumo-guide/',
  '/pumo-guide/Łóżka_i_części_Łóżka/',
  '/pumo-guide/Biurka_Biurka_narożne/',
  '/pumo-guide/Sofy_i_narożniki_Sofy_2_osobowe/'
];

console.log('🔄 Starting prefetch sequence...');

Promise.all(paths.map(path => {
  const url = `https://mybonzoaiblog.com${path}`;
  console.log(`📡 Fetching: ${url}`);
  return fetch(url, { method: 'HEAD' })
    .then(res => {
        if (res.ok) console.log(`✅ Prefetched: ${path} (${res.status})`);
        else console.warn(`⚠️ Failed: ${path} (${res.status})`);
    })
    .catch(err => console.error(`❌ Error fetching ${path}:`, err.message));
})).then(() => {
    console.log('🏁 Prefetch sequence complete.');
});
