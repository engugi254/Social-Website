import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LandingPage from "./components/LandingPage";

const App = () => {
  return (
    <>
      <ToastContainer />
      <LandingPage />;
    </>
  );
};

export default App;
