export interface NotificationMessage { to: string; subject: string; template: string; context: any; }
export async function dispatchSalonNotification(msg: NotificationMessage): Promise<boolean> {
  console.log(`[NOTIFICATION DISPATCH] To: ${msg.to} | Subject: ${msg.subject}`);
  return true;
}
