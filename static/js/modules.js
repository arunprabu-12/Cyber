/**
 * CyberShield - Modules JavaScript
 * Handles all security analysis modules:
 * - Data Breach Checker
 * - Phishing Detector
 * - Password Analyzer
 * - File Upload Checker
 */

// ==================== DATA BREACH CHECKER ====================

/**
 * Check if an email has been breached
 */
async function checkBreach() {
    // Get email from input field
    const email = document.getElementById('breach-email').value.trim();
    
    // Validate email is not empty
    if (!email) {
        displayError('breach-result', 'Please enter an email address');
        return;
    }
    
    // Show loading state
    showLoading('breach-result');
    
    try {
        // Call API to check breach
        const response = await callApi('/api/check-breach', { email: email });
        
        // Display result
        displayResult('breach-result', response);
        
        // Log for analytics
        console.log('Breach check completed:', response);
        
    } catch (error) {
        displayError('breach-result', 'Error checking breach status');
        console.error('Breach check error:', error);
    }
}

/**
 * Allow Enter key to trigger breach check
 */
document.addEventListener('DOMContentLoaded', function() {
    const breachEmail = document.getElementById('breach-email');
    if (breachEmail) {
        breachEmail.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                checkBreach();
            }
        });
    }
});

// ==================== PHISHING DETECTOR ====================

/**
 * Detect phishing characteristics in email text
 */
async function detectPhishing() {
    // Get email text from textarea
    const emailText = document.getElementById('phishing-text').value.trim();
    
    // Validate email text is not empty
    if (!emailText) {
        displayError('phishing-result', 'Please paste email content to analyze');
        return;
    }
    
    // Show loading state
    showLoading('phishing-result');
    
    try {
        // Call API to detect phishing
        const response = await callApi('/api/detect-phishing', { email_text: emailText });
        
        // Display result with enhanced formatting
        displayPhishingResult(response);
        
        // Log for analytics
        console.log('Phishing detection completed:', response);
        
    } catch (error) {
        displayError('phishing-result', 'Error analyzing email');
        console.error('Phishing detection error:', error);
    }
}

/**
 * Display phishing detection results with risk gauge
 * @param {object} result - Phishing detection result from API
 */
function displayPhishingResult(result) {
    if (result.status === 'error') {
        displayError('phishing-result', result.message);
        return;
    }
    
    // Determine alert type based on risk level
    let alertClass = 'alert-success';
    let riskColor = '#00ff88';
    
    if (result.level === 'warning') {
        alertClass = 'alert-warning';
        riskColor = '#ffaa00';
    } else if (result.level === 'danger') {
        alertClass = 'alert-danger';
        riskColor = '#ff0066';
    }
    
    // Determine icon
    let icon = '<i class="fas fa-check-circle"></i>';
    if (result.level === 'warning') {
        icon = '<i class="fas fa-exclamation-triangle"></i>';
    } else if (result.level === 'danger') {
        icon = '<i class="fas fa-times-circle"></i>';
    }
    
    // Build HTML with risk gauge
    let html = `
        <div class="alert-card ${alertClass}">
            <div class="alert-icon">${icon}</div>
            <div class="alert-content">
                <h4>${result.message}</h4>
                
                <!-- Risk Gauge -->
                <div style="margin: 15px 0;">
                    <p style="margin-bottom: 8px;"><strong>Risk Level: ${result.risk_percentage}%</strong></p>
                    <div style="
                        width: 100%;
                        height: 12px;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 6px;
                        overflow: hidden;
                    ">
                        <div style="
                            width: ${result.risk_percentage}%;
                            height: 100%;
                            background: ${riskColor};
                            transition: width 0.6s ease;
                        "></div>
                    </div>
                </div>
    `;
    
    // Add warnings if any
    if (result.warnings && result.warnings.length > 0) {
        html += '<p><strong>Warnings Found:</strong></p><ul style="padding-left: 20px;">';
        result.warnings.forEach(warning => {
            html += `<li style="margin-bottom: 5px;">${warning}</li>`;
        });
        html += '</ul>';
    }
    
    // Add found keywords if any
    if (result.found_keywords && result.found_keywords.length > 0) {
        html += '<p style="margin-top: 10px;"><strong>Suspicious Keywords:</strong></p>';
        result.found_keywords.forEach(keyword => {
            html += `<span style="
                display: inline-block;
                background: rgba(255, 0, 102, 0.2);
                color: #ff0066;
                padding: 4px 8px;
                border-radius: 4px;
                margin-right: 5px;
                margin-bottom: 5px;
                font-size: 0.85rem;
            ">${keyword}</span>`;
        });
    }
    
    html += '</div></div>';
    
    // Insert into container
    document.getElementById('phishing-result').innerHTML = html;
}

