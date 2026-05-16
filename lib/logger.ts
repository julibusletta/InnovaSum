import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'data', 'app-logs.txt');

export function logToFile(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  let logMessage = `[${timestamp}] ${message}`;
  if (data) {
    logMessage += `\nData: ${JSON.stringify(data, null, 2)}`;
  }
  logMessage += '\n' + '-'.repeat(50) + '\n';

  try {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.appendFileSync(LOG_FILE, logMessage);
    console.log(message); // Also log to console
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}
