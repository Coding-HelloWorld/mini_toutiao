import React, {Component,Fragment,createElement} from 'react';
import qs from 'querystring'
import {Tooltip} from "antd";
import {DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled} from '@ant-design/icons'
import axios from "axios";
import './index.css'
var likeFlag = -1
var dislikeFlag = -1
var count={
    comment_count:null,
    dislike_count:null,
    upvote_count: null
}
class ArticleContent extends Component {
    state={
        article_id:"",
        article_title: "",
        publish_user: "",
        createdAt:"",
        article_content:"",
        action:null,
    }
    getCount=(article_id)=>{
        axios.post("https://qcotvg.fn.thelarkcloud.com/statistics",{_id:article_id}).then(
            response=>{
                console.log(response)
                // eslint-disable-next-line no-unused-expressions
                count.comment_count=response.data.result.comment_count,
                count.dislike_count=response.data.result.dislike_count,
                count.upvote_count=response.data.result.upvote_count
            },
            error=>{console.log(error)}
        )
    }
    componentDidMount() {
        const {search} = this.props.location
        const contentData = qs.parse(search.slice(1))
        console.log(contentData)
        const {_id,article_title,publish_user,createdAt} = contentData
        axios.post("https://qcotvg.fn.thelarkcloud.com/getContentsOfArticle",{_id:_id}).then(
            response=>{
                console.log(response)
                this.setState({
                    article_id:_id,
                    article_title: article_title,
                    publish_user: publish_user,
                    createdAt:createdAt,
                    article_content:response.data.result
                })
            },
            error=>{console.log(error)}
        )
        this.getCount(_id)
    }
    like = (event)=>{
        if(this.state.action!=='liked'){
            axios.post("https://qcotvg.fn.thelarkcloud.com/upvote",{article_id:this.state.article_id}).then(
                response=>{
                    console.log(response)
                    likeFlag = 1
                    if (dislikeFlag===1){
                        axios.post("https://qcotvg.fn.thelarkcloud.com/cancel_dislike",{article_id:this.state.article_id}).then(
                            response=>{console.log(response)},
                            error=>{console.log(error)}
                        )
                    }
                    dislikeFlag = 0
                    this.getCount(this.state.article_id)
                    this.setState({
                        action:'liked'
                    })
                },
                error=>{console.log(error)}
            )
        }
    }
    dislike = (event)=>{
        if(this.state.action!=='disliked'){
            axios.post("https://qcotvg.fn.thelarkcloud.com/dislike",{article_id:this.state.article_id}).then(
                response=>{
                    console.log(response)
                    dislikeFlag = 1
                    if (likeFlag===1){
                        axios.post("https://qcotvg.fn.thelarkcloud.com/cancel_upvote",{article_id:this.state.article_id}).then(
                            response=>{console.log(response)},
                            error=>{console.log(error)}
                        )
                    }
                    likeFlag = 0
                    this.getCount(this.state.article_id)
                    this.setState({
                        action:'disliked'
                    })
                },
                error=>{console.log(error)}
            )
        }

    }
    render() {
        const {article_title, publish_user, createdAt, article_content,action,comment_count,dislike_count,upvote_count}=this.state
        return (
            <Fragment>
                <h2 align="center">{article_title}</h2>
                <h5 align="center">{publish_user+"  "+createdAt}</h5>
                <p>{article_content}</p>
                <Tooltip key="comment-basic-like" title="赞">
                      <span onClick={this.like}>
                        {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
                          <span className="comment-action">{upvote_count}</span>
                      </span>
                </Tooltip>
                <Tooltip key="comment-basic-dislike" title="踩">
                      <span onClick={this.dislike}>
                        {React.createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined)}
                          <span className="comment-action">{dislike_count}</span>
                      </span>
                </Tooltip>
            </Fragment>
        );
    }
}

export default ArticleContent;