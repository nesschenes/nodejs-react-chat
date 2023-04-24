import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Loading from "../components/utils/Loading/";
import ArticleContentModal from "./utils/Dialogs/ArticleContentModal.js";
import { editArticle } from "../redux/actions/article.js";
import {
  Divider,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
} from "@mui/material";
import { grey } from "@mui/material/colors";

const iconButtonElement = (
  <IconButton touch={true} tooltip="選單" tooltipPosition="bottom-left">
    <Icon color={grey[400]} />
  </IconButton>
);

const rightIconMenu = (context, article) => (
  <Menu anchorEl={iconButtonElement} open={true}>
    <MenuItem onClick={() => context.clickArticle(article._id)}>修改</MenuItem>
    <MenuItem>刪除</MenuItem>
  </Menu>
);

class MyArticle extends Component {
  constructor(props) {
    super();
    this.state = {
      userInfoFlag: true, //  componentWillReceiveProps會接到多次，所以確保不重複dispatch 加flag
      articles: [],
      loading: true,
      articleContentModal: false,
      activeArticle: "",
      content: "",
    };
  }

  clickArticle(id) {
    this.setState({ articleContentModal: true });
    this.state.articles.forEach((i) => {
      if (i._id === id) {
        this.setState({ activeArticle: i });
      }
    });
  }

  componentDidMount() {
    if (this.props.userInfo) {
      axios
        .get("/userArticles/" + this.props.userInfo.account)
        .then((response) => {
          this.setState({ articles: response.data });
          this.setState({ loading: false });
        });
    }
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
  componentDidUpdate(prevProps) {
    if (this.props.userInfo && this.props.userInfo !== prevProps.userInfo) {
      if (this.state.userInfoFlag) {
        this.setState({ userInfoFlag: false });
        axios
          .get("/userArticles/" + this.props.userInfo.account)
          .then((response) => {
            this.setState({ articles: response.data });
            this.setState({ loading: false });
          });
      }
    }
  }
  handleConfirm = () => {
    const contentRef = this.refs.content1.refs.div1.innerHTML;
    const articleID = this.state.activeArticle._id;
    this.setState({ articleContentModal: false });
    this.setState({ loading: true });
    axios
      .put("/updateArticle", {
        content: contentRef,
        id: articleID,
      })
      .then((response) => {
        //更新reducer
        this.props.editArticle({
          content: contentRef,
          id: articleID,
        });
        axios
          .get("/userArticles/" + this.props.userInfo.account)
          .then((response) => {
            this.setState({ loading: false });
            this.setState({ articles: response.data });
          });
      });
  };
  render() {
    return (
      <div>
        <List>
          <ListSubheader>文章列表</ListSubheader>

          {this.state.loading ? <Loading /> : ""}

          {this.state.articleContentModal ? (
            <ArticleContentModal
              ref="content1"
              contentEditable={true}
              user={this.props.user}
              context={this}
              activeArticle={this.state.activeArticle}
              confirmBtn={true}
            />
          ) : (
            ""
          )}

          {this.state.articles.map((article, idx) => {
            return (
              <div key={idx}>
                <ListItem>
                  <ListItemSecondaryAction>
                    {rightIconMenu(this, article)}
                  </ListItemSecondaryAction>
                  <ListItemText
                    primary={"作者：" + article.author}
                    secondary={
                      <Typography
                        component="div"
                        variant="body2"
                        sx={{ whiteSpace: "normal", lineHeight: "1.4" }}
                      >
                        <p>
                          <span style={{ color: darkBlack }}>
                            標題：{article.title}
                          </span>
                          <br />
                          發表時間：{article.PostDate}
                        </p>
                      </Typography>
                    }
                  ></ListItemText>
                </ListItem>
                <Divider
                  sx={{
                    my: 2,
                    mx: 3,
                    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                  }}
                />
              </div>
            );
          })}
        </List>
      </div>
    );
  }
}

const mapStateToProp = (state) => ({
  userInfo: state.userInfo,
  articles: state.article,
});

export default connect(mapStateToProp, {
  editArticle,
})(MyArticle);
