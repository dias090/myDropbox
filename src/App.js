import "materialize-css/dist/css/materialize.min.css";

import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./api/firebase";
import { Navigate } from "react-router-dom";

import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Loader from "./components/loader/Loader";
import Home from "./components/Home/Home";

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <Routes>
      <Route path="/" element={authUser ? <Home /> : <Navigate to="/login"/>} />
      <Route path="/Login" element={!authUser ? <Login /> : <Navigate to="/"/>} />
      <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/"/>} />
    </Routes>
  );
}

export default App;
