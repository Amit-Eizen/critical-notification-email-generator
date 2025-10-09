/**
 * Template Generator
 * Functions to generate email HTML templates
 */

/**
 * Generate HTML for Report Opening notification
 * @param {string} reportName - Name of the report
 * @param {string} reportDate - Formatted date of the report
 * @returns {string} HTML string
 */
function generateReportOpeningHTML(reportName, reportDate) {
    return `<div style="font-family: Calibri, Arial, sans-serif; font-size: 11pt;">
    <img src="../images/banner-opening.png" style="width: 100%; max-width: 900px; display: block; margin-bottom: 20px;" alt="Critical Notification">
    <p style="margin-bottom: 15px;">This is to inform you that our monitoring systems have detected: The report <b>${reportName}</b> for <b>${reportDate}</b> is being delayed.</p>
    <p style="margin-bottom: 15px;"><u>Impact Description:</u> The report ${reportName} for ${reportDate} is being delayed.</p>
    <p style="margin-bottom: 15px;"><u>Root Cause:</u> Under NG BI team investigation.</p>
    <p style="margin-bottom: 15px;">Further updates will be provided once available.</p>
    <p>Regards,</p>
</div>`;
}

/**
 * Generate HTML for Report Resolved notification
 * @param {string} reportName - Name of the report
 * @param {string} reportDate - Formatted date of the report
 * @returns {string} HTML string
 */
function generateReportResolvedHTML(reportName, reportDate) {
    return `<div style="font-family: Calibri, Arial, sans-serif; font-size: 11pt;">
    <img src="../images/banner-resolved.png" style="width: 100%; max-width: 900px; display: block; margin-bottom: 20px;" alt="Critical Notification - Resolved">
    <p style="margin-bottom: 15px;">This is to inform you that our monitoring systems have detected: The report <b>${reportName}</b> for <b>${reportDate}</b> is being delayed. <b>The issue has been resolved.</b></p>
    <p style="margin-bottom: 15px;"><u>Impact Description:</u> The report ${reportName} for ${reportDate} is being delayed.</p>
    <p style="margin-bottom: 15px;"><u>Root Cause:</u> Under NG BI team investigation.</p>
    <p style="margin-bottom: 15px;">More details will be provided in the incident report.</p>
    <p>Regards,</p>
</div>`;
}

/**
 * Generate HTML for System Issue Opening notification
 * @param {string} issueDescription - Description of the issue
 * @param {string} startTime - Formatted start time (optional)
 * @param {string} rootCause - Root cause description
 * @returns {string} HTML string
 */
function generateSystemOpeningHTML(issueDescription, startTime, rootCause) {
    let timeText = '';
    if (startTime) {
        timeText = `The issue started at ${startTime} and is currently ongoing.`;
    }
    
    return `<div style="font-family: Calibri, Arial, sans-serif; font-size: 11pt;">
    <img src="../images/banner-opening.png" style="width: 100%; max-width: 900px; display: block; margin-bottom: 20px;" alt="Critical Notification">
    <p style="margin-bottom: 15px;">This is to inform you that our monitoring systems have detected: <b>${issueDescription}</b>.</p>
    ${timeText ? `<p style="margin-bottom: 15px;">${timeText}</p>` : ''}
    <p style="margin-bottom: 15px;"><u>Impact description:</u> ${issueDescription}.</p>
    <p style="margin-bottom: 15px;"><u>Root cause:</u> ${rootCause || 'Under investigation.'}</p>
    <p style="margin-bottom: 15px;">Further updates will be provided once available.</p>
    <p>Regards,</p>
</div>`;
}

/**
 * Generate HTML for System Issue Resolved notification
 * @param {string} issueDescription - Description of the issue
 * @param {string} startTime - Formatted start time (optional)
 * @param {string} endTime - Formatted end time (optional)
 * @param {string} rootCause - Root cause description
 * @returns {string} HTML string
 */
function generateSystemResolvedHTML(issueDescription, startTime, endTime, rootCause) {
    return `<div style="font-family: Calibri, Arial, sans-serif; font-size: 11pt;">
    <img src="../images/banner-resolved.png" style="width: 100%; max-width: 900px; display: block; margin-bottom: 20px;" alt="Critical Notification - Resolved">
    <p style="margin-bottom: 15px;">This is to inform you that our monitoring systems have detected: <b>${issueDescription}</b>.</p>
    <p style="margin-bottom: 15px;"><b>The issue has been resolved.</b></p>
    ${startTime ? `<p style="margin-bottom: 15px;"><u>Start time:</u> ${startTime}.</p>` : ''}
    ${endTime ? `<p style="margin-bottom: 15px;"><u>End time:</u> ${endTime}.</p>` : ''}
    <p style="margin-bottom: 15px;"><u>Impact description:</u> ${issueDescription}.</p>
    <p style="margin-bottom: 15px;"><u>Root Cause:</u> ${rootCause || 'Under investigation.'}</p>
    <p style="margin-bottom: 15px;">More details will be provided in the Incident Report.</p>
    <p>Regards,</p>
</div>`;
}ןעכ