/**
 * Form Handlers
 * Handle form interactions and preview updates
 */

// Global state
let currentTemplate = 'report';

// DOM Elements
const elements = {
    envSelect: document.getElementById('environment'),
    customEnvDiv: document.getElementById('customEnvDiv'),
    customEnvInput: document.getElementById('customEnv'),
    nglSiteGroup: document.getElementById('nglSiteGroup'),
    nglSiteSelect: document.getElementById('nglSite'),
    reportSelect: document.getElementById('reportName'),
    customReportDiv: document.getElementById('customReportDiv'),
    customReportInput: document.getElementById('customReport'),
    issueSelect: document.getElementById('issueDescription'),
    customIssueDiv: document.getElementById('customIssueDiv'),
    customIssueInput: document.getElementById('customIssue'),
    percentageGroup: document.getElementById('percentageGroup'),
    percentageInput: document.getElementById('percentageInput'),
    rootCauseSelect: document.getElementById('rootCause'),
    customRootCauseDiv: document.getElementById('customRootCauseDiv'),
    customRootCauseInput: document.getElementById('customRootCause'),
    form: document.getElementById('emailForm'),
    successMessage: document.getElementById('successMessage'),
    previewContent: document.getElementById('previewContent'),
    reportFields: document.getElementById('reportFields'),
    systemFields: document.getElementById('systemFields'),
    endTimeGroup: document.getElementById('endTimeGroup')
};

/**
 * Switch between Report and System Issue templates
 * @param {string} type - 'report' or 'system'
 */
function selectTemplate(type) {
    currentTemplate = type;
    document.getElementById('reportBtn').classList.toggle('active', type === 'report');
    document.getElementById('systemBtn').classList.toggle('active', type === 'system');
    
    elements.reportFields.classList.toggle('hidden', type !== 'report');
    elements.systemFields.classList.toggle('hidden', type !== 'system');
    
    updatePreview();
}

/**
 * Update the live preview based on form inputs
 */
function updatePreview() {
    // Get environment
    let env = elements.envSelect.value;
    let envForSubject = env; // For subject line (might be UNL instead of NGL)
    
    if (env === 'other') {
        env = elements.customEnvInput.value.toUpperCase();
        envForSubject = env;
    } else if (env === 'NGL') {
        // For NGL, use the selected site for timezone
        const nglSite = elements.nglSiteSelect.value;
        if (!nglSite) {
            elements.previewContent.innerHTML = '<div class="empty-preview">Please select NGL site</div>';
            return;
        }
        env = nglSite; // Use site name for timezone lookup
        
        // If UNL, use "UNL" in subject instead of "NGL"
        if (nglSite === 'UNL') {
            envForSubject = 'UNL';
        } else {
            envForSubject = 'NGL';
        }
    }
    
    const ticketNumber = document.getElementById('ticketNumber').value;
    const emailType = document.querySelector('input[name="emailType"]:checked').value;
    
    // Basic validation
    if (!env || !ticketNumber) {
        elements.previewContent.innerHTML = '<div class="empty-preview">Fill in all required fields</div>';
        return;
    }
    
    const fullTicket = `${envForSubject}-${ticketNumber}`;
    let subject = '';
    let htmlBody = '';
    
    if (currentTemplate === 'report') {
        const result = generateReportPreview(fullTicket, emailType);
        if (!result) return;
        subject = result.subject;
        htmlBody = result.htmlBody;
    } else {
        const result = generateSystemPreview(fullTicket, emailType, env);
        if (!result) return;
        subject = result.subject;
        htmlBody = result.htmlBody;
    }
    
    // Display preview
    elements.previewContent.innerHTML = `
        <div style="margin-bottom: 15px;"><strong>Subject:</strong> ${subject}</div>
        <hr style="margin: 20px 0; border: none; border-top: 2px solid #e2e8f0;">
        ${htmlBody}
    `;
}

/**
 * Generate preview for Report template
 * @param {string} fullTicket - Full ticket number (e.g., "NCEL-335674")
 * @param {string} emailType - 'opening' or 'resolved'
 * @returns {object|null} Object with subject and htmlBody, or null if validation fails
 */
function generateReportPreview(fullTicket, emailType) {
    let reportName = elements.reportSelect.value;
    if (reportName === 'other') reportName = elements.customReportInput.value;
    
    const reportDateInput = document.getElementById('reportDate').value;
    
    if (!reportName || !reportDateInput) {
        elements.previewContent.innerHTML = '<div class="empty-preview">Fill in all required fields</div>';
        return null;
    }
    
    const reportDate = formatDate(reportDateInput);
    const subject = `${fullTicket} - Critical Notification - The report ${reportName} for ${reportDate} is being delayed`;
    
    const htmlBody = emailType === 'opening' 
        ? generateReportOpeningHTML(reportName, reportDate)
        : generateReportResolvedHTML(reportName, reportDate);
    
    return { subject, htmlBody };
}

/**
 * Generate preview for System Issue template
 * @param {string} fullTicket - Full ticket number (e.g., "NCEL-335674")
 * @param {string} emailType - 'opening' or 'resolved'
 * @param {string} env - Environment code
 * @returns {object|null} Object with subject and htmlBody, or null if validation fails
 */
