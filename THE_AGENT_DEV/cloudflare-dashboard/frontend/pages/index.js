import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            ZEN_AGENTS_ON_AI_PLATFORM
          </h1>
          <p className="text-xl text-gray-300">
            Scalable Multi-Agent Management Platform
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-semibold mb-4">🤖 Active Agents</h3>
            <div className="text-4xl font-bold text-blue-400 mb-2">0</div>
            <p className="text-gray-400">agents running</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-semibold mb-4">🌐 Browser Sessions</h3>
            <div className="text-4xl font-bold text-purple-400 mb-2">0</div>
            <p className="text-gray-400">active sessions</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
            <h3 className="text-xl font-semibold mb-4">⚡ Performance</h3>
            <div className="text-4xl font-bold text-cyan-400 mb-2">100%</div>
            <p className="text-gray-400">system health</p>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <p className="text-blue-300 text-center">
            ✅ ZENON Dashboard ready - Agent management platform initialized!
          </p>
        </div>
      </div>
    </div>
  );
}
