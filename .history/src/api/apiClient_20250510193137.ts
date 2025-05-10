import { APIRequestContext, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { config } from '../utils/config';

// Загрузка .env из кастомной папки
dotenv.config({ path: path.join(__dirname, 'src/.env') });

interface LoginResponse {
  token: string;
  userId: string;
}

interface TransferResponse {
  success: boolean;
  transactionId: string;
  balance: number;
}

export class ApiClient {
  constructor(private request: APIRequestContext) {}

  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await this.request.get(`${config.api.baseUrl}/api/login`, {
      params: { username, password }
    });
    
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody.token).toBeDefined();
    expect(responseBody.userId).toBeDefined();
    
    return responseBody;
  }

  async transferItem(
    authToken: string,
    fromUserId: string,
    toUserId: string,
    itemId: string,
    amount: number
  ): Promise<TransferResponse> {
    const response = await this.request.post(`${process.env.API_BASE_URL}/api/transfer`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      data: { fromUserId, toUserId, itemId, amount }
    });
    
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(responseBody.transactionId).toBeDefined();
    
    return responseBody;
  }
}