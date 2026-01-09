// JIMBO UNIFIED CHARTS.JS - Chart.js Configuration & Management

class PUMOCharts {
  constructor() {
    this.charts = {};
    this.currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    
    // Listen for theme changes
    window.addEventListener('themeChanged', (e) => {
      this.currentTheme = e.detail.theme;
      this.updateChartsTheme();
    });

    // Listen for metrics updates
    window.addEventListener('metricsUpdated', (e) => {
      this.updateChartsData(e.detail);
    });

    this.initCharts();
    console.log('📊 Charts initialized');
  }

  // Chart.js theme configurations
  getThemeColors() {
    if (this.currentTheme === 'light') {
      return {
        primary: '#007bbf',
        secondary: '#d946ef',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
        text: '#1f2937',
        textDim: '#4b5563',
        grid: 'rgba(0, 0, 0, 0.1)',
        background: 'rgba(0, 123, 191, 0.1)'
      };
    } else {
      return {
        primary: '#00ecff',
        secondary: '#ff00ff',
        success: '#00ff88',
        warning: '#ffaa00',
        error: '#ff4444',
        text: '#f5f5f5',
        textDim: '#a7a7b3',
        grid: 'rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 236, 255, 0.1)'
      };
    }
  }

  getChartDefaults() {
    const colors = this.getThemeColors();
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: colors.text,
            font: {
              family: 'JetBrains Mono',
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: this.currentTheme === 'dark' ? '#10101a' : '#ffffff',
          titleColor: colors.text,
          bodyColor: colors.textDim,
          borderColor: colors.primary,
          borderWidth: 1,
          cornerRadius: 8,
          font: {
            family: 'JetBrains Mono',
            size: 11
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: colors.textDim,
            font: { family: 'JetBrains Mono', size: 10 }
          },
          grid: {
            color: colors.grid
          }
        },
        y: {
          ticks: {
            color: colors.textDim,
            font: { family: 'JetBrains Mono', size: 10 }
          },
          grid: {
            color: colors.grid
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutCubic'
      }
    };
  }

  // Initialize all charts
  initCharts() {
    this.createQueryVolumeChart();
    this.createSuccessRateChart();
    this.createCategoryDistributionChart();
    this.createPerformanceChart();
  }

