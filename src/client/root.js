import React from "react";
import { Route, Routes } from "react-router";
import App from "../containers/App";
import Main from "../containers/Main.js";
import Login from "../components/Login.js";
import Register from "../components/Register.js";
import PersonalInfo from "../components/PersonalInfo.js";
import MyArticle from "../components/MyArticle.js";
import Chatroom from "../containers/Chatroom.js";

export default (
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="chatroom" element={<Chatroom />} />
    <Route path="main" element={<Main />} />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="personalinfo" element={<PersonalInfo />} />
    <Route path="myarticle" element={<MyArticle />} />
  </Routes>
);
