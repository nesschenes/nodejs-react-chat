import React from "react";
import axios from "axios";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import Swal from "sweetalert2";
/**
 * A modal dialog can only be closed by selecting one of the actions.
 *
 *   在Dialog加上
 *   modal={false}
     onRequestClose={this.handleClose}
     讓點擊方框旁也可關閉

     leaveMsgModal 須在parent的state加上
     handleLeaveMsg 須在parent的method

     props:
     contentEditable
     confirmBtn
     activeArticle
 */
const style = {
  contentStyle: {
    width: "90%",
    maxWidth: "none",
  },
  textarea: {
    marginTop: "20px",
    width: "100%",
    height: "90%",
    fontSize: "20px",
    outline: "none",
    border: "1px solid gray",
  },
  levmsgTitle: {
    textAlign: "center",
    marginTop: "20px",
  },
  titleInput: {
    height: "30px",
    width: "250px",
    fontSize: "15px",
  },
};

export default class LeaveMsgModal extends React.Component {
  constructor() {
    super();
    this.state = {
      title: "",
    };
  }
  handleLeaveMsg = () => {
    this.props.context.setState({ leaveMsgModal: false });
    axios
      .put("/leavemsg", {
        id: this.props.context.props.activeArticle._id,
        title: this.state.title,
        content: this.refs.div1.innerHTML, //因contentEditable div 無法用onChange抓e.target.value
        authorAccount: this.props.context.props.context.props.user.account,
        userAvatar: this.props.context.props.context.props.user.avatar,
      })
      .then((response) => {
        Swal.fire({
          target: document.getElementById("swal2-container"),
          customClass: {
            container: "swal2-container",
          },
          text: "留言成功",
          icon: "success",
        });
      })
      .catch((err) => {
        Swal.fire({
          target: document.getElementById("swal2-container"),
          customClass: {
            container: "swal2-container",
          },
          text: "留言失敗，請重試",
          icon: "error",
        });
      });
  };
  handleClose = () => {
    this.props.context.setState({ leaveMsgModal: false });
  };
  titleInput = (e) => {
    this.setState({ title: e.target.value });
  };
  render() {
    return (
      <div>
        <Dialog
          open={this.props.context.state.leaveMsgModal}
          onClose={this.handleClose}
        >
          <DialogContent style={style.contentStyle}>
            <input
              onChange={(e) => this.titleInput(e)}
              placeholder="請輸入標題"
              style={style.titleInput}
              maxLength="15"
            ></input>
            <div style={{ height: "100px" }}>
              <div
                contentEditable={true}
                ref="div1"
                style={style.textarea}
              ></div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClose}>
              取消
            </Button>
            ,
            <Button color="primary" onClick={this.handleLeaveMsg}>
              確認
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
