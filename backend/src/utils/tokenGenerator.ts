import jwt from "jsonwebtoken";
export const PK = "tsnodeexpress@1234@1234";
export const generateToken = async (id: string): Promise<string> => {
  const token = jwt.sign({ data: { id: id } }, PK, { expiresIn: "24h" });
  return token;
};
