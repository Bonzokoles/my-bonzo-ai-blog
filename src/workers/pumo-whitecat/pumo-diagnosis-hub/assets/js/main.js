// JIMBO UNIFIED MAIN.JS - Core Dashboard Functionality

class PUMODashboard {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'dark';
    this.initTheme();
    this.initEventListeners();
    this.loadMetrics();
    this.startAutoRefresh();
    console.log('🚀 PUMO Dashboard initialized');
  }

  // Theme Management
  initTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
    
    // Trigger custom event for charts to update
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme: this.theme }
    }));
    
    console.log(`🎨 Theme changed to: ${this.theme}`);
  }

  // Event Listeners
  initEventListeners() {
    // AI Analyst button
    const aiBtn = document.querySelector('.btn-ai');
    if (aiBtn) {
      aiBtn.addEventListener('click', () => this.triggerAIAnalysis());
    }

    // Export buttons
    const exportBtns = document.querySelectorAll('.btn-export');
    exportBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const exportType = e.target.dataset.export;
        this.exportData(exportType);
      });
    });

    // Refresh button
    const refreshBtn = document.querySelector('.btn-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refreshData());
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey) {
        switch(e.key) {
          case 't':
            e.preventDefault();
            this.toggleTheme();
            break;
          case 'r':
            e.preventDefault();
            this.refreshData();
            break;
          case 'e':
            e.preventDefault();
            this.exportData('all');
            break;
        }
      }
    });
  }

  // Data Loading
  async loadMetrics() {
    try {
      this.showLoading();
      
      const [metrics, activities] = await Promise.all([
        this.fetchMetrics(),
        this.fetchActivities()
      ]);

      this.updateMetrics(metrics);
      this.updateActivities(activities);
      this.updateCharts(metrics);
      
      this.hideLoading();
      console.log('📊 Metrics loaded successfully');
    } catch (error) {
      console.error('❌ Error loading metrics:', error);
      this.showError('Failed to load dashboard data');
    }
  }

  async fetchMetrics() {
    // Check if we have API endpoint
    const apiUrl = '/api/metrics.js';
    
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('Using mock data - API not available');
    }

    // Fallback to mock data
    return {
      totalProducts: 2560,
      activeQueries: 847,
      successRate: 94.2,
      dailyVolume: 15420,
      weeklyGrowth: 12.5,
      categories: 68,
      lastSync: new Date().toISOString()
    };
  }

  async fetchActivities() {
    try {
      const response = await fetch('/api/activities.js');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('Using mock activity data');
    }

    // Mock activities
    return [
      { timestamp: new Date(Date.now() - 60000), message: 'Product sync completed', type: 'success' },
      { timestamp: new Date(Date.now() - 120000), message: 'AI analysis started', type: 'info' },
      { timestamp: new Date(Date.now() - 300000), message: 'New products detected: 15', type: 'info' },
      { timestamp: new Date(Date.now() - 600000), message: 'Cache refreshed', type: 'success' },
      { timestamp: new Date(Date.now() - 900000), message: 'Export completed', type: 'success' }
    ];
  }

  // UI Updates
  updateMetrics(data) {
    const updates = [
      { selector: '[data-metric="products"]', value: data.totalProducts },
      { selector: '[data-metric="queries"]', value: data.activeQueries },
      { selector: '[data-metric="success-rate"]', value: `${data.successRate}%` },
      { selector: '[data-metric="daily-volume"]', value: data.dailyVolume },
      { selector: '[data-metric="categories"]', value: data.categories }
    ];

    updates.forEach(({ selector, value }) => {
      const element = document.querySelector(selector);
      if (element) {
        this.animateNumber(element, value);
      }
    });

    // Update last sync
    const syncElement = document.querySelector('[data-sync]');
    if (syncElement && data.lastSync) {
      const syncTime = new Date(data.lastSync).toLocaleTimeString();
      syncElement.textContent = `Ostatnia aktualizacja: ${syncTime}`;
    }
  }

  updateActivities(activities) {
    const feed = document.querySelector('.activity-feed');
    if (!feed) return;

    feed.innerHTML = activities.map(activity => {
      const timeAgo = this.getTimeAgo(activity.timestamp);
      const icon = this.getActivityIcon(activity.type);
      
      return `
        <div class="activity-item" data-type="${activity.type}">
          ${icon} ${activity.message}
          <div class="activity-time">${timeAgo}</div>
        </div>
      `;
    }).join('');
  }

  updateCharts(data) {
    // Trigger chart updates
    window.dispatchEvent(new CustomEvent('metricsUpdated', {
      detail: data
    }));
  }

  // Utilities
  animateNumber(element, targetValue) {
    const currentValue = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
    const target = typeof targetValue === 'string' ? 
      parseInt(targetValue.replace(/[^\d]/g, '')) : targetValue;
    
    const duration = 1000;
    const startTime = performance.now();
    const isPercentage = typeof targetValue === 'string' && targetValue.includes('%');
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = this.easeOutCubic(progress);
      
      const current = Math.round(currentValue + (target - currentValue) * easeProgress);
      element.textContent = isPercentage ? `${current}%` : current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  getTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s temu`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m temu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h temu`;
    return time.toLocaleDateString();
  }

  getActivityIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  }

  // Loading States
  showLoading() {
    const elements = document.querySelectorAll('.metric-value, .chart-panel');
    elements.forEach(el => el.classList.add('loading'));
  }

  hideLoading() {
    const elements = document.querySelectorAll('.loading');
    elements.forEach(el => el.classList.remove('loading'));
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--accent-error);
      color: white;
      padding: 12px 20px;
      border-radius: var(--radius);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  // AI Analysis
  async triggerAIAnalysis() {
    const aiStatus = document.querySelector('.ai-status');
    const aiOutput = document.querySelector('.ai-output');
    const aiBtn = document.querySelector('.btn-ai');
    
    if (!aiStatus || !aiOutput) return;

    try {
      aiBtn.disabled = true;
      aiBtn.innerHTML = '<span class="spinner"></span> Analyzing...';
      aiStatus.textContent = '🤖 Analyzing PUMO data...';
      
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Try to fetch from API or use mock analysis
      const analysis = await this.getAIAnalysis();
      
      aiOutput.innerHTML = `
        <div class="ai-insights">
          <h4>📈 Key Insights:</h4>
          <ul>
            <li>${analysis.insights[0]}</li>
            <li>${analysis.insights[1]}</li>
            <li>${analysis.insights[2]}</li>
          </ul>
          <div class="ai-recommendation">
            <strong>💡 Recommendation:</strong> ${analysis.recommendation}
          </div>
          <div class="ai-confidence">
            Confidence: ${analysis.confidence}%
          </div>
        </div>
      `;
      
      aiStatus.textContent = '✅ Analysis complete';
      
    } catch (error) {
      aiStatus.textContent = '❌ Analysis failed';
      aiOutput.textContent = 'AI analysis temporarily unavailable. Please try again later.';
      console.error('AI Analysis error:', error);
    } finally {
      aiBtn.disabled = false;
      aiBtn.innerHTML = '🤖 Analyze Data';
    }
  }

  async getAIAnalysis() {
    // Mock AI analysis - replace with actual API call
    return {
      insights: [
        'Product data quality improved by 15% this week',
        'Query success rate is above target at 94.2%',
        'Daily volume shows steady growth pattern'
      ],
      recommendation: 'Focus on category expansion in home decor segment for maximum growth potential',
      confidence: 87
    };
  }

  // Data Export
  async exportData(type) {
    try {
      console.log(`🔄 Exporting ${type} data...`);
      
      const data = await this.fetchExportData(type);
      const filename = `pumo-${type}-${new Date().toISOString().split('T')[0]}.json`;
      
      this.downloadJSON(data, filename);
      
      this.showSuccess(`${type} data exported successfully`);
    } catch (error) {
      console.error('Export error:', error);
      this.showError('Export failed. Please try again.');
    }
  }

  async fetchExportData(type) {
    // Mock export data - replace with actual API calls
    const exportData = {
      analytics: { queries: [], performance: {}, trends: {} },
      products: { count: 2560, categories: 68, updated: new Date() },
      insights: { recommendations: [], analysis: {}, confidence: 87 }
    };
    
    return type === 'all' ? exportData : { [type]: exportData[type] };
  }

  downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--accent-success);
      color: white;
      padding: 12px 20px;
      border-radius: var(--radius);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  }

  // Auto Refresh
  startAutoRefresh() {
    // Refresh metrics every 5 minutes
    setInterval(() => {
      this.loadMetrics();
    }, 5 * 60 * 1000);

    // Refresh activities every 30 seconds
    setInterval(() => {
      this.fetchActivities().then(activities => {
        this.updateActivities(activities);
      });
    }, 30 * 1000);
  }

  refreshData() {
    console.log('🔄 Manual refresh triggered');
    this.loadMetrics();
  }

  // Public API
  getMetrics() {
    return this.fetchMetrics();
  }

  setTheme(theme) {
    if (['dark', 'light', 'auto'].includes(theme)) {
      this.theme = theme;
      this.initTheme();
    }
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.dashboard = new PUMODashboard();
});

// Global functions for console debugging
window.pumo = {
  refresh: () => window.dashboard?.refreshData(),
  export: (type = 'all') => window.dashboard?.exportData(type),
  analyze: () => window.dashboard?.triggerAIAnalysis(),
  theme: (theme) => window.dashboard?.setTheme(theme)
};

console.log(`
🚀 PUMO Dashboard Ready!

Debug commands:
- pumo.refresh() - Refresh data
- pumo.export('analytics') - Export data
- pumo.analyze() - Run AI analysis  
- pumo.theme('dark') - Change theme

Keyboard shortcuts:
- Ctrl+T - Toggle theme
- Ctrl+R - Refresh data
- Ctrl+E - Export all data
`);