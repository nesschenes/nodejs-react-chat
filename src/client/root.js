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
    <Route path="/" component={App} />
    <Route path="chatroom" component={Chatroom} />
    <Route path="main" component={Main} />
    <Route path="login" component={Login} />
    <Route path="register" component={Register} />
    <Route path="personalinfo" component={PersonalInfo} />
    <Route path="myarticle" component={MyArticle} />
  </Routes>
);
