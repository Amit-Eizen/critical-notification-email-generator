/**
 * Utility Functions
 * Helper functions for date formatting, timezone conversion, and GMT detection
 */

/**
 * Environment to Timezone mapping
 */
const ENVIRONMENT_TIMEZONES = {
    // USA - Eastern Time
    'NCEL': { timezone: 'America/New_York', format: 'us' },
    'NHL': { timezone: 'America/New_York', format: 'us' },
    'VAL': { timezone: 'America/New_York', format: 'us' },
    'WVL': { timezone: 'America/New_York', format: 'us' },
    'IGT Georgia': { timezone: 'America/New_York', format: 'us' },
    
    // USA - Central Time
    'MSL': { timezone: 'America/Detroit', format: 'us' },
    
    // Canada
    'AGLC': { timezone: 'America/Edmonton', format: 'us' },
    'ALC': { timezone: 'America/Halifax', format: 'us' },
    
    // Europe
    'Sazka': { timezone: 'Europe/Prague', format: 'eu' },
    'Sisal IT': { timezone: 'Europe/Rome', format: 'eu' },
    'Win2Day': { timezone: 'Europe/Vienna', format: 'eu' },
    'OPAP': { timezone: 'Europe/Athens', format: 'eu' },
    'SzZrt': { timezone: 'Europe/Budapest', format: 'eu' },
    'Olifeja': { timezone: 'Europe/Vilnius', format: 'eu' },
    'JSC': { timezone: 'Europe/Lisbon', format: 'eu' },
    
    // South America
    'LM': { timezone: 'America/Sao_Paulo', format: 'eu' },
    
    // Turkey
    'Sisal TR': { timezone: 'Europe/Istanbul', format: 'eu' },
    'Bitalih': { timezone: 'Europe/Istanbul', format: 'eu' },
    'Hipodorm': { timezone: 'Europe/Istanbul', format: 'eu' },
    
    // Default (Israel)
    'default': { timezone: 'Asia/Jerusalem', format: 'eu' }
};

/**
 * Get timezone info for environment
 * @param {string} environment - Environment code
 * @returns {object} Timezone info
 */
function getTimezoneInfo(environment) {
    return ENVIRONMENT_TIMEZONES[environment] || ENVIRONMENT_TIMEZONES['default'];
}

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
 * Format datetime with automatic timezone conversion
 * @param {string} datetimeString - Datetime in ISO format (local time)
 * @param {string} environment - Environment code for timezone
 * @returns {string} Formatted datetime with GMT offset
 */
function formatDateTime(datetimeString, environment) {
    if (!datetimeString) return '';
    
    const date = new Date(datetimeString);
    const tzInfo = getTimezoneInfo(environment);
    
    // Convert to target timezone
    const options = {
        timeZone: tzInfo.timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: tzInfo.format === 'us' // Use 12-hour format for US/Canada
    };
    
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);
    
    const dateParts = {};
    parts.forEach(({ type, value }) => {
        dateParts[type] = value;
    });
    
    // Format date based on region
    let dateStr;
    if (tzInfo.format === 'us') {
        // MM/DD/YYYY for US/Canada
        dateStr = `${dateParts.month}/${dateParts.day}/${dateParts.year}`;
    } else {
        // DD/MM/YYYY for rest of world
        dateStr = `${dateParts.day}/${dateParts.month}/${dateParts.year}`;
    }
    
    // Format time with AM/PM for US
    let timeStr;
    if (tzInfo.format === 'us') {
        timeStr = `${dateParts.hour}:${dateParts.minute} ${dateParts.dayPeriod}`;
    } else {
        timeStr = `${dateParts.hour}:${dateParts.minute}`;
    }
    
    // Get GMT offset for the specific date
    const gmtOffset = getGMTOffsetForTimezone(date, tzInfo.timezone);
    
    return `${dateStr} ${timeStr}(GMT ${gmtOffset})`;
}

/**
 * Get GMT offset for a specific timezone and date
 * @param {Date} date - Date to check
 * @param {string} timezone - IANA timezone name
 * @returns {string} GMT offset (e.g., "+3", "-5")
 */
function getGMTOffsetForTimezone(date, timezone) {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    
    const offsetMinutes = (tzDate - utcDate) / (1000 * 60);
    const offsetHours = offsetMinutes / 60;
    
    if (offsetHours >= 0) {
        return `+${Math.abs(offsetHours)}`;
    } else {
        return `-${Math.abs(offsetHours)}`;
    }
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