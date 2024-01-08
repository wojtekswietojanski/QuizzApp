export type JwtPayload = {
  email: string;
  userId: number;
};

export type JwtPayloadWithToken = JwtPayload & { refreshToken: string };
