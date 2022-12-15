import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

dotenv.config();

const globalSetup = (): void => {
  process.env.DATABASE_URL =
    'postgresql://username:password@localhost:5435/audio_shop_test?schema=public';

  execSync('docker compose up -d postgres-test');
  execSync('npx prisma db push', {
    env: {
      ...process.env,
    },
  });
};

export default globalSetup;
