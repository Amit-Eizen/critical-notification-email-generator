/**
 * Main Application Entry Point
 * Initialize the application when DOM is ready
 */

/**
 * Initialize the application
 */
function initApp() {
    console.log('Critical Notification Email Generator - Initializing...');
    
    // Setup all event listeners
    setupEventListeners();
    
    // Initial preview update
    updatePreview();
    
    console.log('Application ready!');
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM is already loaded
    initApp();
}