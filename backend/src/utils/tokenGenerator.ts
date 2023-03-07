import jwt from "jsonwebtoken";
export const refreshTokenSecret = 'tsnodeexpress@refresh@1234@1234'
export const accessTokenSecret = 'tsnodeexpress@access@1234@1234'

export const generateToken = async (id: string): Promise<{accessToken:string,refreshToken:string}> => {

  const accessToken = jwt.sign({ data: { id: id } }, accessTokenSecret, { expiresIn: "1h" });
  const refreshToken = jwt.sign({ data: { id: id } }, refreshTokenSecret, { expiresIn: "3d" });
  return {accessToken,refreshToken};
};