// ==================== PASSWORD ANALYZER ====================

/**
 * Analyze password strength live (as user types)
 */
function analyzePasswordLive() {
    const password = document.getElementById('password-input').value;
    
    // Update requirements display
    updatePasswordRequirements(password);
}

/**
 * Perform full password analysis and display recommendations
 */
async function analyzePassword() {
    // Get password from input field
    const password = document.getElementById('password-input').value;
    
    // Validate password is not empty
    if (!password) {
        displayError('password-result', 'Please enter a password to analyze');
        return;
    }
    
    // Show loading state
    showLoading('password-result');
    
    try {
        // Call API to analyze password
        const response = await callApi('/api/analyze-password', { password: password });
        
        // Display result with enhanced formatting
        displayPasswordResult(response);
        
        // Log for analytics
        console.log('Password analysis completed:', response);
        
    } catch (error) {
        displayError('password-result', 'Error analyzing password');
        console.error('Password analysis error:', error);
    }
}

/**
 * Update password requirements display as user types
 * @param {string} password - The password to validate
 */
function updatePasswordRequirements(password) {
    // Check each requirement
    const requirements = {
        'req-length': password.length >= 8,
        'req-upper': /[A-Z]/.test(password),
        'req-lower': /[a-z]/.test(password),
        'req-numbers': /[0-9]/.test(password),
        'req-special': /[!@#$%^&*()_+\-=\[\]{};:\'",.<>?/\\|`~]/.test(password),
        'req-unique': !/(.)\1{2,}/.test(password) && !/[0123456789]{3}|[abcdefghijklmnopqrstuvwxyz]{3}/.test(password)
    };
    
    // Update UI for each requirement
    Object.keys(requirements).forEach(reqId => {
        const element = document.getElementById(reqId);
        if (element) {
            if (requirements[reqId]) {
                element.classList.add('active');
                element.querySelector('i').className = 'fas fa-check-circle';
            } else {
                element.classList.remove('active');
                element.querySelector('i').className = 'fas fa-circle';
            }
        }
    });
}

/**
 * Display password analysis results with detailed feedback
 * @param {object} result - Password analysis result from API
 */
function displayPasswordResult(result) {
    if (result.status === 'error') {
        displayError('password-result', result.message);
        return;
    }
    
    // Determine alert type and color based on strength
    let alertClass = 'alert-success';
    let strengthColor = '#00ff88';
    let strengthIcon = '<i class="fas fa-check-circle"></i>';
    
    if (result.strength === 'weak') {
        alertClass = 'alert-danger';
        strengthColor = '#ff0066';
        strengthIcon = '<i class="fas fa-times-circle"></i>';
    } else if (result.strength === 'medium') {
        alertClass = 'alert-warning';
        strengthColor = '#ffaa00';
        strengthIcon = '<i class="fas fa-exclamation-triangle"></i>';
    }
    
    // Build HTML with strength meter
    let html = `
        <div class="alert-card ${alertClass}">
            <div class="alert-icon">${strengthIcon}</div>
            <div class="alert-content">
                <h4>${result.message}</h4>
                
                <!-- Strength Meter -->
                <div style="margin: 15px 0;">
                    <p style="margin-bottom: 8px;"><strong>Strength Score: ${result.score}/100</strong></p>
                    <div style="
                        width: 100%;
                        height: 12px;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 6px;
                        overflow: hidden;
                    ">
                        <div style="
                            width: ${result.score}%;
                            height: 100%;
                            background: ${strengthColor};
                            transition: width 0.6s ease;
                        "></div>
                    </div>
                    <p style="margin-top: 8px; font-size: 0.9rem; color: ${strengthColor};">
                        <strong>Estimated Time to Crack:</strong> ${result.crack_time}
                    </p>
                </div>
    `;
    
    // Add suggestions if any
    if (result.suggestions && result.suggestions.length > 0) {
        html += '<p><strong>Suggestions:</strong></p><ul style="padding-left: 20px;">';
        result.suggestions.forEach(suggestion => {
            html += `<li style="margin-bottom: 5px;">${suggestion}</li>`;
        });
        html += '</ul>';
    }
    
    html += '</div></div>';
    
    // Insert into container
    document.getElementById('password-result').innerHTML = html;
}

// ==================== FILE UPLOAD CHECKER ====================

/**
 * Setup file upload drag and drop functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('file-upload-area');
    const fileInput = document.getElementById('file-input');
    
    if (uploadArea && fileInput) {
        // Click to upload
        uploadArea.addEventListener('click', () => fileInput.click());
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#00d4ff';
            uploadArea.style.background = 'rgba(0, 212, 255, 0.15)';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#00d4ff';
            uploadArea.style.background = 'rgba(0, 212, 255, 0.05)';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#00d4ff';
            uploadArea.style.background = 'rgba(0, 212, 255, 0.05)';
            
            // Handle dropped files
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelect();
            }
        });
    }
});

/**
 * Handle file selection and trigger file check
 */
function handleFileSelect() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    
    // Validate file is selected
    if (!file) {
        displayError('file-result', 'No file selected');
        return;
    }
    
    // Validate file size (max 5MB for demo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        displayError('file-result', 'File size exceeds 5MB limit');
        return;
    }
    
    // Show loading state
    showLoading('file-result');
    
    // Create FormData to send file
    const formData = new FormData();
    formData.append('file', file);
    
    // Send to API
    fetch('/api/check-file', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        // Display result
        displayFileResult(result);
        
        // Log for analytics
        console.log('File check completed:', result);
    })
    .catch(error => {
        displayError('file-result', 'Error checking file');
        console.error('File check error:', error);
    });
}

/**
 * Display file check results
 * @param {object} result - File check result from API
 */
function displayFileResult(result) {
    if (result.status === 'error') {
        displayError('file-result', result.message);
        return;
    }
    
    // Determine alert type based on safety
    let alertClass = result.safety === 'safe' ? 'alert-success' : 'alert-danger';
    let icon = result.safety === 'safe' 
        ? '<i class="fas fa-check-circle"></i>' 
        : '<i class="fas fa-exclamation-circle"></i>';
    
    // Build HTML
    let html = `
        <div class="alert-card ${alertClass}">
            <div class="alert-icon">${icon}</div>
            <div class="alert-content">
                <h4>${result.message}</h4>
                <p><strong>Filename:</strong> ${result.file_name}</p>
                <p><strong>Extension:</strong> <span style="
                    font-family: 'Space Mono', monospace;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 2px 6px;
                    border-radius: 4px;
                ">${result.file_extension}</span></p>
                <p><strong>Details:</strong> ${result.details}</p>
                <p><strong>Recommendation:</strong> ${result.recommendation}</p>
            </div>
        </div>
    `;
    
    // Insert into container
    document.getElementById('file-result').innerHTML = html;
}
