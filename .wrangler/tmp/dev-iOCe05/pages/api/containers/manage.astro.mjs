globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, locals }) => {
  try {
    const { action, target = "docker", params } = await request.json();
    const mockContainers = [
      {
        Id: "b580a686f5ef",
        Names: ["/postgres"],
        Image: "postgres:14.4",
        State: "running",
        Status: "Up 37 minutes",
        Ports: [{ PrivatePort: 5432, Type: "tcp" }],
        Created: Math.floor(Date.now() / 1e3) - 2 * 30 * 24 * 60 * 60
      },
      {
        Id: "37b74743b0d8",
        Names: ["/redis"],
        Image: "redis:7.0.7",
        State: "running",
        Status: "Up 37 minutes",
        Ports: [{ PrivatePort: 6379, Type: "tcp" }],
        Created: Math.floor(Date.now() / 1e3) - 2 * 30 * 24 * 60 * 60
      }
    ];
    let result;
    switch (action) {
      case "list":
        result = mockContainers;
        break;
      case "start":
      case "stop":
        result = { success: true, status: 204, message: `Container ${action}ed (simulated)` };
        break;
      case "logs":
        result = { logs: `[INFO] Container ${params.id} logs (simulated)`, container: params.id };
        break;
      default:
        throw new Error(`Nieobsługiwana akcja: ${action}`);
    }
    if (action === "list") {
      const analysis = {
        healthScore: 100,
        recommendations: [
          "Wszystkie kontenery działają poprawnie",
          "System jest stabilny - brak akcji wymaganych"
        ],
        aiAnalysis: "Kontenery PostgreSQL i Redis działają bez problemów. Uptime jest dobry.",
        containers: result
      };
      return new Response(JSON.stringify({
        success: true,
        data: result,
        analysis
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      data: result
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const GET = async ({ url }) => {
  try {
    const action = url.searchParams.get("action") || "list";
    if (action === "list") {
      const containers = [
        { id: "b580a686f5ef", name: "postgres", status: "running" },
        { id: "37b74743b0d8", name: "redis", status: "running" }
      ];
      return new Response(JSON.stringify({
        success: true,
        containers
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      action,
      message: "GET endpoint works"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
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
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
