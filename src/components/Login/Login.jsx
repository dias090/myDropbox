import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../api/firebase";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function login(e) {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setError("");
        setEmail("");
        setPassword("");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setError("Error: Couldn't find your account");
      });
  }
  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  return (
    <div>
      <div className="row login-container">
        <form onSubmit={login} className="col s12 m6 offset-m3 z-depth-1 white">
          <h1 className="center blue-text">Login</h1>
          <div className="row">
            <div className="input-field col s10 offset-s1">
              <i className="material-icons prefix">account_circle</i>
              <input
                id="email"
                type="email"
                className="validate"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="input-field col s10 offset-s1">
              <span className="material-icons prefix">lock</span>
              <input
                id="password"
                type="password"
                className="validate"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                autoComplete="password"
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className="col s10 m7 offset-s1 offset-m1">
              <label>
                Dont have an account yet?{" "}
                <a href="/signup">
                  <strong>Sign up</strong>
                </a>
              </label>
            </div>
            <div className="col s10 m3 offset-s1">
              <button className="btn blue right" name="action" type="submit">
                Log In
                <i className="material-icons right">login</i>
              </button>
            </div>
            {error && (
              <div className="col s10 offset-s1">
                <div className="card red lighten-3" style={{ padding: "10px" }}>
                  {error}
                </div>
              </div>
            )}
          </div>
          <br />
        </form>
      </div>
    </div>
  );
};

export default Login;
