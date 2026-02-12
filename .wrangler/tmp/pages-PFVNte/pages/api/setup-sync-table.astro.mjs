globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const POST = async (context) => {
  const runtime = context.locals?.runtime;
  const env = runtime?.env;
  if (!env?.PUMO_DB) {
    return new Response(JSON.stringify({
      success: false,
      error: "PUMO_DB not configured"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    console.log("🗄️ Creating sync_history table in PUMO_DB...");
    await env.PUMO_DB.prepare(`
      CREATE TABLE IF NOT EXISTS sync_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sync_type TEXT NOT NULL DEFAULT 'api_sync',
        started_at TEXT NOT NULL,
        completed_at TEXT,
        status TEXT NOT NULL DEFAULT 'running',
        products_synced INTEGER DEFAULT 0,
        created_count INTEGER DEFAULT 0,
        updated_count INTEGER DEFAULT 0,
        error_count INTEGER DEFAULT 0,
        duration_ms INTEGER,
        error_message TEXT,
        metadata TEXT -- JSON for additional sync info
      )
    `).run();
    await env.PUMO_DB.prepare(`
      CREATE INDEX IF NOT EXISTS idx_sync_history_started_at 
      ON sync_history(started_at DESC)
    `).run();
    await env.PUMO_DB.prepare(`
      CREATE INDEX IF NOT EXISTS idx_sync_history_status 
      ON sync_history(status)
    `).run();
    const tableInfo = await env.PUMO_DB.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='sync_history'
    `).first();
    if (!tableInfo) {
      throw new Error("Failed to create sync_history table");
    }
    const testResult = await env.PUMO_DB.prepare(`
      INSERT INTO sync_history (sync_type, started_at, status, metadata)
      VALUES ('migration', ?, 'success', ?)
    `).bind(
      (/* @__PURE__ */ new Date()).toISOString(),
      JSON.stringify({
        action: "create_sync_history_table",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      })
    ).run();
    console.log("✅ sync_history table created successfully");
    return new Response(JSON.stringify({
      success: true,
      data: {
        table_created: "sync_history",
        test_record_id: testResult.meta.last_row_id,
        message: "Database migration completed - sync_history table ready"
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("❌ Database migration error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const GET = async (context) => {
  const runtime = context.locals?.runtime;
  const env = runtime?.env;
  if (!env?.PUMO_DB) {
    return new Response(JSON.stringify({
      success: false,
      error: "PUMO_DB not configured"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const tableExists = await env.PUMO_DB.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='sync_history'
    `).first();
    let syncHistory = null;
    if (tableExists) {
      const { results } = await env.PUMO_DB.prepare(`
        SELECT * FROM sync_history 
        ORDER BY started_at DESC 
        LIMIT 10
      `).all();
      syncHistory = results;
    }
    return new Response(JSON.stringify({
      success: true,
      data: {
        table_exists: !!tableExists,
        sync_history: syncHistory,
        message: tableExists ? "sync_history table exists" : "sync_history table not found - run POST to create"
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("❌ Database check error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
