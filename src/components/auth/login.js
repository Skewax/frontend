import React from 'react'
import { GoogleLogin } from 'react-google-login'

const clientId = process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID


const LoginButton = (props) => {

    function onSuccess(res) {
        props.setUser(res.profileObj)
    }
    
    function onFailure(res) {
        console.log(res)
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
            />
        </div>
    )
}


export default LoginButton