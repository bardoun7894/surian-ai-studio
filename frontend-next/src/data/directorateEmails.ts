/**
 * Directorate Contact Information
 * 
 * This file contains email addresses for all directorates.
 * When you receive the file with directorate contact information,
 * update the emails object below with the actual email addresses.
 * 
 * Format:
 * 'directorate-id': 'email@domain.com',
 * 
 * The directorate IDs should match those returned from the API.
 */

export const directorateEmails: Record<string, string> = {
  // Add directorate emails here when the file is received
  // Example:
  // 'd1': 'directorate1@moe.gov.sy',
  // 'd2': 'directorate2@moe.gov.sy',
  // 'd3': 'directorate3@moe.gov.sy',
};

// Fallback email for general inquiries
export const DEFAULT_CONTACT_EMAIL = 'info@moe.gov.sy';

// Department-specific emails
export const DEPARTMENT_EMAILS: Record<string, string> = {
  'general': 'info@moe.gov.sy',
  'complaints': 'complaints@moe.gov.sy',
  'media': 'media@moe.gov.sy',
};

/**
 * Get email for a specific directorate or department
 */
export function getDirectorateEmail(directorateId: string): string {
  if (!directorateId) return DEFAULT_CONTACT_EMAIL;
  
  // Check if it's a department
  if (DEPARTMENT_EMAILS[directorateId]) {
    return DEPARTMENT_EMAILS[directorateId];
  }
  
  // Check directorate emails
  return directorateEmails[directorateId] || DEFAULT_CONTACT_EMAIL;
}
