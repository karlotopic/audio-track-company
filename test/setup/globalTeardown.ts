import { execSync } from 'child_process';

const globalTeardown = async (): Promise<void> => {
  execSync('docker stop povio-assignment-test-db');
  execSync('docker rm povio-assignment-test-db');
};

export default globalTeardown;
