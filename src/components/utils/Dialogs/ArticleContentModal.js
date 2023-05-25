import React from "react";
import axios from "axios";
import ListMsg from "../../List.js";
import LeaveMsgModal from "./LeaveMsgModal.js";
import SimpleDialog from "../../utils/Dialogs/SimpleDialog.js";
import Loading from "../Loading/";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
/**
 * A modal dialog can only be closed by selecting one of the actions.
 *
 *   在Dialog加上
 *   modal={false}
     onRequestClose={this.handleClose}
     讓點擊方框旁也可關閉

     articleContentModal 須在parent的state加上

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
    width: "102%",
    height: "90%",
    fontSize: "20px",
    outline: "none",
    overflowY: "scroll",
    borderTop: "1px solid gray",
    color: "black",
    paddingTop: "10px",
  },
  title: {
    height: "20px",
    fontSize: "30px",
  },
  levmsgLine: {
    borderTop: "1px solid gray",
  },
  levmsgTitle: {
    textAlign: "center",
    marginTop: "20px",
  },
  date: {
    marginTop: "30px",
  },
};

export default class ArticleContentModal extends React.Component {
  constructor() {
    super();
    this.state = {
      dialogText: "請先登入",
      dialog: false,
      title: "",
      content: "",
      leaveMsgModal: false,
      comments: [],
      loading: true,
    };
  }
  componentDidMount() {
    const context = this;
    axios
      .get("/articles/" + context.props.activeArticle._id)
      .then((response) => {
        console.log(response.data);
        context.setState({ comments: response.data.comments }, () => {
          context.setState({ loading: false });
        });
      });
  }
  handleClose = () => {
    this.props.context.setState({ articleContentModal: false });
  };
  levmsgModal = () => {
    if (this.props.context.props.user.login === true) {
      this.setState({ leaveMsgModal: true });
    } else {
      this.setState({ dialog: true });
    }
  };
  render() {
    return (
      <div>
        <Dialog
          open={this.props.context.state.articleContentModal}
          onClose={this.handleClose}
        >
          <DialogTitle style={style.title}>
            {this.props.activeArticle.title}
          </DialogTitle>
          <DialogContent style={style.contentStyle}>
            <div style={{ height: "700px" }}>
              <div
                contentEditable={this.props.contentEditable}
                ref="div1"
                style={style.textarea}
                dangerouslySetInnerHTML={{
                  __html: this.props.activeArticle.content,
                }}
              ></div>
            </div>
            發文日期：
            {this.props.activeArticle.PostDate.replace(/[A-Z]/g, " ")}
            <div style={style.levmsgLine}></div>
            <div style={style.levmsgTitle}>留言內容</div>
            {this.state.loading ? <Loading /> : ""}
            <ListMsg comments={this.state.comments} />
            {this.state.leaveMsgModal ? <LeaveMsgModal context={this} /> : ""}
            {this.state.dialog ? <SimpleDialog context={this} /> : ""}{" "}
            {/* 未登入*/}
          </DialogContent>
          <DialogActions>
            {this.props.confirmBtn ? (
              <>
                <Button color="primary" onClick={this.handleClose}>
                  關閉
                </Button>
                <Button
                  color="primary"
                  onClick={this.props.context.handleConfirm}
                >
                  確認
                </Button>
              </>
            ) : (
              <>
                <Button color="primary" onClick={this.levmsgModal}>
                  留言
                </Button>
                <Button color="primary" onClick={this.handleClose}>
                  關閉
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
