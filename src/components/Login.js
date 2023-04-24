import React, { Component } from "react";
import { connect } from "react-redux";
import actions from "../redux/actions/userInfo.js";
import SimpleDialog from "./utils/Dialogs/SimpleDialog.js";
import axios from "axios";
import Loading from "./utils/Loading/";
import { Button, TextField } from "@mui/material";
import socket from "../client/socket.js";
import { Navigate } from "react-router";

class Login extends Component {
  constructor(props) {
    super();
    this.state = {
      account: "",
      password: "",
      accountCheck: true,
      passwordCheck: true,
      dialog: false,
      dialogText: "",
      loading: false,
      navigateTo: "",
    };
  }
  checkAccount = (e) => {
    this.state.account = e.target.value;
    if (e.target.value === "") {
      this.setState({ accountCheck: false });
      return;
    }
    this.setState({ accountCheck: true });
  };
  checkPassword = (e) => {
    this.state.password = e.target.value;
    if (e.target.value === "") {
      this.setState({ passwordCheck: false });
      return;
    }
    this.setState({ passwordCheck: true });
  };
  sendRequest = () => {
    this.setState({ loading: true });
    const context = this;
    axios
      .post("/login", {
        account: context.state.account,
        password: context.state.password,
      })
      .then((response) => {
        if (response.data.result === -1) {
          context.setState({ dialog: true });
          context.setState({ dialogText: "帳號或密碼錯誤" });
          return; //未登入
        }
        axios
          .post("/getUser", {}) ///這裡如發出get並且在server重啟第一次的情況，getuser的get會延遲，但開devtool disable cache又不會，改成post則沒這問題
          .then((response) => {
            context.setState({ loading: false });
            if (response.data.result !== -1) {
              //login時先把其他登入的裝置登出
              socket.emit("logout", context.state.account);
              socket.emit("login", response.data);
              context.props.userInfoAction(response.data);
              context.setState({ navigateTo: "/main" });
            } else {
              context.setState({ dialogText: "帳號或密碼錯誤" });
              context.setState({ dialog: true });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    const { navigateTo } = this.state;
    return (
      <>
        {navigateTo && <Navigate to={navigateTo} />}
        {this.state.loading ? (
          <Loading />
        ) : (
          <div style={style.container}>
            <TextField
              onBlur={this.checkAccount}
              InputLabelProps={{ shrink: true }}
              sx={{ color: "gray", margin: "10px" }}
              label="帳號"
              error={!this.state.accountCheck}
              helperText={
                this.state.accountCheck ? "" : "This field is required"
              }
            />
            <br />
            <TextField
              type="password"
              onBlur={this.checkPassword}
              InputLabelProps={{ shrink: true }}
              sx={{ color: "gray", margin: "10px" }}
              label="密碼"
              error={!this.state.passwordCheck}
              helperText={
                this.state.passwordCheck ? "" : "This field is required"
              }
            />
            <br />
            <Button onClick={this.sendRequest}>登入</Button>
            {this.state.dialog ? (
              <SimpleDialog content={this.state.dialogText} context={this} />
            ) : (
              ""
            )}
          </div>
        )}
      </>
    );
  }
}

const style = {
  container: {
    textAlign: "center",
    margin: "40px",
  },
};

const mapStateToProp = (state) => ({});

export default connect(mapStateToProp, {
  userInfoAction: actions.userInfo,
})(Login);
