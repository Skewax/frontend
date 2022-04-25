import React from "react"
import { GoogleLogout } from 'react-google-login'

const clientId = process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID

const LogoutButton = (props) => {

    function onSuccess(res) {
        props.setUser(false)
    }

    return (
        <div >
            <GoogleLogout
                clientId={clientId}
                buttonText={'Sign Out'}
                onLogoutSuccess={onSuccess}
            />
        </div>
    )
}

export default LogoutButton