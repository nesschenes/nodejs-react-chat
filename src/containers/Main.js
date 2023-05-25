import React, { Component } from "react";
import { connect } from "react-redux";
import SimpleDialog from "../components/utils/Dialogs/SimpleDialog.js";
import ArticlePostModal from "../components/utils/Dialogs/ArticlePostModal.js";
import ArticleContentModal from "../components/utils/Dialogs/ArticleContentModal.js";
import { addArticle } from "../redux/actions/article.js";
import ArticleBlock from "../components/utils/ArticleBlock/";
import Loading from "../components/utils/Loading/";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import socket from "../client/socket.js";
import Swal from "sweetalert2";
import Header from "./Header.js";

const style = {
  container: {},
  postBtn: {
    position: "fixed",
    right: "50px",
    top: "50px",
  },
};

class Main extends Component {
  constructor() {
    super();
    this.state = {
      articlePostModal: false,
      articleContentModal: false,
      activeArticle: "",
      dialog: false,
      dialogText: "",
      FilterArticles: "",
    };
  }

  componentDidMount() {
    const context = this;

    axios
      .post("/getUser", {})
      .then((response) => {
        socket.emit("mainPage", {
          //使用者進入主頁
          name: response.data.name,
          account: response.data.account,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    axios.get("/getArticle").then((res) => {
      this.setState({ FilterArticles: res.data });
    });

    socket.on("addArticle", (msg) => {
      //新增文章後的
      const payload = msg[0];
      context.props.addArticleAction({
        _id: payload._id,
        title: payload.title,
        content: payload.content,
        author: payload.posterAccount,
        avatar: payload.avatar,
        date: payload.PostDate,
        lastModify: payload.PostDate,
        comments: payload.comments,
        tag: payload.tag,
      });
    });
  }

  postArticle = () => {
    this.setState({ articlePostModal: true });
  };
  articleClick = (e, id) => {
    this.setState({ articleContentModal: true });
    this.state.FilterArticles.forEach((i) => {
      if (i._id === id) {
        this.setState({ activeArticle: i });
      }
    });
  };

  searchArticle = (e) => {
    if (e.target.value.length < 1) {
      //輸入框空白
      axios.get("/getArticle").then((res) => {
        this.setState({ FilterArticles: res.data });
      });
      return;
    }
    if (e.target.value.length > 20) {
      Swal.fire({
        text: "不可超過 20 個字",
        icon: "error",
      });
      return;
    }
    axios.get(`/articles/title/${e.target.value}`).then((res) => {
      this.setState({ FilterArticles: res.data });
    });
  };

  render() {
    return (
      <div style={style.container}>
        <Header />
        <TextField
          style={{ position: "absolute", top: "50px", left: "15%" }}
          helperText="搜尋文章..."
          inputProps={{ style: { borderColor: "#EC407A" } }}
          onChange={this.searchArticle}
        />
        {this.state.loading ? <Loading /> : ""}
        {this.state.dialog ? (
          <SimpleDialog content={this.state.dialogText} context={this} />
        ) : (
          ""
        )}
        {this.state.articlePostModal ? (
          <ArticlePostModal user={this.props.user} context={this} />
        ) : (
          ""
        )}
        {this.props.user.login ? (
          <Button
            onClick={this.postArticle}
            color="primary"
            style={style.postBtn}
          >
            發表文章
          </Button>
        ) : (
          ""
        )}
        <ArticleBlock
          articleClick={this.articleClick}
          articles={
            this.state.FilterArticles
              ? this.state.FilterArticles
              : this.props.articles
          }
        />{" "}
        {this.state.articleContentModal ? (
          <ArticleContentModal
            user={this.props.user}
            context={this}
            activeArticle={this.state.activeArticle}
          />
        ) : (
          ""
        )}
        <div style={{ width: "100%", height: "200px" }}></div>
      </div>
    );
  }
}
function mapStateToProp(state) {
  return {
    user: state.userInfo,
    articles: state.article,
  };
}

export default connect(mapStateToProp, {
  addArticleAction: addArticle,
})(Main);
