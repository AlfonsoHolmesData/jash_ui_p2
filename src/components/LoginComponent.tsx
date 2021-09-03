import {useState} from "react";
import {Principal} from "../dtos/principal";
import {authenticate} from "../remote/auth-service";
import ErrorMessageComponent from "./ErrorMessageComponent";
import {Redirect} from "react-router-dom";

interface ILoginProps {
    currentUser: Principal | undefined,
    setCurrentUser: (nextUser: Principal | undefined) => void
}

function LoginComponent(props: ILoginProps) {
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');
    let [errorMessage, setErrorMessage] = useState('');

    function updateUsername(e: any) {
        setUsername(e.currentTarget.value);
    }

    function updatePassword(e: any) {
        setPassword(e.currentTarget.value);
    }

    async function login() {
        try {
            if (username && password) {
                let principal = await authenticate({username, password});
                props.setCurrentUser(principal);
            } else {
                setErrorMessage('You must provide a username and a password!');
            }
        } catch (e: any) {
            setErrorMessage(e.message);
        }

        return (
            props.currentUser ? <Redirect to="/"/> :
        <>
            <div>
                <input id="username-input" type="text" onChange={updateUsername}/>
                <br/><br/>
                <input id="password-input" type="text" onChange={updatePassword}/>
                <br/><br/>
                <button id="login-btn" onClick={login}>Login</button>
                <br/><br/>
                { errorMessage ? <ErrorMessageComponent errorMessage={errorMessage}/> : <></> }
            </div>
        </>
        )
    }
    
    
    return(
        props.currentUser ? <Redirect to="/"/> :
        <>
            <div>
                <input id="username-input" type="text" onChange={updateUsername}/>
                <br/><br/>
                <input id="password-input" type="text" onChange={updatePassword}/>
                <br/><br/>
                <button id="login-btn" onClick={login}>Login</button>
                <br/><br/>
                { errorMessage ? <ErrorMessageComponent errorMessage={errorMessage}/> : <></> }
            </div>
        </>
    )
}

export default LoginComponent;