  // Query Volume Chart (Line Chart)
  createQueryVolumeChart() {
    const ctx = document.getElementById('queryVolumeChart');
    if (!ctx) return;

    const colors = this.getThemeColors();
    
    this.charts.queryVolume = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.getLast7Days(),
        datasets: [{
          label: 'Daily Queries',
          data: [12400, 13200, 11800, 14500, 15420, 13900, 16200],
          borderColor: colors.primary,
          backgroundColor: colors.background,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: colors.primary,
          pointBorderColor: colors.primary,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }, {
          label: 'Success Rate (%)',
          data: [92.5, 94.2, 91.8, 95.1, 94.2, 93.7, 96.3],
          borderColor: colors.success,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          pointBackgroundColor: colors.success,
          pointBorderColor: colors.success,
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          yAxisID: 'y1'
        }]
      },
      options: {
        ...this.getChartDefaults(),
        scales: {
          ...this.getChartDefaults().scales,
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            ticks: {
              color: this.getThemeColors().textDim,
              font: { family: 'JetBrains Mono', size: 10 },
              callback: (value) => `${value}%`
            },
            grid: {
              drawOnChartArea: false
            }
          }
        },
        plugins: {
          ...this.getChartDefaults().plugins,
          title: {
            display: true,
            text: 'Query Volume & Success Rate (Last 7 Days)',
            color: colors.text,
            font: { family: 'JetBrains Mono', size: 14, weight: 'bold' }
          }
        }
      }
    });
  }

  // Success Rate Chart (Doughnut Chart)  
  createSuccessRateChart() {
    const ctx = document.getElementById('successRateChart');
    if (!ctx) return;

    const colors = this.getThemeColors();
    
    this.charts.successRate = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Success', 'Timeout', 'Error', 'Invalid'],
        datasets: [{
          data: [94.2, 3.1, 1.8, 0.9],
          backgroundColor: [
            colors.success,
            colors.warning,
            colors.error,
            colors.textDim
          ],
          borderColor: this.currentTheme === 'dark' ? '#0b0b12' : '#ffffff',
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        ...this.getChartDefaults(),
        cutout: '60%',
        plugins: {
          ...this.getChartDefaults().plugins,
          title: {
            display: true,
            text: 'Query Success Rate Distribution',
            color: colors.text,
            font: { family: 'JetBrains Mono', size: 14, weight: 'bold' }
          },
          legend: {
            position: 'bottom',
            labels: {
              color: colors.text,
              font: { family: 'JetBrains Mono', size: 11 },
              padding: 15,
              usePointStyle: true
            }
          }
        }
      }
    });
  }

  // Category Distribution Chart (Bar Chart)
  createCategoryDistributionChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    const colors = this.getThemeColors();
    
    this.charts.categoryDistribution = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Furniture', 'Decor', 'Lighting', 'Storage', 'Kitchen', 'Bedroom'],
        datasets: [{
          label: 'Products',
          data: [520, 380, 290, 410, 350, 315],
          backgroundColor: [
            colors.primary,
            colors.secondary,
            colors.success,
            colors.warning,
            `${colors.primary}80`,
            `${colors.secondary}80`
          ],
          borderColor: colors.primary,
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        ...this.getChartDefaults(),
        plugins: {
          ...this.getChartDefaults().plugins,
          title: {
            display: true,
            text: 'Top Product Categories',
            color: colors.text,
            font: { family: 'JetBrains Mono', size: 14, weight: 'bold' }
          },
          legend: {
            display: false
          }
        },
        scales: {
          ...this.getChartDefaults().scales,
          y: {
            ...this.getChartDefaults().scales.y,
            beginAtZero: true,
            ticks: {
              ...this.getChartDefaults().scales.y.ticks,
              callback: (value) => value.toLocaleString()
            }
          }
        }
      }
    });
  }

  // Performance Chart (Mixed Chart)
  createPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;

    const colors = this.getThemeColors();
    
    this.charts.performance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.getHourlyLabels(),
        datasets: [{
          type: 'line',
          label: 'Response Time (ms)',
          data: [245, 280, 198, 320, 156, 234, 289, 178, 345, 201, 267, 223],
          borderColor: colors.warning,
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointBackgroundColor: colors.warning,
          pointRadius: 3,
          tension: 0.3,
          yAxisID: 'y'
        }, {
          type: 'bar',
          label: 'Requests/Hour',
          data: [820, 950, 1200, 890, 1450, 1320, 980, 1180, 1650, 1420, 1280, 1380],
          backgroundColor: `${colors.primary}60`,
          borderColor: colors.primary,
          borderWidth: 1,
          yAxisID: 'y1'
        }]
      },
      options: {
        ...this.getChartDefaults(),
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          ...this.getChartDefaults().plugins,
          title: {
            display: true,
            text: 'Performance Metrics (Last 12 Hours)',
            color: colors.text,
            font: { family: 'JetBrains Mono', size: 14, weight: 'bold' }
          }
        },
        scales: {
          ...this.getChartDefaults().scales,
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
              color: colors.textDim,
              font: { family: 'JetBrains Mono', size: 10 },
              callback: (value) => `${value}ms`
            },
            grid: {
              color: colors.grid
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            ticks: {
              color: colors.textDim,
              font: { family: 'JetBrains Mono', size: 10 },
              callback: (value) => value.toLocaleString()
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  }

  // Update all charts with new data
  updateChartsData(data) {
    try {
      // Update query volume chart
      if (this.charts.queryVolume && data.dailyVolume) {
        const chart = this.charts.queryVolume;
        const currentData = chart.data.datasets[0].data;
        
        // Shift array and add new value
        currentData.shift();
        currentData.push(data.dailyVolume);
        
        chart.update('none'); // No animation for real-time updates
      }

      // Update success rate chart
      if (this.charts.successRate && data.successRate) {
        const chart = this.charts.successRate;
        const successRate = data.successRate;
        const errorRate = 100 - successRate;
        
        chart.data.datasets[0].data = [
          successRate,
          errorRate * 0.5, // Timeout
          errorRate * 0.3, // Error
          errorRate * 0.2  // Invalid
        ];
        
        chart.update();
      }

      console.log('📊 Charts updated with new data');
    } catch (error) {
      console.error('Chart update error:', error);
    }
  }

  // Update charts theme colors
  updateChartsTheme() {
    const colors = this.getThemeColors();
    
    Object.values(this.charts).forEach(chart => {
      try {
        // Update scales colors
        if (chart.options.scales) {
          ['x', 'y', 'y1'].forEach(scale => {
            if (chart.options.scales[scale]) {
              chart.options.scales[scale].ticks.color = colors.textDim;
              chart.options.scales[scale].grid.color = colors.grid;
            }
          });
        }

        // Update legend colors
        if (chart.options.plugins.legend) {
          chart.options.plugins.legend.labels.color = colors.text;
        }

        // Update title colors
        if (chart.options.plugins.title) {
          chart.options.plugins.title.color = colors.text;
        }

        // Update tooltip colors
        if (chart.options.plugins.tooltip) {
          chart.options.plugins.tooltip.backgroundColor = 
            this.currentTheme === 'dark' ? '#10101a' : '#ffffff';
          chart.options.plugins.tooltip.titleColor = colors.text;
          chart.options.plugins.tooltip.bodyColor = colors.textDim;
        }

        chart.update('none');
      } catch (error) {
        console.error('Theme update error for chart:', error);
      }
    });

    console.log(`🎨 Charts theme updated to: ${this.currentTheme}`);
  }

  // Utility functions
  getLast7Days() {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('pl-PL', { 
        month: 'short', 
        day: 'numeric' 
      }));
    }
    
    return days;
  }

  getHourlyLabels() {
    const hours = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(time.getHours() - i);
      hours.push(time.toLocaleTimeString('pl-PL', { 
        hour: '2-digit',
        minute: '2-digit'
      }));
    }
    
    return hours;
  }

  // Public methods for external control
  refreshAll() {
    Object.values(this.charts).forEach(chart => {
      chart.update();
    });
    console.log('🔄 All charts refreshed');
  }

  exportChart(chartName) {
    const chart = this.charts[chartName];
    if (!chart) {
      console.error(`Chart '${chartName}' not found`);
      return;
    }

    const url = chart.toBase64Image();
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chartName}-chart.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    console.log(`📥 Chart '${chartName}' exported`);
  }

  getChartData(chartName) {
    const chart = this.charts[chartName];
    return chart ? chart.data : null;
  }

  // Cleanup
  destroy() {
    Object.values(this.charts).forEach(chart => {
      chart.destroy();
    });
    this.charts = {};
    console.log('🗑️ Charts destroyed');
  }
}

// Initialize charts when DOM is loaded and Chart.js is available
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Chart !== 'undefined') {
    // Set global Chart.js defaults
    Chart.defaults.font.family = 'JetBrains Mono';
    Chart.defaults.animation.duration = 1000;
    
    window.pumoCharts = new PUMOCharts();
    
    // Add charts to global pumo object
    if (window.pumo) {
      window.pumo.charts = {
        refresh: () => window.pumoCharts.refreshAll(),
        export: (name) => window.pumoCharts.exportChart(name),
        getData: (name) => window.pumoCharts.getChartData(name),
        instance: window.pumoCharts
      };
    }
  } else {
    console.error('Chart.js not loaded');
  }
});

console.log('📊 Charts module loaded');