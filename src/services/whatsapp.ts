import { io } from 'socket.io-client';

const WHATSAPP_API_URL = import.meta.env.VITE_WHATSAPP_API_URL || 'http://localhost:3000';

class WhatsAppService {
  private socket;

  constructor() {
    this.socket = io(WHATSAPP_API_URL);
    
    this.socket.on('connect', () => {
      console.log('Connected to WhatsApp service');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WhatsApp service');
    });
  }

  async sendMessage(to: string, message: string) {
    return new Promise((resolve, reject) => {
      this.socket.emit('send-message', { to, message }, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      });
    });
  }

  async sendBulkMessage(numbers: string[], message: string) {
    return new Promise((resolve, reject) => {
      this.socket.emit('send-bulk-message', { numbers, message }, (response: any) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      });
    });
  }

  onMessage(callback: (message: any) => void) {
    this.socket.on('message', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export const whatsappService = new WhatsAppService();