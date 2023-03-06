import jwt from "jsonwebtoken";
export const refreshTokenSecret = 'tsnodeexpress@refresh@1234@1234'
export const accessTokenSecret = 'tsnodeexpress@access@1234@1234'

export const generateToken = async (id: string): Promise<{accessToken:string,refreshToken:string}> => {

  const accessToken = jwt.sign({ data: { id: id } }, accessTokenSecret, { expiresIn: "24h" });
  const refreshToken = jwt.sign({ data: { id: id } }, refreshTokenSecret, { expiresIn: "1y" });
  return {accessToken,refreshToken};
};
