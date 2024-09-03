export interface Notification {
  id: string;
  motherId: string; // Reference to the Mother
  childId: string; // Reference to the Child
  notificationType: string; // Type of notification (e.g., "Vaccination", "Weighing")
  notificationDate: Date; // Date when the notification was sent
  scheduleDate: Date; // Scheduled date for the event (e.g., vaccination)
  status: string; // Status of the notification ("Sent", "Pending", "Missed")
}
