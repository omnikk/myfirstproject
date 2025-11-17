import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EditProfile from "./pages/EditProfile";

import Home from "./pages/Home";
import SalonPage from "./pages/SalonPage";
import MasterPage from "./pages/MasterPage";
import Profile from "./pages/Profile";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/salon/:id" element={<SalonPage />} />
        <Route path="/master/:id" element={<MasterPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);