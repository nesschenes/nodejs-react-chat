import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import ChatList from "../components/ChatList.js";
import axios from "axios";
import { Avatar, Button, Icon, IconButton, TextField } from "@mui/material";
import socket from "../client/socket.js";
import { Navigate } from "react-router";
import Swal from "sweetalert2";

const style = {
  container: {
    width: "95vw",
    height: "90vh",
    marginLeft: "2%",
  },
  MsgContent: {
    width: "80%",
    height: "90%",
    boxShadow: "10px 10px 5px #888888",
    overflowY: "scroll",
  },
  MsgInputBlock: {
    width: "70%",
    height: "8%",
    boxShadow: "10px 10px 5px #888888",
    fontSize: "25px",
  },
  MsgInputBtn: {
    position: "relative",
    width: "8%",
    height: "8%",
    boxShadow: "10px 10px 5px #888888",
    background: "#64FFDA",
    marginTop: "1%",
    top: "5px",
    left: "15px",
  },
  userList: {
    position: "absolute",
    width: "15%",
    height: "200px",
    right: "5%",
    top: "60px",
  },
  newUserNotify: {
    position: "absolute",
    background: "gray",
    width: "100px",
    height: "30px",
    left: "40%",
    top: "10px",
    zIndex: "20000",
    textAlign: "center",
    color: "white",
  },
};

class Chatroom extends Component {
  constructor() {
    super();
    this.state = {
      users: {},
      msg: [],
      showWelcome: false,
      lastEnterUser: "",
      navigateTo: "",
    };
    this.content = createRef();
    this.contentDiv = createRef();
  }
  componentDidMount() {
    if (typeof window !== "undefined") {
      window.onbeforeunload = () => {
        socket.emit(
          "close",
          document.cookie.replace(
            /(?:(?:^|.*;\s*)a1\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
          )
        ); //$1 表示為match到的第一個參數，可參考https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/n
      };
    }
    const context = this;
    axios
      .post("/getUser", {})
      .then((response) => {
        if (response.data.result === -1) {
          context.setState({ navigateTo: "/main" });
          Swal.fire({
            text: "請先登入，才能進入聊天室",
            icon: "error",
          });
          return;
        }
        socket.emit("chatPage", {
          //使用者進入聊天室
          avatar: response.data.avatar,
          name: response.data.name,
          account: response.data.account,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    socket.on("chat", (res) => {
      //使用者發表訊息
      const newList = this.state.msg;
      newList.push(res.data.content);
      context.setState({ msg: newList });
      //保持捲軸在最下方新消息
      context.contentDiv.current.scrollTop =
        context.contentDiv.current.scrollHeight;
    });

    //用來顯示上方使用者加入聊天訊息框
    socket.on("userEnter", (res) => {
      context.setState({ lastEnterUser: res.user });
      context.setState({ showWelcome: true });
      setTimeout(() => {
        context.setState({ showWelcome: false });
      }, 2000);
    });

    socket.on("chatRoomUsers", (res) => {
      if (this.state.users !== res.user) {
        context.setState({ users: res.user });
      }
    });

    //加上Enter送出快捷鍵
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        context.send();
      }
    });
  }
  send = () => {
    const item = {
      avatar: this.props.userInfo.avatar,
      name: this.props.userInfo.name,
      content: this.content.current.value,
      date:
        new Date().getHours() +
        ":" +
        new Date().getMinutes() +
        ":" +
        new Date().getSeconds(),
    };

    socket.emit("chat", { content: item });
    this.content.current.value = "";
  };

  render() {
    const users = this.state.users;
    return (
      <div style={style.container}>
        {this.state.navigateTo && <Navigate to={this.state.navigateTo} />}
        {this.state.showWelcome ? (
          <div style={style.newUserNotify}>
            {this.state.lastEnterUser}加入聊天
          </div>
        ) : (
          ""
        )}
        <div
          ref={this.contentDiv}
          style={{
            width: "80%",
            height: "90%",
            boxShadow: "10px 10px 5px #888888",
            overflowY: "scroll",
          }}
        >
          <ChatList msg={this.state.msg} />
        </div>
        <br />
        <TextField
          inputRef={this.content}
          sx={{
            width: "70%",
            height: "8%",
            fontSize: "25px",
          }}
        />
        <Button
          onClick={this.send}
          sx={{
            position: "relative",
            width: "8%",
            height: "8%",
            boxShadow: "10px 10px 5px #888888",
            background: "#64FFDA",
            marginTop: "1%",
            top: "5px",
            left: "15px",
          }}
        >
          {"發送" /* <Icon /> */}
        </Button>
        <div style={style.userList}>
          {Object.keys(users).map((objectKey, index) => {
            const name = users[objectKey].name;
            const avatar = users[objectKey].avatar;
            return (
              <IconButton key={index} tooltip={name}>
                <Avatar src={avatar} />
              </IconButton>
            );
          })}
        </div>
      </div>
    );
  }
}
const mapStateToProp = (state) => ({
  userInfo: state.userInfo,
});

export default connect(mapStateToProp, {})(Chatroom);
