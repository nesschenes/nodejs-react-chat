import React, { Component } from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import List from '../components/List.js'
import RaisedButton from 'material-ui/RaisedButton';
import SimpleDialog from '../components/utils/Dialogs/SimpleDialog.js';
import ArticlePostModal from '../components/utils/Dialogs/ArticlePostModal.js';
import ArticleContentModal from '../components/utils/Dialogs/ArticleContentModal.js';
import { addArticle } from '../redux/actions/article.js';
import ArticleBlock from '../components/utils/ArticleBlock/';
import Loading from '../components/utils/Loading/';
import axios from 'axios';
import config from '../config';

const style = {
  container: {
  },
  postBtn: {
    position: 'fixed',
    right: '50px',
  },
}

class Main extends Component {
  constructor() {
    super();
    this.state = {
      articlePostModal: false,
      articleContentModal: false,
      activeArticle: '',
      dialog: false,
      dialogText: ''
    }
  }
  componentDidMount() {
    const context = this;

      axios.post('/getUser',{})
      .then(function (response) {
        socket.emit('mainPage',{ //使用者進入主頁
          name: response.data.name,
          account: response.data.account
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    socket.on('addArticle',function(msg){//新增文章後的
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
        tag: payload.tag
      });
    })
  }

  postArticle() {
    this.setState({ articlePostModal: true })
  }
  articleClick(e,id) {
    this.setState({ articleContentModal: true })
    this.props.articles.forEach( i => {
      if (i._id === id ){
        this.setState({ activeArticle: i })
      }
    });
  }
  render() {
    return (
      <div style={style.container}>
        { this.state.loading ? <Loading /> : '' }
        { this.state.dialog ? <SimpleDialog content={this.state.dialogText} context={this} /> : '' }
        { this.state.articlePostModal ? <ArticlePostModal user={this.props.user} context={this} /> : '' }
        { this.props.user.login
          ?
          <RaisedButton
          onClick={() => this.postArticle()}
          label="發表文章" primary={true}
          style={style.postBtn} />
          :
          ''
        }
          <ArticleBlock articleClick={(e,id) => this.articleClick(e,id)} articles={this.props.articles} />
          { this.state.articleContentModal
            ?
            <ArticleContentModal
              user={this.props.user}
              context={this}
              activeArticle={this.state.activeArticle}
            />
            :
            ''
          }
          <div style={{width:'100%', height: '200px'}}>

          </div>
      </div>
    )
  }

}
function mapStateToProp(state){
	return {
    user:state.userInfo,
    articles: state.article
  }
}

export default connect(mapStateToProp,{
    addArticleAction: addArticle,
  })(Main)
