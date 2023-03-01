import React from "react";
import { Route, Routes } from "react-router-dom";
// import ChatContainer from "./components/chatContainer/ChatContainer";
import EditPage from "./components/EditProfileContainer/EditPage";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ResetPassword from "./components/resetPasswordContainer/ResetPassword";
import Search from "./components/searchContainer/Search";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/chat" element={<ChatContainer />} /> */}
        <Route path="/editProfile" element={<EditPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/forgotPassword" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
