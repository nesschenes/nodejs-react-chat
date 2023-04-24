import React, { Component } from "react";
import axios from "axios";
import SimpleDialog from "./utils/Dialogs/SimpleDialog.js";
import { connect } from "react-redux";
import { Button, TextField } from "@mui/material";
import { Navigate } from "react-router";

class Register extends Component {
  constructor(props) {
    super();
    this.state = {
      account: "",
      password: "",
      password1: "",
      email: "",
      nickName: "",
      accountCheck: true,
      passwordCheck: true,
      password1Check: true,
      emailCheck: true,
      checkNickName: true,
      dialog: false,
      dialogText: "",
      navigateTo: "",
    };
  }
  checkAccount(e) {
    this.state.account = e.target.value;
    if (e.target.value === "" || e.target.value.length > 12) {
      this.setState({ accountCheck: false });
      return;
    }
    this.setState({ accountCheck: true });
  }
  checkPassword(e) {
    this.state.password = e.target.value;
    if (e.target.value === "" || e.target.value.length < 6) {
      this.setState({ passwordCheck: false });
      return;
    }
    this.setState({ passwordCheck: true });
  }
  checkPassword1(e) {
    this.state.password1 = e.target.value;
    if (e.target.value === "" || e.target.value !== this.state.password) {
      this.setState({ password1Check: false });
      return;
    }
    this.setState({ password1Check: true });
  }
  checkEmail(e) {
    function validateEmail(email) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
    this.state.email = e.target.value;
    if (e.target.value === "" || validateEmail(e.target.value) === false) {
      this.setState({ emailCheck: false });
      return;
    }
    this.setState({ emailCheck: true });
  }
  checkNickName(e) {
    this.state.nickName = e.target.value;
    if (e.target.value === "") {
      this.setState({ checkNickName: false });
      return;
    }
    this.setState({ checkNickName: true });
  }
  sendRequest() {
    const context = this; //因then會找不到this
    if (
      this.state.account === "" ||
      this.state.password === "" ||
      this.state.password1 === "" ||
      this.state.email === "" ||
      this.state.nickName === ""
    ) {
      this.setState({ dialog: true });
      this.setState({ dialogText: "您好，請填完所有欄位再點選" });
      return;
    }
    axios
      .post("/signup", {
        account: this.state.account,
        password: this.state.password,
        email: this.state.email,
        nickName: this.state.nickName,
      })
      .then(function (response) {
        context.setState({ dialogText: response.data });
        context.setState({ dialog: true });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  dialogConfirm = () => {
    this.setState({ navigateTo: "/login" });
  };
  render() {
    return (
      <div style={style.container}>
        {this.state.navigateTo && <Navigate to={this.state.navigateTo} />}
        <TextField
          onBlur={(e) => this.checkAccount(e)}
          InputLabelProps={{ shrink: true }}
          sx={{ color: "gray", margin: "10px" }}
          label="帳號"
          error={!this.state.accountCheck}
          helperText={
            this.state.accountCheck ? "" : "欄位為空，或輸入超過12個字"
          }
        />
        <br />
        <TextField
          onBlur={(e) => this.checkPassword(e)}
          type="password"
          InputLabelProps={{ shrink: true }}
          sx={{ color: "gray", margin: "10px" }}
          label="密碼"
          error={!this.state.passwordCheck}
          helperText={
            this.state.passwordCheck ? "" : "欄位為空，或輸入密碼不足6個字"
          }
        />
        <br />
        <TextField
          onBlur={(e) => this.checkPassword1(e)}
          type="password"
          InputLabelProps={{ shrink: true }}
          sx={{ color: "gray", margin: "10px" }}
          label="確認密碼"
          error={!this.state.password1Check}
          helperText={
            this.state.password1Check ? "" : "欄位為空，或輸入密碼不相符"
          }
        />
        <br />
        <TextField
          onBlur={(e) => this.checkEmail(e)}
          InputLabelProps={{ shrink: true }}
          sx={{ color: "gray", margin: "10px" }}
          label="E-mail"
          error={!this.state.emailCheck}
          helperText={this.state.emailCheck ? "" : "email格式不正確"}
        />
        <br />
        <TextField
          onBlur={(e) => this.checkNickName(e)}
          InputLabelProps={{ shrink: true }}
          sx={{ color: "gray", margin: "10px" }}
          label="暱稱"
          error={!this.state.checkNickName}
          helperText={this.state.checkNickName ? "" : "欄位不可為空白"}
        />
        <br />
        <Button onClick={() => this.sendRequest()}>註冊</Button>
        {this.state.dialog ? (
          <SimpleDialog
            content={this.state.dialogText}
            confirm={() => this.dialogConfirm()}
            context={this}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

const style = {
  container: {
    textAlign: "center",
    margin: "40px",
  },
};

function mapStateToProp(state) {
  return {};
}

export default connect(mapStateToProp, {})(Register);
