import { auth } from '../firebase/config';

interface EmailReminderOptions {
  recipientEmail: string;
  subject: string;
  message: string;
  appointmentDate?: string;
  appointmentType?: string;
  childName?: string;
}

/**
 * Service to handle email-related functionality
 * 
 * In a production app, these functions would make API calls to a backend service
 * that would handle the actual email sending. For this demo, we'll simulate the process.
 */

/**
 * Configure email reminder settings for a user
 * 
 * @param userId User ID
 * @param enableReminders Whether reminders are enabled
 * @param reminderFrequency How often to send reminders (daily, weekly)
 * @param emailAddress Email address to send reminders to
 */
export const configureEmailReminders = async (
  userId: string,
  enableReminders: boolean,
  reminderFrequency: 'daily' | 'weekly' | 'monthly',
  emailAddress: string
): Promise<boolean> => {
  try {
    // In a real app, this would save to a database
    // For demo purposes, we'll save to localStorage
    const settings = {
      userId,
      enableReminders,
      reminderFrequency,
      emailAddress,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(`babybloom-email-settings-${userId}`, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving email settings:', error);
    return false;
  }
};

/**
 * Get email reminder settings for a user
 * 
 * @param userId User ID
 * @returns Email reminder settings
 */
export const getEmailReminderSettings = (userId: string) => {
  const settingsJson = localStorage.getItem(`babybloom-email-settings-${userId}`);
  if (!settingsJson) {
    return {
      enableReminders: false,
      reminderFrequency: 'weekly',
      emailAddress: auth.currentUser?.email || ''
    };
  }
  
  return JSON.parse(settingsJson);
};

/**
 * Send an appointment reminder email
 * 
 * @param options Email options including recipient, subject, and message
 * @returns Promise that resolves when the email is sent
 */
export const sendAppointmentReminder = async (options: EmailReminderOptions): Promise<boolean> => {
  // In a real app, this would send the email via a server API
  // For demo purposes, we'll simulate the process
  
  console.log(`Sending appointment reminder to ${options.recipientEmail}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Message: ${options.message}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This would typically return a response from the API
  return true;
};

/**
 * Schedule an email reminder for an upcoming appointment
 * 
 * @param appointmentDate Date of the appointment
 * @param appointmentType Type of appointment (e.g., "Vaccination")
 * @param recipientEmail Email to send the reminder to
 * @param childName Name of the child
 * @returns Promise that resolves when the reminder is scheduled
 */
export const scheduleAppointmentReminder = async (
  appointmentDate: Date,
  appointmentType: string,
  recipientEmail: string,
  childName: string
): Promise<boolean> => {
  try {
    // In a real app, this would schedule a reminder in a backend system
    // For demo purposes, we'll save to localStorage
    
    const reminder = {
      appointmentDate: appointmentDate.toISOString(),
      appointmentType,
      recipientEmail,
      childName,
      subject: `Reminder: ${childName}'s ${appointmentType} appointment`,
      message: `This is a reminder that ${childName} has a ${appointmentType} appointment on ${appointmentDate.toLocaleDateString()}. Please don't forget!`,
      scheduled: new Date().toISOString(),
      sent: false
    };
    
    // Get existing reminders
    const remindersJson = localStorage.getItem('babybloom-appointment-reminders');
    let reminders = remindersJson ? JSON.parse(remindersJson) : [];
    
    // Add new reminder
    reminders.push(reminder);
    
    // Save updated reminders
    localStorage.setItem('babybloom-appointment-reminders', JSON.stringify(reminders));
    
    return true;
  } catch (error) {
    console.error('Error scheduling appointment reminder:', error);
    return false;
  }
};

/**
 * Get all scheduled reminders
 * 
 * @returns Array of scheduled reminders
 */
export const getScheduledReminders = () => {
  const remindersJson = localStorage.getItem('babybloom-appointment-reminders');
  return remindersJson ? JSON.parse(remindersJson) : [];
};

/**
 * Delete a scheduled reminder
 * 
 * @param appointmentDate Date of the appointment
 * @param childName Name of the child
 * @returns Promise that resolves when the reminder is deleted
 */
export const deleteScheduledReminder = async (
  appointmentDate: string,
  childName: string
): Promise<boolean> => {
  try {
    // Get existing reminders
    const remindersJson = localStorage.getItem('babybloom-appointment-reminders');
    if (!remindersJson) return true;
    
    let reminders = JSON.parse(remindersJson);
    
    // Filter out the reminder to delete
    reminders = reminders.filter(
      (reminder: any) => !(reminder.appointmentDate === appointmentDate && reminder.childName === childName)
    );
    
    // Save updated reminders
    localStorage.setItem('babybloom-appointment-reminders', JSON.stringify(reminders));
    
    return true;
  } catch (error) {
    console.error('Error deleting scheduled reminder:', error);
    return false;
  }
};
