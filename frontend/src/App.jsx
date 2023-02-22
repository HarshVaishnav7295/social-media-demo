import React from "react";
import { Route, Routes } from "react-router-dom";
import ChatContainer from "./components/chatComponents/ChatContainer";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import EditPage from "./components/editProfileComponent/EditPage";
import UploadPost from "./components/UploadPost/UploadPost";
import Search from "./components/Search/Search";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ChatContainer />} />
        <Route path="/addPost" element={<UploadPost />} />
        <Route path="/editProfile" element={<EditPage />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </>
  );
};

export default App;
