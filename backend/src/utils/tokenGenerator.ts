import jwt from "jsonwebtoken"

export const PK = "tsnodeexpress@1234@1234";
//export const accessTokenSecretKey = 'tsnodeexpress@accesstoken@1234'
//export const refreshTokenSecretKey = 'tsnodeexpress@refreshtoken@1234'
export const generateToken = async (id: string): Promise<string> => {
    const token = jwt.sign({ data: { id: id } }, PK, { expiresIn: "24h" });
    return token;
}
  /*
export const generateToken = async(id:string)=>{
    const accessToken = jwt.sign({data:{'id':id}},accessTokenSecretKey,{expiresIn:'1h'})
    const refreshToken = jwt.sign({data:{'id':id}},refreshTokenSecretKey,{expiresIn:'1y'})
    return {accessToken,refreshToken}
}*/