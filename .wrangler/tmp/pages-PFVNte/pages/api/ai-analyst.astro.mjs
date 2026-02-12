globalThis.process ??= {}; globalThis.process.env ??= {};
import { withFeatureMiddleware } from '../../chunks/api-middleware_MytvPj0_.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const AI_ANALYST_PROMPTS = {
  category: `Jesteś ekspertem od e-commerce analytics. Analizujesz dane kategorii produktów:
  - Hit rate (% zapytań z wynikami)
  - Liczba produktów vs zapytania
  - Konwersje i przychody
  
  Zidentyfikuj problemy i zaproponuj konkretne działania.`,
  queries: `Jesteś analitykiem zapytań użytkowników. Analizujesz:
  - Zapytania z niskim hit rate
  - Popularne zapytania bez wyników
  - Trendy w wyszukiwaniach
  
  Zaproponuj produkty/kategorie do dodania.`,
  utm: `Jesteś ekspertem od marketingu cyfrowego. Analizujesz UTM performance:
  - CTR kampanii
  - Conversion rates
  - ROI różnych źródeł ruchu
  
  Zoptymalizuj kampanie dla lepszych wyników.`,
  general: `Jesteś AI analitykiem biznesowym. Przeanalizuj dane i wygeneruj insights oraz rekomendacje.`
};
async function runD1Query(env, query, params = []) {
  try {
    if (!env.ANALYTICS_DB) {
      throw new Error("ANALYTICS_DB binding not found");
    }
    const result = await env.ANALYTICS_DB.prepare(query).bind(...params).all();
    return result;
  } catch (error) {
    console.error("D1 Query Error:", error);
    throw error;
  }
}
async function analyzeWithAI(env, prompt, data) {
  try {
    const aiPrompt = `${prompt}

Dane do analizy:
${JSON.stringify(data, null, 2)}

Wygeneruj krótką analizę (max 300 słów) z konkretnymi rekomendacjami w języku polskim.`;
    if (env.AI) {
      const response = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
        messages: [
          {
            role: "system",
            content: "Jesteś ekspertem od e-commerce analytics. Odpowiadaj zwięźle i konkretnie."
          },
          {
            role: "user",
            content: aiPrompt
          }
        ],
        max_tokens: 512
      });
      return response.response || "Analiza niedostępna";
    }
    return "Analiza danych jest dostępna, ale AI model nie jest skonfigurowany.";
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return `Błąd analizy: ${error instanceof Error ? error.message : "Nieznany błąd"}`;
  }
}
async function getCategoryAnalysis(env) {
  const query = `
    SELECT 
      category,
      total_products,
      total_queries,
      hit_rate,
      total_clicks,
      total_conversions,
      total_revenue,
      coverage_status,
      priority_score
    FROM v_category_dashboard
    ORDER BY priority_score DESC
    LIMIT 10
  `;
  return await runD1Query(env, query);
}
async function getLowHitQueries(env) {
  const query = `
    SELECT 
      user_query,
      total_requests,
      hit_rate,
      avg_products_found,
      last_requested
    FROM v_low_hit_queries
    ORDER BY total_requests DESC, hit_rate ASC
    LIMIT 10
  `;
  return await runD1Query(env, query);
}
async function getUTMPerformance(env) {
  const query = `
    SELECT 
      utm_campaign,
      SUM(total_clicks) as clicks,
      SUM(total_conversions) as conversions,
      SUM(total_revenue) as revenue,
      AVG(avg_ctr) as ctr,
      AVG(avg_conversion_rate) as conversion_rate
    FROM v_daily_utm_performance
    WHERE date >= date('now', '-7 days')
    GROUP BY utm_campaign
    ORDER BY revenue DESC
    LIMIT 10
  `;
  return await runD1Query(env, query);
}
async function getAISuccessAnalysis(env) {
  const query = `
    SELECT 
      date,
      query_type,
      total_queries,
      success_rate,
      avg_response_time,
      total_tokens
    FROM v_ai_success_analysis
    ORDER BY date DESC
    LIMIT 14
  `;
  return await runD1Query(env, query);
}
const POST = async (context) => {
  return withFeatureMiddleware(
    "ai-rag-chat",
    // Używamy istniejącego feature ID
    context,
    "public",
    async ({ request, locals }) => {
      try {
        const body = await request.json();
        const { query, type = "general", timeframe = "week" } = body;
        if (!query || query.trim().length === 0) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Query parameter is required"
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }
        const runtime = locals?.runtime;
        const env = runtime?.env;
        if (!env) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Environment not available"
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" }
            }
          );
        }
        let data = {};
        let prompt = AI_ANALYST_PROMPTS.general;
        const recommendations = [];
        switch (type) {
          case "category":
            data.categories = await getCategoryAnalysis(env);
            prompt = AI_ANALYST_PROMPTS.category;
            recommendations.push("Dodaj produkty do kategorii z high priority score");
            recommendations.push("Popraw SEO dla kategorii z niskim hit rate");
            break;
          case "queries":
            data.lowHitQueries = await getLowHitQueries(env);
            prompt = AI_ANALYST_PROMPTS.queries;
            recommendations.push("Dodaj produkty dla popularnych zapytań bez wyników");
            recommendations.push("Optymalizuj zawartość przewodników");
            break;
          case "utm":
            data.utmPerformance = await getUTMPerformance(env);
            prompt = AI_ANALYST_PROMPTS.utm;
            recommendations.push("Zwiększ budżet na kampanie z wysokim ROI");
            recommendations.push("Popraw landing pages dla kampanii z niskim CR");
            break;
          case "general":
          default:
            data.categories = await getCategoryAnalysis(env);
            data.lowHitQueries = await getLowHitQueries(env);
            data.utmPerformance = await getUTMPerformance(env);
            data.aiSuccess = await getAISuccessAnalysis(env);
            break;
        }
        const analysis = await analyzeWithAI(env, prompt, data);
        const response = {
          success: true,
          analysis,
          data,
          recommendations,
          charts: [
            {
              type: "bar",
              title: "Hit Rate by Category",
              data: data.categories?.results || []
            },
            {
              type: "line",
              title: "UTM Performance Trends",
              data: data.utmPerformance?.results || []
            }
          ]
        };
        console.log(`[AI Analyst] ${type} analysis completed for query: "${query}"`);
        return new Response(
          JSON.stringify(response),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "X-Analysis-Type": type,
              "X-Data-Points": String(Object.keys(data).length)
            }
          }
        );
      } catch (error) {
        console.error("[AI Analyst Error]:", error);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Analysis failed",
            details: error instanceof Error ? error.message : "Unknown error"
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }
  );
};
const GET = async (context) => {
  return withFeatureMiddleware(
    "ai-rag-chat",
    context,
    "public",
    async ({ url, locals }) => {
      try {
        const runtime = locals?.runtime;
        const env = runtime?.env;
        if (!env) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Environment not available"
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" }
            }
          );
        }
        const stats = {
          database_status: env.ANALYTICS_DB ? "connected" : "disconnected",
          ai_status: env.AI ? "available" : "unavailable",
          available_analyses: ["category", "queries", "utm", "general"],
          sample_queries: [
            "Jakie produkty mają najniższy CTR?",
            "Które kategorie mają zero coverage?",
            "Pokaż mi UTM performance za tydzień",
            "Sugeruj nowe przewodniki na podstawie popularnych zapytań"
          ]
        };
        return new Response(
          JSON.stringify({
            success: true,
            message: "AI Analyst is ready",
            stats,
            endpoint_info: {
              method: "POST",
              required_fields: ["query"],
              optional_fields: ["type", "timeframe"],
              response_format: "AnalysisResponse"
            }
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
