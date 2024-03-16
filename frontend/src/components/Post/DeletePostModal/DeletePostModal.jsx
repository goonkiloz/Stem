import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../../context/Modal';
import { deletePostThunk } from '../../../redux/posts';
const DeletePostModal = ({post}) => {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(deletePostThunk(post.id))
            .then(closeModal)
            .catch(async (res) => {
                if (res) {
                    setErrors(res);
                }
            });
    };

    const handleCancel = (e) => {
        e.preventDefault();
        closeModal()
    };

    return (
        <div className='delete-post modalContainer'>
            <h1>Confirm Delete Post</h1>
            {errors.message && (
                <p className=''>{errors.message}</p>
            )}

            <p>Are you sure you want to remove this post?</p>

            <button
                className='delete-post confirm-button'
                // type='button'
                onClick={handleSubmit}
            >
                Yes
            </button>
            <button
                className='delete-post cancel-button'
                // type='button'
                onClick={handleCancel}
            >
                No
            </button>
        </div>
    )
}

export default DeletePostModal;
