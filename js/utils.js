/**
 * Utility Functions
 * Helper functions for date formatting and GMT detection
 */

/**
 * Format date to "Month DDth" format
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date (e.g., "October 2nd")
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';
    
    return `${month} ${day}${suffix}`;
}

/**
 * Format datetime with automatic GMT offset detection
 * @param {string} datetimeString - Datetime in ISO format
 * @returns {string} Formatted datetime with GMT offset (e.g., "08/10/2025 04:15(GMT +3)")
 */
function formatDateTime(datetimeString) {
    if (!datetimeString) return '';
    
    const date = new Date(datetimeString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // Auto-detect GMT offset based on DST (Israel timezone)
    const gmtOffset = getGMTOffset(date);
    
    return `${day}/${month}/${year} ${hours}:${minutes}(GMT ${gmtOffset})`;
}

/**
 * Detect GMT offset based on Daylight Saving Time
 * @param {Date} date - Date object to check
 * @returns {string} GMT offset ("+2" or "+3")
 */
function getGMTOffset(date) {
    const isDST = (date) => {
        const jan = new Date(date.getFullYear(), 0, 1);
        const jul = new Date(date.getFullYear(), 6, 1);
        return date.getTimezoneOffset() < Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    };
    
    return isDST(date) ? '+3' : '+2';
}

/**
 * Copy HTML content to clipboard
 * @param {string} htmlContent - HTML string to copy
 * @param {Function} successCallback - Function to call on success
 */
function copyToClipboard(htmlContent, successCallback) {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const data = [new ClipboardItem({ 'text/html': blob })];
    
    navigator.clipboard.write(data)
        .then(() => {
            if (successCallback) successCallback();
        })
        .catch(() => {
            // Fallback to plain text
            navigator.clipboard.writeText(htmlContent)
                .then(() => {
                    if (successCallback) successCallback();
                });
        });
}