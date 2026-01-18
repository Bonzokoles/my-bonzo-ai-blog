// Critical paths - run via GitHub Actions or cron
const paths = [
  "/pumo-guide/",
  "/pumo-guide/łóżka-i-części-łóżka/",
  "/pumo-guide/biurka-biurka-narożne/",
  "/pumo-guide/sofy-i-narożniki-sofy-2-osobowe/",
];

console.log("🔄 Starting prefetch sequence...");

Promise.all(
  paths.map((path) => {
    const url = `https://mybonzoaiblog.pages.dev${path}`;
    console.log(`📡 Fetching: ${url}`);
    return fetch(url, { method: "HEAD" })
      .then((res) => {
        if (res.ok) console.log(`✅ Prefetched: ${path} (${res.status})`);
        else console.warn(`⚠️ Failed: ${path} (${res.status})`);
      })
      .catch((err) => console.error(`❌ Error fetching ${path}:`, err.message));
  }),
).then(() => {
  console.log("🏁 Prefetch sequence complete.");
});
