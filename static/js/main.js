/**
 * CyberShield - Main JavaScript
 * Handles navigation, tab switching, and common functionality
 * Beginner-friendly with detailed comments
 */

// ==================== TAB NAVIGATION ====================

/**
 * Initialize navigation by adding click event listeners to all nav links
 * This function runs when the page loads
 */
function initializeNavigation() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add click event to each link
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            
            // Get the tab name from the link's data-tab attribute
            const tabName = this.getAttribute('data-tab');
            
            // Switch to the clicked tab
            switchTab(tabName);
            
            // Update active navigation link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Switch to a specific tab
 * @param {string} tabName - The name of the tab to display
 */
function switchTab(tabName) {
    // Hide all tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Show the selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
        
        // If switching to dashboard, initialize charts
        if (tabName === 'dashboard') {
            setTimeout(() => {
                initializeDashboard();
            }, 100);
        }
    }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Display a result in a result container
 * @param {string} containerId - The ID of the result container
 * @param {object} result - The result object with status, message, etc.
 */
function displayResult(containerId, result) {
    const container = document.getElementById(containerId);
    
    // Determine alert type based on status/severity
    let alertClass = 'alert-info';
    if (result.status === 'error') {
        alertClass = 'alert-danger';
    } else if (result.severity === 'high' || result.level === 'danger') {
        alertClass = 'alert-danger';
    } else if (result.severity === 'medium' || result.level === 'warning') {
        alertClass = 'alert-warning';
    } else if (result.status === 'safe' || result.level === 'safe') {
        alertClass = 'alert-success';
    }
    
    // Determine icon based on status
    let icon = '<i class="fas fa-info-circle"></i>';
    if (result.status === 'error') {
        icon = '<i class="fas fa-times-circle"></i>';
    } else if (result.status === 'breached' || result.safety === 'dangerous') {
        icon = '<i class="fas fa-exclamation-circle"></i>';
    } else if (result.status === 'safe' || result.safety === 'safe') {
        icon = '<i class="fas fa-check-circle"></i>';
    }
    
    // Build HTML content
    let html = `
        <div class="alert-card ${alertClass}">
            <div class="alert-icon">${icon}</div>
            <div class="alert-content">
                <h4>${result.message}</h4>
    `;
    
    // Add additional details if available
    if (result.details) {
        html += `<p>${result.details}</p>`;
    }
    
    if (result.recommendation) {
        html += `
            <p><strong>Recommendation:</strong> ${result.recommendation}</p>
        `;
    }
    
    html += '</div></div>';
    
    // Insert HTML into container
    container.innerHTML = html;
}

/**
 * Display error message in a result container
 * @param {string} containerId - The ID of the result container
 * @param {string} message - The error message to display
 */
function displayError(containerId, message) {
    displayResult(containerId, {
        status: 'error',
        message: 'Error',
        details: message
    });
}

/**
 * Show loading state in a result container
 * @param {string} containerId - The ID of the result container
 */
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="alert-card alert-info">
            <div class="alert-icon">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <div class="alert-content">
                <h4>Analyzing...</h4>
                <p>Please wait while we process your request.</p>
            </div>
        </div>
    `;
}

// ==================== API COMMUNICATION ====================

/**
 * Make a request to the Flask backend API
 * @param {string} endpoint - The API endpoint (e.g., '/api/check-breach')
 * @param {object} data - The data to send to the API
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @returns {Promise} - Promise that resolves with the API response
 */
async function callApi(endpoint, data = {}, method = 'POST') {
    try {
        // Configure request options
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        // Add data to request body if provided
        if (method === 'POST' && Object.keys(data).length > 0) {
            options.body = JSON.stringify(data);
        }
        
        // Make the API request
        const response = await fetch(endpoint, options);
        
        // Parse the JSON response
        const result = await response.json();
        
        // Return the result
        return result;
        
    } catch (error) {
        // Log error to console for debugging
        console.error('API Error:', error);
        return {
            status: 'error',
            message: 'Network error. Please try again.'
        };
    }
}

// ==================== PAGE LOAD ====================

/**
 * Initialize everything when the page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('CyberShield initialized');
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize dashboard on page load
    initializeDashboard();
});

