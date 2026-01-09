export const DASHBOARD_HTML = \`<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pumo Analytics - Advanced Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    :root {
      --bg: #0a0a0a;
      --fg: #e0e0e0;
      --accent: #00ff41;
      --accent2: #0affff;
      --warn: #ff9500;
      --error: #ff3b30;
      --border: #333;
      --panel: #141414;
      --success: #00ff41;
    }
    
    body {
      font-family: 'Courier New', 'Monaco', monospace;
      background: var(--bg);
      color: var(--fg);
      padding: 20px;
      line-height: 1.6;
    }
    
    /* Header */
    .header {
      border-bottom: 2px solid var(--accent);
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header h1 {
      font-size: 28px;
      color: var(--accent);
      letter-spacing: 2px;
    }
    
    .header .controls {
      display: flex;
      gap: 10px;
    }
    
    .btn {
      background: var(--panel);
      color: var(--accent);
      border: 1px solid var(--accent);
      padding: 8px 16px;
      cursor: pointer;
      font-family: inherit;
      font-size: 12px;
      transition: all 0.2s;
    }
    
    .btn:hover {
      background: var(--accent);
      color: var(--bg);
    }
    
    .btn.active {
      background: var(--accent);
      color: var(--bg);
    }
    
    /* Grid layouts */
    .grid {
      display: grid;
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .grid-4 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
    .grid-3 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
    .grid-2 { grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); }
    
    /* Panel */
    .panel {
      background: var(--panel);
      border: 1px solid var(--border);
      padding: 20px;
      position: relative;
    }
    
    .panel-title {
      font-size: 14px;
      color: var(--accent);
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .panel-subtitle {
      font-size: 11px;
      color: #666;
      margin-top: 5px;
    }
    
    /* Metrics */
    .metric-card {
      text-align: center;
    }
    
    .metric-label {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    
    .metric-value {
      font-size: 36px;
      font-weight: bold;
      color: var(--accent);
      line-height: 1;
      margin-bottom: 8px;
    }
    
    .metric-value.large {
      font-size: 48px;
    }
    
    .metric-change {
      font-size: 13px;
      margin-top: 5px;
    }
    
    .metric-change.positive { color: var(--success); }
    .metric-change.negative { color: var(--error); }
    .metric-change.neutral { color: #666; }
    
    .metric-change::before {
      content: '';
      display: inline-block;
      width: 0;
      height: 0;
      margin-right: 5px;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
    }
    
    .metric-change.positive::before {
      border-bottom: 5px solid var(--success);
    }
    
    .metric-change.negative::before {
      border-top: 5px solid var(--error);
    }
    
    /* Charts */
    .chart-container {
      position: relative;
      height: 300px;
      margin-top: 15px;
    }
    
    .chart-container.small {
      height: 200px;
    }
    
    /* Table */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-top: 15px;
    }
    
    th {
      text-align: left;
      padding: 12px 10px;
      background: var(--bg);
      color: var(--accent);
      border-bottom: 1px solid var(--border);
      text-transform: uppercase;
      font-size: 11px;
      font-weight: normal;
    }
    
    td {
      padding: 12px 10px;
      border-bottom: 1px solid var(--border);
    }
    
    tr:hover {
      background: rgba(0, 255, 65, 0.05);
    }
    
    /* Progress bar */
    .progress-bar {
      width: 100%;
      height: 8px;
      background: var(--bg);
      border: 1px solid var(--border);
      margin-top: 10px;
      position: relative;
      overflow: hidden;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent), var(--accent2));
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    
    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255,255,255,0.3),
        transparent
      );
      animation: shimmer 2s infinite;
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    /* Status indicators */
    .status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin-right: 8px;
      position: relative;
    }
    
    .status-dot::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: currentColor;
    }
    
    .status-dot.live {
      color: var(--success);
    }
    
    .status-dot.live::before {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    /* Comparison bars */
    .comparison-bar {
      display: flex;
      align-items: center;
      margin: 10px 0;
    }
    
    .comparison-label {
      width: 120px;
      font-size: 11px;
      color: #999;
    }
    
    .comparison-track {
      flex: 1;
      height: 24px;
      background: var(--bg);
      border: 1px solid var(--border);
      position: relative;
      margin: 0 10px;
    }
    
    .comparison-fill {
      height: 100%;
      background: var(--accent);
      transition: width 0.6s ease;
      display: flex;
      align-items: center;
      padding: 0 8px;
      font-size: 11px;
      font-weight: bold;
    }
    
    .comparison-value {
      min-width: 80px;
      text-align: right;
      font-size: 13px;
      font-weight: bold;
    }
    
    /* Loading state */
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
      font-size: 14px;
      color: #666;
    }
    
    .loading::after {
      content: '...';
      animation: dots 1.5s steps(4) infinite;
    }
    
    @keyframes dots {
      0%, 20% { content: '.'; }
      40% { content: '..'; }
      60%, 100% { content: '...'; }
    }
    
    /* Badges */
    .badge {
      display: inline-block;
      padding: 3px 8px;
      font-size: 10px;
      background: var(--border);
      color: var(--fg);
      border-radius: 3px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .badge.success { background: var(--success); color: var(--bg); }
    .badge.warning { background: var(--warn); color: var(--bg); }
    .badge.error { background: var(--error); color: var(--bg); }
    
    /* Responsive */
    @media (max-width: 1200px) {
      .grid-4, .grid-3, .grid-2 {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 768px) {
      body {
        padding: 10px;
      }
      
      .header {
        flex-direction: column;
        gap: 15px;
      }
    }
  </style>
</head>
<body>

  <div class="header">
    <h1>PUMO <span style="color:#fff">AI ANALYTICS</span> <span style="font-size:12px; vertical-align:middle; border:1px solid var(--accent); padding:2px 5px;">WHITECAT v1.0</span></h1>
    <div class="controls">
      <button class="btn active" data-range="7">7 Days</button>
      <button class="btn" data-range="30">30 Days</button>
      <button class="btn" data-range="90">90 Days</button>
      <button class="btn" id="refresh-btn">Refresh</button>
    </div>
  </div>

  <!-- KPI Grid -->
  <div class="grid grid-4" id="kpi-grid">
    <div class="panel metric-card">
      <div class="metric-label">Total Revenue</div>
      <div class="metric-value" id="kpi-revenue">0 zł</div>
      <div class="metric-change neutral" id="kpi-revenue-change">--</div>
    </div>
    
    <div class="panel metric-card">
      <div class="metric-label">AI Revenue Share</div>
      <div class="metric-value" id="kpi-ai-share" style="color: var(--accent2)">0%</div>
      <div class="metric-change neutral" id="kpi-ai-share-trend">-- of total</div>
    </div>
    
    <div class="panel metric-card">
      <div class="metric-label">Total Traffic</div>
      <div class="metric-value" id="kpi-traffic">0</div>
      <div class="metric-change neutral" id="kpi-traffic-change">--</div>
    </div>
    
    <div class="panel metric-card">
      <div class="metric-label">Conversion Rate</div>
      <div class="metric-value" id="kpi-cr">0%</div>
      <div class="metric-change neutral" id="kpi-cr-change">--</div>
    </div>
  </div>

  <!-- Main Charts -->
  <div class="grid grid-2">
    <div class="panel">
      <div class="panel-title">Revenue Trend: AI vs Total</div>
      <div class="chart-container">
        <canvas id="revenueChart"></canvas>
      </div>
    </div>
    
    <div class="panel">
      <div class="panel-title">AI SEO Performance Impact</div>
      <div id="ai-impact-content" class="loading">Loading AI Stats...</div>
    </div>
  </div>

  <!-- Detailed Stats -->
  <div class="grid grid-3">
    <div class="panel">
      <div class="panel-title">Traffic Sources</div>
      <div class="chart-container small">
        <canvas id="sourcesChart"></canvas>
      </div>
      <div id="sources-legend" style="margin-top:20px;"></div>
    </div>
    
    <div class="panel">
      <div class="panel-title">Top Performing Categories</div>
      <div id="categories-list">
        <div class="loading">Loading categories...</div>
      </div>
    </div>
    
    <div class="panel">
      <div class="panel-title">Top Products (by Clicks)</div>
      <div id="products-list">
        <div class="loading">Loading products...</div>
      </div>
    </div>
  </div>

  <!-- Reports Panel -->
  <div class="panel">
    <div class="panel-title">
      📄 Historical Reports
      <button class="btn" id="generate-report-btn">Generate New Report</button>
    </div>
    
    <div style="margin-top: 20px;">
      <div style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid var(--border);">
        <button class="btn active" data-report-type="daily">Daily</button>
        <button class="btn" data-report-type="weekly">Weekly</button>
        <button class="btn" data-report-type="monthly">Monthly</button>
      </div>

      <div id="reports-list" style="max-height: 400px; overflow-y: auto;">
        <div class="loading">Loading reports</div>
      </div>
    </div>
  </div>

  <!-- Report Modal -->
  <div id="report-modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 1000; overflow-y: auto;">
    <div style="max-width: 1200px; margin: 40px auto; background: var(--panel); border: 2px solid var(--accent); padding: 30px; position: relative;">
      <button id="close-modal" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: var(--accent); font-size: 24px; cursor: pointer;">&times;</button>
      
      <div id="report-content">
        <!-- Report content will be loaded here -->
      </div>
    </div>
  </div>

  <script>
    const WORKER_URL = window.location.origin; // Auto-detect worker URL
    let currentRange = 30;
    
    // Charts instances
    let revenueChart = null;
    let sourcesChart = null;

    // Report handling
    let currentReportType = 'daily';

    // Init
    document.addEventListener('DOMContentLoaded', () => {
      loadAllData();
      setupListeners();
    });

    function setupListeners() {
      // Range buttons
      document.querySelectorAll('.btn[data-range]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          document.querySelectorAll('.btn[data-range]').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          currentRange = parseInt(e.target.dataset.range);
          loadAllData();
        });
      });

      // Refresh button
      document.getElementById('refresh-btn').addEventListener('click', loadAllData);

      // Report type buttons
      document.querySelectorAll('.btn[data-report-type]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.btn[data-report-type]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentReportType = btn.dataset.reportType;
          loadReports();
        });
      });

      // Generate new report
      document.getElementById('generate-report-btn').addEventListener('click', async () => {
        if (!confirm('Generate a new report? This will create a snapshot of current analytics.')) return;
        
        try {
          const btn = document.getElementById('generate-report-btn');
          btn.textContent = '⏳ Generating...';
          btn.disabled = true;
          
          const response = await fetch(\`\${WORKER_URL}/api/analytics/generate-report\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: currentReportType })
          });
          
          const data = await response.json();
          
          if (data.success) {
            alert('✅ Report generated successfully!');
            loadReports();
          } else {
            console.error('Failed:', data);
            alert('❌ Failed: ' + (data.error || 'Unknown error'));
          }
          
          btn.textContent = 'Generate New Report';
          btn.disabled = false;
          
        } catch (error) {
          console.error('Failed to generate report:', error);
          alert('❌ Connection error');
          document.getElementById('generate-report-btn').disabled = false;
        }
      });

      // Close modal
      document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('report-modal').style.display = 'none';
      });
      
      // Close modal on outside click
      document.getElementById('report-modal').addEventListener('click', (e) => {
        if (e.target.id === 'report-modal') {
          e.target.style.display = 'none';
        }
      });
    }

    async function loadAllData() {
      console.log('Loading data for days:', currentRange);
      
      // Load KPIs
      loadKPIs();
      
      // Load Charts
      loadRevenueChart();
      loadTrafficSources();
      
      // Load Lists
      loadTopProducts();
      loadCategories();
      
      // Load AI Impact
      loadAIImpact();

      // Load Reports
      loadReports();
    }

    async function loadKPIs() {
      try {
        const res = await fetch(\`\${WORKER_URL}/api/analytics/kpis?days=\${currentRange}\`);
        const { data } = await res.json();
        
        updateMetric('kpi-revenue', formatMoney(data.total_revenue), data.revenue_change);
        updateMetric('kpi-traffic', formatNumber(data.total_clicks), data.clicks_change);
        updateMetric('kpi-cr', data.conversion_rate.toFixed(2) + '%', data.conversion_change);
        
        document.getElementById('kpi-ai-share').textContent = data.ai_revenue_share.toFixed(1) + '%';
        document.getElementById('kpi-ai-share-trend').innerHTML = 
          \`<span style="color:#fff">\${formatMoney(data.ai_revenue)}</span> from AI SEO\`;
          
      } catch (e) {
        console.error('Error loading KPIs:', e);
      }
    }

    async function loadAIImpact() {
      try {
        const res = await fetch(\`\${WORKER_URL}/api/analytics/ai-impact\`);
        const { data } = await res.json();
        
        const html = \`
          <div style="padding: 10px;">
            <div class="comparison-bar">
              <div class="comparison-label">Conversion Rate</div>
              <div class="comparison-track">
                <div class="comparison-fill" style="width: \${Math.min(data.ai_conversion_rate * 20, 100)}%; background: var(--accent2)"></div>
              </div>
              <div class="comparison-value">\${data.ai_conversion_rate}% (AI)</div>
            </div>
            
            <div class="comparison-bar">
              <div class="comparison-label">Vs Regular</div>
              <div class="comparison-track">
                <div class="comparison-fill" style="width: \${Math.min(data.non_ai_conversion_rate * 20, 100)}%; background: #666"></div>
              </div>
              <div class="comparison-value">\${data.non_ai_conversion_rate}%</div>
            </div>
            
            <div style="margin-top: 20px; font-size: 13px; border-top: 1px solid var(--border); padding-top: 15px;">
              <p>🤖 AI SEO driven <span style="color:var(--accent2); font-weight:bold">\${data.ai_clicks} clicks</span> resulted in <span style="color:var(--accent2); font-weight:bold">\${data.ai_conversions} orders</span>.</p>
              <p style="margin-top:5px; color:#888;">AI Traffic Value estimate: \${formatMoney(data.ai_revenue)}</p>
            </div>
          </div>
        \`;
        
        document.getElementById('ai-impact-content').innerHTML = html;
        
      } catch (e) {
        document.getElementById('ai-impact-content').innerHTML = '<div style="color:var(--error)">Failed to load AI stats</div>';
      }
    }

    async function loadRevenueChart() {
      try {
        const res = await fetch(\`\${WORKER_URL}/api/analytics/revenue-trend?days=\${currentRange}\`);
        const { data } = await res.json();
        
        const labels = data.map(d => d.date).reverse();
        const totalRev = data.map(d => d.total_revenue).reverse();
        const aiRev = data.map(d => d.ai_revenue).reverse();
        
        if (revenueChart) revenueChart.destroy();
        
        revenueChart = new Chart(document.getElementById('revenueChart'), {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Total Revenue',
                data: totalRev,
                borderColor: '#00ff41',
                backgroundColor: 'rgba(0, 255, 65, 0.1)',
                tension: 0.4,
                fill: true
              },
              {
                label: 'AI Driven Revenue',
                data: aiRev,
                borderColor: '#0affff',
                backgroundColor: 'rgba(10, 255, 255, 0.1)',
                tension: 0.4,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { labels: { color: '#e0e0e0' } }
            },
            scales: {
              y: {
                grid: { color: '#333' },
                ticks: { color: '#999' }
              },
              x: {
                grid: { color: '#333' },
                ticks: { color: '#999' }
              }
            }
          }
        });
        
      } catch (e) {
        console.error(e);
      }
    }

    async function loadTrafficSources() {
      try {
        const res = await fetch(\`\${WORKER_URL}/api/analytics/traffic-sources\`);
        const { data } = await res.json();
        
        if (sourcesChart) sourcesChart.destroy();
        
        sourcesChart = new Chart(document.getElementById('sourcesChart'), {
          type: 'doughnut',
          data: {
            labels: ['AI SEO', 'Organic', 'Paid', 'Direct'],
            datasets: [{
              data: [data.ai_seo, data.organic, data.paid, data.direct],
              backgroundColor: ['#0affff', '#00ff41', '#ff9500', '#666'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'right', labels: { color: '#e0e0e0' } }
            }
          }
        });
        
      } catch (e) {
        console.error(e);
      }
    }

    async function loadTopProducts() {
      try {
        const res = await fetch(\`\${WORKER_URL}/api/analytics/top-products?limit=5\`);
        const { data } = await res.json();
        
        let html = '<table><thead><tr><th>Product</th><th>Clicks</th><th>CTR</th></tr></thead><tbody>';
        
        data.forEach(p => {
          html += \`
            <tr>
              <td style="max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${p.product_name}</td>
              <td style="text-align:center">\${p.clicks}</td>
              <td style="text-align:right; color:\${p.ctr > 2 ? 'var(--success)' : '#999'}">\${p.ctr}%</td>
            </tr>
          \`;
        });
        
        html += '</tbody></table>';
        document.getElementById('products-list').innerHTML = html;
        
      } catch (e) {
        document.getElementById('products-list').innerHTML = 'Error loading products';
      }
    }

    async function loadCategories() {
      try {
        const res = await fetch(\`\${WORKER_URL}/api/analytics/category-performance\`);
        const { data } = await res.json();
        
        let html = '';
        data.slice(0, 5).forEach(c => {
          const width = Math.min((c.revenue / (data[0].revenue || 1)) * 100, 100);
          html += \`
            <div style="margin-bottom: 12px;">
              <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;">
                <span>\${c.category}</span>
                <span>\${formatMoney(c.revenue)}</span>
              </div>
              <div class="progress-bar" style="height:6px;">
                <div class="progress-fill" style="width: \${width}%"></div>
              </div>
            </div>
          \`;
        });
        
        document.getElementById('categories-list').innerHTML = html;
        
      } catch (e) {
        document.getElementById('categories-list').innerHTML = 'Error loading categories';
      }
    }

    async function loadReports() {
      try {
        document.getElementById('reports-list').innerHTML = '<div class="loading">Loading reports...</div>';
        
        const res = await fetch(\`\${WORKER_URL}/api/analytics/reports?type=\${currentReportType}\`);
        const result = await res.json();
        
        // Handle structure from endpoint
        const reports = result.data[currentReportType] || result.data || [];
        
        if (reports.length === 0) {
          document.getElementById('reports-list').innerHTML = '<div style="padding:20px; text-align:center; color:#666">No reports found</div>';
          return;
        }
        
        let html = '<table><thead><tr><th>Date</th><th>Revenue</th><th>AI Share</th><th>Action</th></tr></thead><tbody>';
        
        reports.forEach(r => {
          html += \`
            <tr>
              <td>\${r.period_end}</td>
              <td>\${formatMoney(r.total_revenue || 0)}</td>
              <td>\${(r.ai_revenue_share || 0).toFixed(1)}%</td>
              <td><button class="btn" style="padding:2px 5px; font-size:10px" onclick="viewReport('\${r.id}')">View</button></td>
            </tr>
          \`;
        });
        
        html += '</tbody></table>';
        document.getElementById('reports-list').innerHTML = html;
        
      } catch (e) {
        console.error(e);
        document.getElementById('reports-list').innerHTML = '<div style="color:var(--error)">Error loading reports</div>';
      }
    }

    window.viewReport = async (reportId) => {
      try {
        const res = await fetch(\`\${WORKER_URL}/api/analytics/report/\${reportId}\`);
        const { data } = await res.json();
        
        const html = \`
          <h2 style="color:var(--accent); margin-bottom:20px;">\${data.type.toUpperCase()} REPORT: \${data.period_end}</h2>
          
          <div class="grid grid-3">
            <div class="panel metric-card">
              <div class="metric-label">Revenue</div>
              <div class="metric-value">\${formatMoney(data.summary.total_revenue)}</div>
            </div>
            <div class="panel metric-card">
              <div class="metric-label">Clicks</div>
              <div class="metric-value">\${formatNumber(data.summary.total_clicks)}</div>
            </div>
            <div class="panel metric-card">
              <div class="metric-label">AI Share</div>
              <div class="metric-value" style="color:var(--accent2)">\${data.summary.ai_revenue_share.toFixed(1)}%</div>
            </div>
          </div>
          
          <div class="panel" style="margin-top:20px;">
            <div class="panel-title">🧠 AI Insights</div>
            <ul style="list-style:none; padding:10px;">
              \${data.summary.key_insights.map(i => \`<li style="margin-bottom:10px; padding-left:20px; position:relative;">• \${i}</li>\`).join('')}
            </ul>
          </div>
          
          <div class="panel" style="margin-top:20px;">
            <div class="panel-title">Top Product</div>
            <div style="font-size:18px; color:#fff;">\${data.summary.best_product}</div>
          </div>
        \`;
        
        document.getElementById('report-content').innerHTML = html;
        document.getElementById('report-modal').style.display = 'block';
        
      } catch (e) {
        alert('Failed to load report details');
      }
    };

    // Helpers
    function updateMetric(id, value, change) {
      document.getElementById(id).textContent = value;
      
      const changeEl = document.getElementById(id + '-change');
      if (changeEl) {
        const numChange = parseFloat(change);
        changeEl.textContent = (numChange > 0 ? '+' : '') + numChange.toFixed(1) + '%';
        changeEl.className = 'metric-change ' + (numChange > 0 ? 'positive' : numChange < 0 ? 'negative' : 'neutral');
      }
    }

    function formatMoney(amount) {
      return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(amount);
    }
    
    function formatNumber(num) {
      return new Intl.NumberFormat('pl-PL').format(num);
    }
  </script>
</body>
</html>`;
