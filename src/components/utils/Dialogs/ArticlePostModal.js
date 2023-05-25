import React, { createRef } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Input,
} from "@mui/material";
import socket from "../../../client/socket";

const style = {
  contentStyle: {
    width: "90%",
    maxWidth: "none",
  },
  textarea: {
    marginTop: "5px",
    width: "100%",
    fontSize: "20px",
    border: "1px solid black",
    outline: "none",
    overflowY: "scroll",
    height: "250px",
  },
  title: {
    height: "50px",
    width: "450px",
    fontSize: "20px",
  },
  picBtn: {
    marginTop: "5px",
    background:
      "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+aWNfcGljXzhmOGY4ZjwvdGl0bGU+PGcgZmlsbD0iIzhGOEY4RiIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTUuOTg4IDEyYTQgNCAwIDEgMCAwIDggNCA0IDAgMCAwIDAtOCIvPjxwYXRoIGQ9Ik00MC4wNjggMjQuNzA0bC02LjM3My01LjkyOC05LjM1IDkuNTc1LTUuNDUyLTUuNTg2TDggMzMuMzQyVjE0LjAwNUE2LjAxMiA2LjAxMiAwIDAgMSAxNC4wMDUgOGgyMC4wNThhNi4wMTIgNi4wMTIgMCAwIDEgNi4wMDUgNi4wMDV2MTAuNjk5ek0zNC4wNjMgNkgxNC4wMDVBOC4wMDkgOC4wMDkgMCAwIDAgNiAxNC4wMDV2MjAuMDU4YTguMDA5IDguMDA5IDAgMCAwIDguMDA1IDguMDA1aDIwLjA1OGE4LjAwOSA4LjAwOSAwIDAgMCA4LjAwNS04LjAwNVYxNC4wMDVBOC4wMDkgOC4wMDkgMCAwIDAgMzQuMDYzIDZ6Ii8+PC9nPjwvc3ZnPg==) no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "50%",
    height: "22px",
    width: "22px",
    border: "none",
    cursor: "pointer",
    display: "block",
    outline: "none",
  },
  fileInput: {
    display: "none",
  },
};

export default class ArticleModal extends React.Component {
  constructor() {
    super();
    this.state = {
      title: "",
      tag: "",
    };
    this.div1 = createRef();
    this.fileInput = createRef();
  }
  titleInput = (e) => {
    this.setState({ title: e.target.value });
  };
  handleClose = () => {
    this.props.context.setState({ articlePostModal: false });
  };

  handleConfirm = () => {
    const context = this.props.context;
    this.props.context.setState({ articlePostModal: false });
    this.props.context.setState({ loading: true });
    axios
      .post("/postArticle", {
        name: this.props.user.name,
        account: this.props.user.account,
        content: this.div1.current.innerHTML,
        title: this.state.title,
        avatar: this.props.user.avatar,
        tag: this.state.tag,
      })
      .then((response) => {
        this.props.context.setState({ loading: false });
        context.setState({ dialog: true });
        context.setState({ dialogText: response.data });
        socket.emit("postArticle", { data: "test" });
        location.reload(); //有時會因為Lag關係，發表的client在Reducer產生兩個文章
      })
      .catch((e) => {
        alert(e);
        this.props.context.setState({ loading: false });
      });
  };
  // componentDidMount() {
  //   this.div1.current.addEventListener("keydown", (e) => {
  //     console.log(this.div1.current.innerHTML);
  //     this.setState({ content: this.div1.current.innerHTML });
  //   });
  //   const context = this;
  //   context.fileInput.current.addEventListener("change", () => {
  //     if (
  //       context.fileInput.current.files &&
  //       context.fileInput.current.files[0]
  //     ) {
  //       const FR = new FileReader();
  //       FR.onload = function (e) {
  //         const base64 = e.target.result.replace(
  //           /^data:image\/(png|jpg);base64,/,
  //           ""
  //         );

  //         const xhttp = new XMLHttpRequest();
  //         xhttp.open("POST", "https://api.imgur.com/3/image", true);
  //         xhttp.setRequestHeader("Content-type", "application/json");
  //         xhttp.setRequestHeader("Authorization", "Client-ID a2986d9a6c4e01c");
  //         xhttp.send(JSON.stringify({ image: base64 }));
  //         xhttp.onreadystatechange = function () {
  //           if (xhttp.readyState == 4 && xhttp.status == 200) {
  //             const para = document.createElement("img");
  //             para.height = 150;
  //             para.src = JSON.parse(xhttp.responseText).data.link;
  //             context.fileInput.current.appendChild(para);
  //           }
  //         };
  //       };
  //       FR.readAsDataURL(context.fileInput.current.files[0]);
  //     }
  //   });
  // }
  fileBtn = () => {
    this.fileInput.current.click();
  };
  render() {
    return (
      <div>
        <Dialog
          title="發表文章"
          open={this.props.context.state.articlePostModal}
        >
          <DialogContent style={style.contentStyle}>
            <div style={{ height: "600px" }}>
              <input
                style={style.title}
                maxLength={15}
                placeholder="請輸入標題"
                onChange={(e) => this.titleInput(e)}
              ></input>
              <div>
                <Button onClick={() => this.fileBtn()} style={style.picBtn} />
                <Input
                  style={style.fileInput}
                  id="file-upload"
                  ref={this.fileInput}
                  type="file"
                />
              </div>
              <div
                ref={this.div1}
                contentEditable="true"
                placeholder="請輸入文章內容"
                style={style.textarea}
              ></div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button color="primary" onClick={this.handleConfirm}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