function generateSystemPreview(fullTicket, emailType, env) {
    const issueDescValue = elements.issueSelect.value;
    
    if (!issueDescValue) {
        elements.previewContent.innerHTML = '<div class="empty-preview">Fill in issue description</div>';
        return null;
    }
    
    let issueText = issueDescValue;
    let issueTextWithPercentage = issueDescValue; // For Impact Description only
    
    // Handle custom issue
    if (issueDescValue === 'other') {
        issueText = elements.customIssueInput.value;
        issueTextWithPercentage = issueText;
        if (!issueText) {
            elements.previewContent.innerHTML = '<div class="empty-preview">Fill in custom issue description</div>';
            return null;
        }
    }
    
    // Check if issue contains "Decrease in bets" (from dropdown OR custom text)
    const hasDecrease = issueText.toLowerCase().includes('decrease in bets');
    
    if (hasDecrease) {
        const percentage = elements.percentageInput.value;
        if (!percentage) {
            elements.previewContent.innerHTML = '<div class="empty-preview">Please enter percentage for decrease</div>';
            return null;
        }
        
        // Add percentage ONLY to the impact description version
        issueTextWithPercentage = `${issueText} (~${percentage}%)`;
    }
    
    // Subject and main text use issueText WITHOUT percentage
    const subject = `${fullTicket} - Critical Notification - ${issueText}`;
    
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    // Get root cause
    let rootCause = elements.rootCauseSelect.value;
    if (rootCause === 'other') {
        rootCause = elements.customRootCauseInput.value;
    }
    
    // Format times with timezone conversion
    const formattedStartTime = startTime ? formatDateTime(startTime, env) : '';
    const formattedEndTime = endTime ? formatDateTime(endTime, env) : '';
    
    // Pass both versions: issueText (without %) and issueTextWithPercentage (with %)
    const htmlBody = emailType === 'opening'
        ? generateSystemOpeningHTML(issueText, issueTextWithPercentage, formattedStartTime, rootCause)
        : generateSystemResolvedHTML(issueText, issueTextWithPercentage, formattedStartTime, formattedEndTime, rootCause);
    
    return { subject, htmlBody };
}

/**
 * Handle form submission (copy to clipboard)
 * @param {Event} e - Submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get only the email content (without preview wrapper styles)
    const previewHtml = elements.previewContent.innerHTML;
    
    // Extract just the email body (skip subject line)
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    
    // Find the actual email content (after the hr separator)
    const hrElement = doc.querySelector('hr');
    let emailContent = '';
    
    if (hrElement) {
        let node = hrElement.nextSibling;
        while (node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                emailContent += node.outerHTML;
            } else if (node.nodeType === Node.TEXT_NODE) {
                emailContent += node.textContent;
            }
            node = node.nextSibling;
        }
    } else {
        // Fallback: copy everything
        emailContent = previewHtml;
    }
    
    copyToClipboard(emailContent, () => {
        // Visual feedback: change button text and style
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        const originalBg = submitBtn.style.background;
        
        submitBtn.innerHTML = '✅ Copied!';
        submitBtn.style.background = '#48bb78';
        
        // Show success message
        elements.successMessage.classList.add('show');
        
        // Reset after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = originalBg;
            elements.successMessage.classList.remove('show');
        }, 3000);
    });
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Environment select
    elements.envSelect.addEventListener('change', function() {
        const isOther = this.value === 'other';
        const isNGL = this.value === 'NGL';
        
        elements.customEnvDiv.classList.toggle('show', isOther);
        elements.customEnvInput.required = isOther;
        
        // Show/hide NGL site selector
        elements.nglSiteGroup.classList.toggle('hidden', !isNGL);
        elements.nglSiteSelect.required = isNGL;
        
        // Clear NGL site if not needed
        if (!isNGL) {
            elements.nglSiteSelect.value = '';
        }
        
        updatePreview();
    });
    
    // Report name select
    elements.reportSelect.addEventListener('change', function() {
        elements.customReportDiv.classList.toggle('show', this.value === 'other');
        elements.customReportInput.required = this.value === 'other';
        updatePreview();
    });
    
    // Issue description select
    elements.issueSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        const isOther = selectedValue === 'other';
        
        // Check if selected option contains "decrease in bets"
        const hasDecrease = selectedValue.toLowerCase().includes('decrease in bets');
        
        // Show/hide custom issue field
        elements.customIssueDiv.classList.toggle('show', isOther);
        elements.customIssueInput.required = isOther;
        
        // Show/hide percentage field if "decrease in bets" is detected
        elements.percentageGroup.classList.toggle('hidden', !hasDecrease);
        elements.percentageInput.required = hasDecrease;
        
        // Clear percentage if not needed
        if (!hasDecrease) {
            elements.percentageInput.value = '';
        }
        
        updatePreview();
    });
    
    // Custom issue input - check for "Decrease in bets" in text
    elements.customIssueInput.addEventListener('input', function() {
        const text = this.value.toLowerCase();
        const hasDecrease = text.includes('decrease in bets');
        
        // Show percentage field if text contains "decrease in bets"
        if (elements.issueSelect.value === 'other') {
            elements.percentageGroup.classList.toggle('hidden', !hasDecrease);
            elements.percentageInput.required = hasDecrease;
            
            if (!hasDecrease) {
                elements.percentageInput.value = '';
            }
        }
        
        updatePreview();
    });
    
    // Root cause select
    elements.rootCauseSelect.addEventListener('change', function() {
        elements.customRootCauseDiv.classList.toggle('show', this.value === 'other');
        elements.customRootCauseInput.required = this.value === 'other';
        updatePreview();
    });
    
    // Email type radio buttons
    document.querySelectorAll('input[name="emailType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            elements.endTimeGroup.classList.toggle('hidden', this.value !== 'resolved');
            updatePreview();
        });
    });
    
    // All inputs - update preview on change
    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('input', updatePreview);
        el.addEventListener('change', updatePreview);
    });
    
    // NGL site select - update preview
    elements.nglSiteSelect.addEventListener('change', updatePreview);
    
    // Form submission
    elements.form.addEventListener('submit', handleFormSubmit);
}