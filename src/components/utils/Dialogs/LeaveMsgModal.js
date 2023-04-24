import React from "react";
import axios from "axios";
import { Button, Dialog } from "@mui/material";
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
        sweetAlert("留言成功");
      })
      .catch((err) => {
        sweetAlert("留言失敗，請重試");
      });
  };
  handleClose = () => {
    this.props.context.setState({ leaveMsgModal: false });
  };
  titleInput = (e) => {
    this.setState({ title: e.target.value });
  };
  render() {
    const action1 = [
      <Button label="取消" color="primary" onClick={this.handleClose} />,
      <Button label="確認" color="primary" onClick={this.handleLeaveMsg} />,
    ];
    return (
      <div>
        <Dialog
          actions={action1}
          modal={false}
          open={this.props.context.state.leaveMsgModal}
          contentStyle={style.contentStyle}
          onRequestClose={this.handleClose}
        >
          <input
            onChange={(e) => this.titleInput(e)}
            placeholder="請輸入標題"
            style={style.titleInput}
            maxLength="15"
          ></input>
          <div style={{ height: "100px" }}>
            <div contentEditable={true} ref="div1" style={style.textarea}></div>
          </div>
        </Dialog>
      </div>
    );
  }
}
