import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "../redux/store";
import { RouterProvider } from "react-router";
import { createTheme, ThemeProvider } from "@mui/material";
import { createBrowserHistory } from "history";
import { createBrowserRouter } from "react-router-dom";
import App from "../containers/App.js";
import Chatroom from "../containers/Chatroom";
import Main from "../containers/Main";
import Login from "../components/Login";
import Register from "../components/Register";
import PersonalInfo from "../components/PersonalInfo";
import MyArticle from "../components/MyArticle";

const initialState = window.__PRELOADED_STATE__;
const store = configureStore(initialState);
const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#ffffff",
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/chatroom",
    element: <Chatroom />,
  },
  {
    path: "/main",
    element: <Main />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/personalinfo",
    element: <PersonalInfo />,
  },
  {
    path: "/myarticle",
    element: <MyArticle />,
  },
]);

createRoot(document.getElementById("app")).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      {/* <Router history={createBrowserHistory()} children={root} /> */}
      <RouterProvider
        router={router}
        fallbackElement={<h1>fallback router</h1>}
      />
    </ThemeProvider>
  </Provider>
);
