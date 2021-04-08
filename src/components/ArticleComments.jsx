import React, { Component } from 'react';
import {Link} from '@reach/router'

import { getCommentsByArticleId, postComment, deleteComment } from '../utils/api'

import {dateFormatter} from '../utils/dateFormatter'

class ArticleComments extends Component {
    state = {
        comments: [],
        isLoading: true,
        commentDeleted: false,
        username: "tickle122",
        body: "",
    }
    
    componentDidMount() {
        const { article_id } = this.props
        
        return getCommentsByArticleId(article_id).then((comments) => {
            this.setState({ comments })
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const { body, username } = this.state
        const newPost = { body, username }

        const { article_id } = this.props

        // postComment and then load new comment in list without refresh
        return postComment(newPost, article_id).then(() => {
            return getCommentsByArticleId(article_id).then((comments) => {
                this.setState({ comments })
            })
        })
    }

    handleChange = (event) => {
        const body = event.target.value
        this.setState({body})
    }

    handleDeleteComment = (event) => {
        const comment_id = event.target.parentElement.parentElement.id
        const { article_id } = this.props
        
        // deleteComment and then load new list of comments 
        // without deleted comment and without refresh
        return deleteComment(comment_id).then(() => {
            return getCommentsByArticleId(article_id).then((comments) => {
                this.setState({ comments })
            })
        })
    }
    
    render() {
        const { comments } = this.state

        return (
            <div className="article-comments">
                <h2>Comments</h2>

                {comments.map(({ body, author, votes, created_at, comment_id }) => {
                    const formattedDate = dateFormatter(created_at)
                    if (author === this.state.username) {
                        return (
                            <div className="comment" id={comment_id} key={ comment_id}>
                                <p>{author} | votes: {votes} | {formattedDate} | 
                                <Link to="" onClick={this.handleDeleteComment}>delete</Link>
                                </p>
                                <p>{ body}</p>
                            </div>
                        )
                    } else {
                        return (
                            <div className="comment" id={comment_id} key={ comment_id}>
                                <p>{author} | votes: {votes} | {formattedDate} </p>
                                <p>{ body}</p>
                            </div>
                        )
                    }

                })}
                
                <h2>Post a new comment</h2>
                <p>Logged in as tickle122</p>
                <form onSubmit={this.handleSubmit}>                    
                    <label htmlFor="body">Comment: </label><br/>
                    <textarea type="textarea" name="body" id="body" onChange={this.handleChange}/><br/>
                    
                    <button type="submit">Post new comment</button>
                </form>

            </div>
        );
    }
}

export default ArticleComments;