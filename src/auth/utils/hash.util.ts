import { hash, genSalt, compare } from 'bcrypt';

export class CryptoUtil {
  public static async generateHash(payload: any) {
    const salt = await genSalt();
    return hash(payload, salt);
  }

  public static async compareHash(payload: string, hashedContent: string) {
    return compare(payload, hashedContent);
  }
}
