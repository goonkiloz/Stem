import { useDispatch, useSelector } from "react-redux";
import { getCommentsThunk, postCommentThunk } from '../../redux/comments';
import { useState, useEffect } from 'react';
import './Comment.css'


const CommentComponent = ({post}) => {
    const comments = useSelector(state => state?.comments?.allComments)
    const currentUser = useSelector((state) => state.session.user);

    const [comment, setComment] = useState();
    const [validationErrors, setValidationErrors] = useState({});

    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    };

    const dispatch = useDispatch()

    useEffect(() => {
        setValidationErrors({});
    }, [comment]);

    useEffect(() => {
        if(post) {
            dispatch(getCommentsThunk(post?.id))
        }
    }, [dispatch, post])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(comment.slice(comment.length, 1))

        const newComment = {
            comment: comment,
            userId: currentUser.Id,
            postId: post.id
        }

        const res = await dispatch(postCommentThunk(newComment, post?.id))

        console.log(res)

        if (!res.id) {
            setValidationErrors(res)
        } else {
            setComment('')
        }

        console.log(validationErrors)

    };

    if (!comments) return <div>Loading...</div>

    if (comments.length === 0) {
        return(
            <div>
                <div>Be the first to post a comment!</div>
            </div>


        )
    }

    return (
        <div className="commentViewContainer">
            <h3>{comments.length> 1 ? comments.length + ' Comments' : '1 Comment'} </h3>
            <div className='commentsContainer'>
                <div className="comments">
                {comments?.map(comment => (
                    <div key={comment.id} className='commentBox'>
                        <div className="comment">
                            <div className="commentUser">
                                {comment?.User?.username}
                            </div>
                            <div className="commentText">
                                {comment?.comment}
                            </div>
                            <div className="commentTime">
                                {[new Date(comment?.createdAt).toLocaleDateString(undefined, options), ' ', new Date(comment?.createdAt).toLocaleTimeString('en-US')]}
                            </div>
                            {/* {comment?.User?.profileImg} */}
                        </div>
                    </div>
                ))}
                </div>
                <div>
                    <form className='comment-field' onSubmit={handleSubmit}>
                        <textarea
                            className="textfield"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            name='comment'
                            placeholder='Leave your comment here...'
                            rows='5'
                        />
                        <button
                            className='postreview-submit-button'
                            type='button'
                            onClick={handleSubmit}
                            disabled={comment?.length < 10}
                        >
                            Submit your comment
                        </button>
                    </form>
                    {validationErrors && (
                        <p className='review-form-error'>{validationErrors.message}</p>
                    )}
                </div>
            </div>
        </div>
    )
}


export default CommentComponent
