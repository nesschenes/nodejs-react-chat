import config1 from "../config.js";

// Initialize the express
import express from "express";
const app = express();

import { Server } from "http";
import socket from "socket.io";
// Prepare the socket
const server = Server(app);
const io = socket(server, {
  cors: {
    origin: "*",
  },
});

//引入webpack
import path from "path";
import config from "../../webpack.config";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
const compiler = webpack(config);
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);
app.use(webpackHotMiddleware(compiler));

//引用Express中解析Post的body與cookie的模組
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

//使用axios(一個簡單發出http request的第三方模組)
import axios from "axios";

//Express 中間件的使用
app.use(express.static(path.join(__dirname, "../client")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//引入Express 第三方的session中間件，用來儲存使用者登入session
import session from "express-session";
import MongoStore from "connect-mongo";
app.use(
  session({
    saveUninitialized: false, // don't create session until something stored
    resave: true, //don't save session if unmodified
    secret: "nessohohoh",
    key: "auth_token", //cookie name
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 1 }, //1 days
    store: MongoStore.create({
      mongoUrl: config1.dbURL,
    }),
  })
);

//Redis
import Redis from "./redis";
Redis();

//SOCKET.IO
import { socketio } from "./io.js";
socketio(io, axios, config1);

//引入API
import { api } from "./api.js";
api(app);

//引入React
import React from "react";
import { renderToString } from "react-dom/server";
import {
  RouterContext,
  createRoutesFromChildren,
  matchRoutes,
  Routes,
  Route,
  Router,
} from "react-router";
import root from "../client/root.js";
const routes = createRoutesFromChildren(root.props.children);
import { Provider } from "react-redux";
import { configureStore } from "../redux/store";
import { createTheme, ThemeProvider } from "@mui/material";
import {
  createStaticRouter,
  StaticRouter,
  StaticRouterProvider,
} from "react-router-dom/server";
import { matchPath } from "react-router";
import { createStaticHandler } from "@remix-run/router";

//以下為React server side render的基本配備
app.get("*", (req, res) => {
  //設定Redux一開始的state，用來直接server side render資料
  const initialState = {
    userInfo: {
      login: false,
    },
    article: [],
  };

  axios
    .get(`${config1.origin}/getArticle`) //axios在isomophic的情況中須加上完整域名
    .then((response) => {
      //把ajax後的資料放入上面的initialState，並給server做render
      initialState.article = response.data;
      const store = configureStore(initialState);

      //Material UI 在server side render時所要求
      const muiTheme = createTheme({
        userAgent: req.headers["user-agent"],
      });

      const matchedRoutes = matchRoutes(routes, req.url);
      const promises = matchedRoutes.map(({ route, match }) => {
        if (route.loadData) {
          return route.loadData(store.dispatch, match);
        }
      });
      const context = {};
      Promise.all(promises)
        .then(() => {
          const content = renderToString(
            <Provider store={store}>
              <ThemeProvider theme={muiTheme}>
                <StaticRouter location={req.url} context={context}>
                  <Routes routes={routes} />
                </StaticRouter>
              </ThemeProvider>
            </Provider>
          );

          const state = store.getState();
          const page = renderFullPage(content, state);
          res.status(context.statusCode || 200).send(page);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send(error.message);
        });

      //   //server 根據http status code決定要做什麼處理
      //   match(
      //     { routes, location: req.url },
      //     (error, redirectLocation, renderProps) => {
      //       if (error) {
      //         res.status(500).send(error.message);
      //       } else if (redirectLocation) {
      //         res.redirect(
      //           302,
      //           redirectLocation.pathname + redirectLocation.search
      //         );
      //       } else if (renderProps) {
      //         //使用renderToString 把React component轉為string以做Server side render
      //         const content = renderToString(
      //           <Provider store={store}>
      //             <ThemeProvider muiTheme={muiTheme}>
      //               <RouterContext {...renderProps} />
      //             </ThemeProvider>
      //           </Provider>
      //         );
      //         const state = store.getState();
      //         const page = renderFullPage(content, state); //把html與state做結合
      //         return res.status(200).send(page); //把我們的html送出到client端
      //       } else {
      //         res.status(404).send("Not Found");
      //       }
      //     }
      //   );
    })
    .catch((err) => {
      console.log(err);
      res.end(err);
    });
});

const renderFullPage = (html, preloadedState) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0, maximum-scale=1, minimum-scale=1">
  <title>範例實作</title>
	<link rel="stylesheet" type="text/css" href="/css/reset.css">
	<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
	<script src="/socket.io/socket.io.js"></script>
  <script></script>
	<script>
	  var socket = io.connect();
	</script>
</head>
<body>
<div id="fb-root"></div>

  <div id="app">${html}</div>  
  <script>
  window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
    /</g,
    "\\x3c"
  )}
   </script>
  <script src="bundle.js"></script>
</body>
</html>
`;

const port = 3001;

server.listen(port, "localhost", (error) => {
  if (error) throw error;
  console.log("Express server listening on port", port);
});
