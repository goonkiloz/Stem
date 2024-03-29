import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../../context/Modal';
// import './EditCommentModal.css'
import { editCommentThunk } from '../../../redux/comments';

function EditCommentModal({comment, postId}) {
    const dispatch = useDispatch();
    const commentText = comment?.comment
    const commentId = comment?.id
    //const sessionUser = useSelector((state) => state.session.user);
    const [validationErrors, setValidationErrors] = useState({});
    const [newComment, setNewComment] = useState(commentText);
    const { closeModal } = useModal();

    useEffect(() => {
        setValidationErrors({});
    }, [newComment]);


    const handleConfirmSubmit = async (e) => {
        e.preventDefault();

        const comment = {
            comment: newComment
        }

        let errors = {};

        if(newComment.startsWith(' ') || newComment.endsWith(' ')) {
            errors.comment = 'comments cannot have whitespaces'
        } else if (newComment.length <= 10) {
            errors.comment = 'comment must be at least 10 characters'
        }

        if(errors.comment) {
            setValidationErrors(errors)
        } else if(!errors.comment) {

            const res = await dispatch(editCommentThunk(comment, commentId, postId));


            if (!res.id) {
                setValidationErrors(res);
            } else {
                closeModal()
            }

        }


    };

    const handleCancelSubmit = (e) => {
        e.preventDefault();
        closeModal()
    };


    return (
        <div className='edit-comment modalContainer'>
            <h1 className='title'>Update Your Comment</h1>
            <form className='comment-form' onSubmit={handleConfirmSubmit}>
                <textarea className='post-comment-form-input'
                    value={newComment}
                    onChange={(e) => setNewComment(e?.target?.value)}
                    name='comment'
                    placeholder='Leave your comment here...'
                    rows='5'
                    >
                </textarea>
                {validationErrors && (
                    <p className='comment form-error'>{validationErrors?.comment}</p>
                )}
                <button className='confirm-submit-button'
                    type='button'
                    onClick={handleConfirmSubmit}
                    >
                    Yes
                </button>
                <button className='cancel-submit-button'
                    type='button'
                    onClick={handleCancelSubmit}
                >
                    No
                </button>
            </form>
        </div>
    )
}

export default EditCommentModal;
