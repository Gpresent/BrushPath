import React, { useContext, useState } from "react";
import "../styles/login.css";
import { AuthContext } from "../utils/FirebaseContext";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/Firebase";
import { FirebaseError } from "firebase/app";

interface FirebaseAuthError {
  code: string;
  message: string;
  // You can add more properties if needed
}

const Login: React.FC = () => {
  const contextValue = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const displayError = (error: FirebaseAuthError) => {
    switch (error.code) {
      case "auth/invalid-credential":
        setErrorMsg("Invalid Login");
        break;
      case "auth/too-many-requests":
        setErrorMsg("Please wait before clicking again.");
        break;
      default:
        setErrorMsg("An error occurred during authentication");
    }
  };

  const isValidEmail = (email: string): boolean => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address');
      return;
  }

    if (isRegister) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          if (user.user) {
            updateProfile(user.user, {
              displayName: user.user?.email?.split("@")[0],
            });
          }
        })
        .catch((error) => {
          displayError(error as FirebaseAuthError);
        });
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        displayError(error as FirebaseAuthError);
      }
    }
  };
  return (
    <>
      <div className="login-page">
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
            <button type="submit">{isRegister ? "Register" : "Login"}</button>
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
        <div className="login-error">{errorMsg}</div>
      </div>
    </>
  );
};

export default Login;
