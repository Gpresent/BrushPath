import React, { useContext, useState } from "react";
import "../styles/login.css";
import { AuthContext, GoogleProvider } from "../utils/FirebaseContext";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
  getRedirectResult
} from "firebase/auth";
import { auth } from "../utils/Firebase";
import { FirebaseError } from "firebase/app";
import { useGoogleLogin, GoogleLogin } from "@react-oauth/google";




interface FirebaseAuthError {
  code: string;
  message: string;
  // You can add more properties if needed
}

const Login: React.FC = () => {
  const contextValue = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const googAuth = getAuth();

  getRedirectResult(googAuth)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result!);
      const token = credential?.accessToken;

      // The signed-in user info.
      const user = result!.user;

      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });


  return (
    <>
      <div className="login-page">
        <div className="login-prompt">
          To access Zenji, please <b>sign in</b>.
        </div>
        <form onSubmit={handleSubmit} id="login-form" className="form-group">
          <div className="input-group">
            <label htmlFor="email">email</label>
            <input type="text" name="email" />
          </div>
          <div className="input-group">
            <label htmlFor="password">password</label>
            <input type="password" name="password" />
          </div>
          <div className="submit-row">
            <button type="submit" style={{marginRight:"10px"}}>{isRegister ? "Register" : "Login"}</button>
            <div className="check-group">
              <label htmlFor="register">New User?</label>
              <input
                type="checkbox"
                checked={isRegister}
                onChange={() => {
                  setIsRegister(!isRegister);
                }}
                name="register"
              />
            </div>
          </div>
        </form>


        <button onClick={() => { signInWithPopup(auth, GoogleProvider) }}>Sign in with Google</button>
        <div className="login-error">{errorMsg}</div>
      </div>

    </>
  );
};

export default Login;
