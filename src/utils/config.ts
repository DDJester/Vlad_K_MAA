import dotenv from 'dotenv';
import path from 'path';

// Загрузка .env из корня src
dotenv.config({ path: path.join(__dirname, '../.env') });

export const config = {
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://kmsqacm.lighthouse-cloud.com/kms/lh',
  },
  ui: {
    baseUrl: process.env.UI_BASE_URL || 'https://kmsqacm.lighthouse-cloud.com/kms/lh',
  },
  auth: {
    cmUsername: process.env.CM_USERNAME || 'cm',
    cmPassword: process.env.CM_PASSWORD || 'cm',
    csrUsername: process.env.CSR_USERNAME || 'csr',
    csrPassword: process.env.CSR_PASSWORD || 'csr',
  },
};

if (!config.api.baseUrl || !config.ui.baseUrl) {
  throw new Error('Base URLs are not configured properly');
}