import React from 'react'
import { GoogleLogin } from 'react-google-login'

const clientId = process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID



const LoginButton = (props) => {

    function onSuccess(res) {
        let inc = res.tokenObj.scope
        if(
            inc.includes("email") && 
            inc.includes("profile") && 
            inc.includes("https://www.googleapis.com/auth/drive.file") &&
            inc.includes("https://www.googleapis.com/auth/drive.appdata") &&
            inc.includes("https://www.googleapis.com/auth/userinfo.profile") &&
            inc.includes("openid") && 
            inc.includes("https://www.googleapis.com/auth/userinfo.email")){
            props.setUser(res.profileObj)
            return
        }
        alert("Error: Make sure you select all permissions asked for when signing in")
        props.requestScope(res.profileObj)
    }
    
    function onFailure(res) {
        alert("error: " + toString(res.error))
    }

    return (
        <div >
            <GoogleLogin
                clientId={clientId}
                buttonText={'Sign In'}
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
                theme={(props.theme) ? "dark" : "light"}
                scope={"https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file"}
            />
        </div>
    )
}


export default LoginButton