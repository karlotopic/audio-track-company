import { sign, verify } from 'jsonwebtoken';
import { JwtTokenType } from 'src/types/jwt.type';

export class JwtUtil {
  public static generateToken(payload: JwtTokenType) {
    return sign(payload, process.env.SIGN_SECRET!, {
      expiresIn: '1h',
    });
  }

  public static verify(token: string) {
    return verify(token, process.env.SIGN_SECRET!) as JwtTokenType;
  }
}
