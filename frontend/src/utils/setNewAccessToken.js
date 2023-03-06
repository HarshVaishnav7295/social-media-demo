
import { userAction } from "../Redux/userReducer"

export const setNewAccessToken = async(dispatch)=>{
    const clone = JSON.parse(localStorage.getItem('CLONE'))

    let resp = await fetch('http://localhost:8000/api/auth/getNewAccessToken',{
        headers:{
            'Content-Type':'application/json'
        },
        method : 'POST',
        body : JSON.stringify({
            accessToken : clone.accessToken,
            refreshToken : clone.refreshToken
        })
    })
    if(resp.status === 200){
        const {accessToken,refreshToken} = await resp.json()
        dispatch(userAction.updateUser({accessToken, refreshToken}))
        return accessToken
    }else{
        const error = await resp.json()
        console.log(error.errorMessage)
    }
}