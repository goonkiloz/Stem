import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { useModal } from "../../../context/Modal";
import { useState } from "react";
import { putPostThunk } from "../../../redux/posts";

const EditPostModal = ({post}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [title, setTitle] = useState(post?.title);
    const [description, setDescription] = useState(post?.description);
    const [validationErrors, setValidationErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonDisabled(true)
        setHasSubmitted(true);
        setValidationErrors('');
        const updatedPost = {
            title: title,
            description: description
        }

        console.log(title)
        console.log(description)

        let errors = {};
        if(title?.length === 0) {
            console.log(title)
            errors.title = 'title is required'
        }
        if(description?.length === 0) {
            console.log(title)
            errors.description = 'description is required'
        }

        console.log(errors)

        if (errors?.title || errors?.description) {
            setValidationErrors(errors)
            setButtonDisabled(false)
        } else if(!errors?.title && !errors?.description) {
            const res = await dispatch(putPostThunk(updatedPost, post?.id));
            console.log(res)

            if (!res.id) {
                setValidationErrors(res);
                setButtonDisabled(false)
            } else {
                closeModal()
                navigate(`/posts/${res?.id}`)
            }
        }

    }

    const handleCancelSubmit = () => {
        closeModal()
    }

    return (
        <div className="pageContainer">
            <div>
                <form
                    onSubmit={handleSubmit}
                    className="formContainer"
                    encType="multipart/form-data"
                >
                    <h1>Edit a post</h1>
                    <label>Title
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {validationErrors && hasSubmitted &&
                            <p className="error">{validationErrors.title}</p>}
                    </label>

                    <label>Description
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {validationErrors && hasSubmitted &&
                            <p className="error">{validationErrors.description}</p>}
                    </label>
                    <button
                        type="submit"
                        className="new-post-form-submit"
                        disabled={isButtonDisabled}
                    >Submit</button>

                    <button
                        type="button"
                        onClick={handleCancelSubmit}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditPostModal;
