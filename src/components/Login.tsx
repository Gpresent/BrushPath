import React, { useContext, useState } from "react";
import "../styles.css";
import { AuthContext } from "../utils/FirebaseContext";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/Firebase";

const Login: React.FC = () => {
    const contextValue = useContext(AuthContext);
    const [isRegister, setIsRegister] = useState(false);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("SUbmit")
        
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if(isRegister) {
            try {
        
                await createUserWithEmailAndPassword(auth,email,password);
               
            } catch (error) {
              console.error('Error signing up:', error);
              throw error;
            }
        }
        else {
            try {
        
                await signInWithEmailAndPassword(auth,'zenjiapp@gmail.com','T4aleC4pst0ne!');
               
              } catch (error) {
                console.error('Error signing in:', error);
                throw error;
              }
        }


    }
  return (
    <>
    <div className="login-page">
        <form onSubmit={handleSubmit} id="login-form" className="form-group">
            <div className="input-group">
        <label htmlFor="email">email</label>
        <input type="email" name="email" />
        </div>
        <div className="input-group">
        <label htmlFor="password">password</label>
        <input type="password" name="password" />
        </div>
        <div className="submit-row">
        <button type="submit" >{isRegister? "Register":"Login"}</button>
        <div className="check-group">
        <label htmlFor="register">New User?</label>
        <input type="checkbox" checked={isRegister} onChange={() => {setIsRegister(!isRegister)}} name="register" />
        </div>

        
        </div>
        </form>
        

    </div>
    </>
  );
};

export default Login;