import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../api/firebase";
import { doc, setDoc } from "firebase/firestore";

import "./Signup.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function registr(e) {
    e.preventDefault();

    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        await updateProfile(userCredential.user, {
          displayName: username,
        })
          .then(() => {
            console.log("User profile updated successfully");
          })
          .catch((error) => {
            setError("Error updating user profile", error);
          });
        const user = auth.currentUser;
        if (user) {
          await setDoc(doc(db, "Users", user.uid), {
            userName: username,
            email: email,
          });
        }
        setError("");
        setUsername("");
        setEmail("");
        setPassword("");
        navigate("/");
      })
      .catch((error) => {
        setError("Error: This email already exists");
      });
  }

  return (
    <div>
      <div className="row signup-container">
        <form 
            className="col s12 l6 offset-l3 z-depth-1 white"
            onSubmit={registr}
        >
          <h1 className="center blue-text">Sign up</h1>
          <div className="row">
            <div className="input-field col s10 offset-s1">
              <i className="material-icons prefix">account_circle</i>
              <input
                id="username"
                type="text"
                className="validate"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="username">User Name</label>
            </div>
            <div className="input-field col s10 offset-s1">
              <i className="material-icons prefix">email</i>
              <input
                id="email"
                type="email"
                className="validate"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email</label>
            </div>   
            <div className="input-field col s10 offset-s1">
              <i className="material-icons prefix">lock</i>
              <input
                id="password"
                type="password"
                className="validate"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="password"
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className="input-field col s10 offset-s1">
              <label className="center">
                Allready have an account?{" "}
                <a href="/login">
                  <strong>Log in</strong>
                </a>{" "}
              </label>
              <button
                className="btn blue right"
                name="action"
                type="submit"
              >
                Sign Up
                <i className="material-icons right">person_add</i>
              </button>
            </div>
            {error && (
              <div className="col s10 offset-s1">
                <div className="card red lighten-3" style={{padding:"10px"}}>{error}</div>
              </div>
            )}
          </div>
          <br />
        </form>
      </div>
    </div>
  );
};

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export default Signup;
