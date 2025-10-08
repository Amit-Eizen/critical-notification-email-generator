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
    reportSelect: document.getElementById('reportName'),
    customReportDiv: document.getElementById('customReportDiv'),
    customReportInput: document.getElementById('customReport'),
    issueSelect: document.getElementById('issueDescription'),
    customIssueDiv: document.getElementById('customIssueDiv'),
    customIssueInput: document.getElementById('customIssue'),
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
    if (env === 'other') env = elements.customEnvInput.value.toUpperCase();
    
    const ticketNumber = document.getElementById('ticketNumber').value;
    const emailType = document.querySelector('input[name="emailType"]:checked').value;
    
    // Basic validation
    if (!env || !ticketNumber) {
        elements.previewContent.innerHTML = '<div class="empty-preview">Fill in all required fields</div>';
        return;
    }
    
    const fullTicket = `${env}-${ticketNumber}`;
    let subject = '';
    let htmlBody = '';
    
    if (currentTemplate === 'report') {
        const result = generateReportPreview(fullTicket, emailType);
        if (!result) return;
        subject = result.subject;
        htmlBody = result.htmlBody;
    } else {
        const result = generateSystemPreview(fullTicket, emailType);
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
 * @returns {object|null} Object with subject and htmlBody, or null if validation fails
 */
function generateSystemPreview(fullTicket, emailType) {
    const issueDescValue = elements.issueSelect.value;
    
    if (!issueDescValue) {
        elements.previewContent.innerHTML = '<div class="empty-preview">Fill in issue description</div>';
        return null;
    }
    
    let issueText = issueDescValue;
    if (issueDescValue === 'other') {
        issueText = elements.customIssueInput.value;
        if (!issueText) {
            elements.previewContent.innerHTML = '<div class="empty-preview">Fill in custom issue description</div>';
            return null;
        }
    }
    
    const subject = `${fullTicket} - Critical Notification - ${issueText}`;
    
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    // Get root cause
    let rootCause = elements.rootCauseSelect.value;
    if (rootCause === 'other') {
        rootCause = elements.customRootCauseInput.value;
    }
    
    const formattedStartTime = startTime ? formatDateTime(startTime) : '';
    const formattedEndTime = endTime ? formatDateTime(endTime) : '';
    
    const htmlBody = emailType === 'opening'
        ? generateSystemOpeningHTML(issueText, formattedStartTime, rootCause)
        : generateSystemResolvedHTML(issueText, formattedStartTime, formattedEndTime, rootCause);
    
    return { subject, htmlBody };
}

/**
 * Handle form submission (copy to clipboard)
 * @param {Event} e - Submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    const htmlContent = elements.previewContent.innerHTML;
    
    copyToClipboard(htmlContent, () => {
        elements.successMessage.classList.add('show');
        setTimeout(() => {
            elements.successMessage.classList.remove('show');
        }, 5000);
    });
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Environment select
    elements.envSelect.addEventListener('change', function() {
        elements.customEnvDiv.classList.toggle('show', this.value === 'other');
        elements.customEnvInput.required = this.value === 'other';
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
        elements.customIssueDiv.classList.toggle('show', this.value === 'other');
        elements.customIssueInput.required = this.value === 'other';
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
    
    // Form submission
    elements.form.addEventListener('submit', handleFormSubmit);
}