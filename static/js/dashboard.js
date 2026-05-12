/**
 * CyberShield - Dashboard JavaScript
 * Handles dashboard statistics, charts, and data visualization
 * Uses Chart.js for professional graphs
 */

// Global chart objects (to prevent multiple instances)
let pieChartInstance = null;
let barChartInstance = null;

/**
 * Initialize the dashboard with statistics and charts
 */
function initializeDashboard() {
    // Fetch statistics from the API
    fetchDashboardStats();
    
    // Initialize Chart.js charts
    initializePieChart();
    initializeBarChart();
}

// ==================== STATISTICS ====================

/**
 * Fetch dashboard statistics from the Flask backend
 */
async function fetchDashboardStats() {
    try {
        // Call the API endpoint
        const response = await fetch('/api/get-stats');
        const data = await response.json();
        
        // Update statistics on the page
        updateStatistics(data);
        
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

/**
 * Update statistics display with fetched data
 * @param {object} stats - Statistics object from API
 */
function updateStatistics(stats) {
    // Use animation to update numbers
    animateNumber('stat-scans', stats.total_scans);
    animateNumber('stat-threats', stats.threats_blocked);
    animateNumber('stat-emails', stats.emails_checked);
    animateNumber('stat-files', stats.files_scanned);
}

/**
 * Animate a number from 0 to target value
 * @param {string} elementId - The ID of the element to update
 * @param {number} target - The target number to animate to
 * @param {number} duration - Animation duration in milliseconds
 */
function animateNumber(elementId, target, duration = 1000) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const start = 0;
    const increment = target / (duration / 16); // 60 FPS
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// ==================== PIE CHART ====================

/**
 * Initialize and render the pie chart
 * Pie chart shows distribution of security events
 */
function initializePieChart() {
    // Get canvas element
    const canvas = document.getElementById('pieChart');
    if (!canvas) return;
    
    // Destroy existing chart instance if it exists
    if (pieChartInstance) {
        pieChartInstance.destroy();
    }
    
    // Create new pie chart
    const ctx = canvas.getContext('2d');
    pieChartInstance = new Chart(ctx, {
        type: 'doughnut', // Use doughnut instead of pie for modern look
        data: {
            labels: ['Safe Scans', 'Threats Blocked', 'Warnings', 'Pending Review'],
            datasets: [{
                data: [650, 89, 45, 23],
                backgroundColor: [
                    'rgba(0, 255, 136, 0.8)',      // Green (Safe)
                    'rgba(255, 0, 102, 0.8)',      // Red (Danger)
                    'rgba(255, 170, 0, 0.8)',      // Orange (Warning)
                    'rgba(0, 102, 255, 0.8)'       // Blue (Pending)
                ],
                borderColor: [
                    'rgba(0, 255, 136, 1)',
                    'rgba(255, 0, 102, 1)',
                    'rgba(255, 170, 0, 1)',
                    'rgba(0, 102, 255, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            family: "'Orbitron', sans-serif",
                            size: 12,
                            weight: '600'
                        },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 39, 0.9)',
                    titleColor: 'rgba(0, 212, 255, 1)',
                    bodyColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(0, 212, 255, 0.5)',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed + ' events';
                            return label;
                        }
                    }
                }
            }
        }
    });
}

// ==================== BAR CHART ====================

/**
 * Initialize and render the bar chart
 * Bar chart shows weekly security activity
 */
function initializeBarChart() {
    // Get canvas element
    const canvas = document.getElementById('barChart');
    if (!canvas) return;
    
    // Destroy existing chart instance if it exists
    if (barChartInstance) {
        barChartInstance.destroy();
    }
    
    // Create new bar chart
    const ctx = canvas.getContext('2d');
    barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            datasets: [
                {
                    label: 'Scans Performed',
                    data: [45, 52, 48, 61, 55, 38, 42],
                    backgroundColor: 'rgba(0, 102, 255, 0.8)',
                    borderColor: 'rgba(0, 102, 255, 1)',
                    borderWidth: 2,
                    borderRadius: 6,
                    hoverBackgroundColor: 'rgba(0, 212, 255, 1)'
                },
                {
                    label: 'Threats Detected',
                    data: [5, 8, 3, 12, 7, 4, 6],
                    backgroundColor: 'rgba(255, 0, 102, 0.8)',
                    borderColor: 'rgba(255, 0, 102, 1)',
                    borderWidth: 2,
                    borderRadius: 6,
                    hoverBackgroundColor: 'rgba(255, 100, 150, 1)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: undefined, // Regular vertical bars
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 212, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(160, 165, 192, 0.8)',
                        font: {
                            family: "'Orbitron', sans-serif",
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(160, 165, 192, 0.8)',
                        font: {
                            family: "'Orbitron', sans-serif",
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            family: "'Orbitron', sans-serif",
                            size: 12,
                            weight: '600'
                        },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 39, 0.9)',
                    titleColor: 'rgba(0, 212, 255, 1)',
                    bodyColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(0, 212, 255, 0.5)',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y;
                        }
                    }
                }
            }
        }
    });
}

// ==================== RESPONSIVE CHARTS ====================

/**
 * Handle window resize and reinitialize charts
 */
window.addEventListener('resize', function() {
    // Small delay to prevent multiple re-renders
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(function() {
        if (document.getElementById('dashboard').classList.contains('active')) {
            initializePieChart();
            initializeBarChart();
        }
    }, 250);
});
