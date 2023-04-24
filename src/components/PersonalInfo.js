import React, { Component, createRef } from "react";
import axios from "axios";
import SimpleDialog from "./utils/Dialogs/SimpleDialog.js";
import { connect } from "react-redux";
import { Button, TextField } from "@mui/material";

class PersonalInfo extends Component {
  constructor(props) {
    super();
    this.state = {
      name: "",
      account: "",
      date: "",
      address: "",
      hobby: "",
      mobile: "",
      nameCheck: true,
      mobileCheck: true,
      addressCheck: true,
      hobbyCheck: true,
    };
    this.fileInput = createRef();
    this.avatar = createRef();
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.userInfo !== "undefined" &&
      nextProps.userInfo !== prevState.userInfo
    ) {
      return {
        userInfo: nextProps.userInfo,
        name: nextProps.userInfo.name,
        date: nextProps.userInfo.birthday,
        address: nextProps.userInfo.address,
        hobby: nextProps.userInfo.hobby,
        mobile: nextProps.userInfo.mobile,
      };
    }
    return null;
  }
  check = (e, type) => {
    if (e.target.value === "") {
      this.setState({ [type]: false });
      return;
    }
    this.setState({ [type]: true });
  };
  sendRequest() {
    axios
      .put("/UpdateUserInfo", {
        account: this.props.userInfo.account,
        avatar: this.props.userInfo.avatar,
        name: this.state.name,
        mobile: this.state.mobile,
        address: this.state.address,
        hobby: this.state.hobby,
        birthday: this.state.date,
      })
      .then((response) => alert(response.data));
  }

  componentDidMount() {
    const context = this;
    context.fileInput.current.addEventListener("change", () => {
      if (
        context.fileInput.current.files &&
        context.fileInput.current.files[0]
      ) {
        var FR = new FileReader();
        FR.onload = function (e) {
          const base64 = e.target.result.replace(
            /^data:image\/(png|jpg|jpeg);base64,/,
            ""
          );
          console.log(base64);
          const xhttp = new XMLHttpRequest();
          xhttp.open("POST", "https://api.imgur.com/3/image", true);
          xhttp.setRequestHeader("Content-type", "application/json");
          xhttp.setRequestHeader("Authorization", "Client-ID a2986d9a6c4e01c");
          xhttp.send(JSON.stringify({ image: base64 }));
          xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
              const avatarSrc = JSON.parse(xhttp.responseText).data.link;
              context.avatar.current.src = avatarSrc;
              axios
                .put("/UpdateUserInfo", {
                  avatar: avatarSrc,
                  account: context.props.userInfo.account,
                  name: context.state.name,
                  mobile: context.state.mobile,
                  address: context.state.address,
                  hobby: context.state.hobby,
                  birthday: context.state.date,
                })
                .then((res) => {
                  console.log(res.data);
                  location.reload();
                });
            }
          };
        };
        FR.readAsDataURL(context.fileInput.current.files[0]);
      }
    });
  }
  changeText = (e, type) => {
    this.setState({ [type]: e.target.value });
  };
  render() {
    return (
      <div style={style.container}>
        <div style={style.left}>
          {this.props.userInfo.avatar ? (
            <img
              ref={this.avatar}
              height="200px"
              src={this.props.userInfo.avatar}
            />
          ) : (
            ""
          )}
          <input
            style={style.fileInput}
            id="file-upload"
            ref={this.fileInput}
            type="file"
          />
        </div>
        <div style={style.fieldContainer}>
          <TextField
            onBlur={(e) => this.check(e, "nameCheck")}
            onChange={(e) => this.changeText(e, "name")}
            value={this.state.name}
            InputLabelProps={{ shrink: true }}
            sx={{ color: "gray", margin: "10px" }}
            label="暱稱"
            error={!this.state.nameCheck}
            helperText={this.state.nameCheck ? "" : "This field is required"}
          />
          <br />
          <TextField
            onBlur={(e) => this.check(e, "mobileCheck")}
            value={this.state.mobile}
            InputLabelProps={{ shrink: true }}
            sx={{ color: "gray", margin: "10px" }}
            onChange={(e) => this.changeText(e, "mobile")}
            label="手機"
            error={!this.state.mobileCheck}
            helperText={this.state.mobileCheck ? "" : "This field is required"}
          />
          <br />
          <TextField
            onBlur={(e) => this.check(e, "addressCheck")}
            value={this.state.address}
            InputLabelProps={{ shrink: true }}
            sx={{ color: "gray", margin: "10px" }}
            onChange={(e) => this.changeText(e, "address")}
            label="地址"
            error={!this.state.addressCheck}
            helperText={
              this.state.addressCheck
                ? ""
                : "This field is required or Not match password"
            }
          />
          <br />
          <TextField
            onBlur={(e) => this.check(e, "hobbyCheck")}
            value={this.state.hobby}
            InputLabelProps={{ shrink: true }}
            sx={{ color: "gray", margin: "10px" }}
            onChange={(e) => this.changeText(e, "hobby")}
            label="興趣"
            error={!this.state.hobbyCheck}
            helperText={
              this.state.hobbyCheck
                ? ""
                : "This field is required or Wrong email format"
            }
          />
          <br />
          <TextField
            helperText=""
            type="date"
            id="date1"
            value={this.state.date}
            onChange={(e) => this.changeText(e, "date")}
            InputLabelProps={{ shrink: true }}
            sx={{ color: "gray", margin: "10px" }}
            label=""
          />
          <br />
        </div>
        <Button
          onClick={() => this.sendRequest()}
          color="primary"
          sx={{ margin: "10px" }}
        >
          設定完成
        </Button>
        {this.state.dialog ? (
          <SimpleDialog content={this.state.dialogText} context={this} />
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
  },
  avatar: {},
  ofieldContainer: {
    marginLeft: "400px",
    marginTop: "80px",
  },
  text: {
    textAlign: "center",
    fontSize: "50px",
    marginTop: "200px",
  },
  fileInput: {
    marginTop: "20px",
  },
  left: {
    position: "absolute",
    top: "180px",
    left: "20%",
    display: "flex",
    flexDirection: "column",
  },
};

const mapStateToProp = (state) => ({
  userInfo: state.userInfo,
});

export default connect(mapStateToProp, {})(PersonalInfo);
