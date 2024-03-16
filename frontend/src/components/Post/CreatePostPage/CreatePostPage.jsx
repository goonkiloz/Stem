import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { postPostThunk } from "../../../redux/posts";
import FollowerSideBar from "../../Follower/FollowerSideBarComponent";
import "./CreatePost.css";

const CreatePostPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state?.session?.user);
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [filePath, setFilePath] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonDisabled(true)
        setHasSubmitted(true);
        setValidationErrors('');
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("userId", user.id);
        formData.append("filePath", filePath);
        let errors = {};

        if(title?.length === 0) {
            console.log(title)
            errors.title = 'title is required'
        }
        if(description?.length === 0) {
            console.log(title)
            errors.description = 'description is required'
        }
        if(filePath === null) {
            console.log(title)
            errors.filePath = 'filePath is required'
        }

        console.log(errors)

        if (errors?.title || errors?.description || errors?.filePath) {
            console.log('error')
            setValidationErrors(errors)
            setButtonDisabled(false)
        } else if(!errors?.title && !errors?.description && !errors?.filePath) {
            const res = await dispatch(postPostThunk(formData));
            console.log(res)

            if (!res.id) {
                setValidationErrors(res);
                setButtonDisabled(false)
            } else {
                navigate(`/posts/${res?.id}`)
            }
        }

    }

    const handleCancelSubmit = () => {
        navigate(`/profile`)
    }

    return (
        <div className="pageContainer">
            <div className="followers">
                <FollowerSideBar />
            </div>
            <div className="form">
                {user ? (

                    <form
                    onSubmit={handleSubmit}
                    className="formContainer"
                    encType="multipart/form-data"
                    >
                    <h1>Add a new post</h1>
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

                    <label>Upload Post (mp4)
                        <input
                            type="file"
                            // accept="mp4/*"
                            onChange={(e) => setFilePath(e.target.files[0])}
                            />
                        {validationErrors && hasSubmitted &&
                            <p className="error">{validationErrors.filePath}</p>}
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
                ) : (
                    <h2>You need to sign in to add a new post</h2>
                )}
            </div>
            <div className="sidebar"/>
        </div>
    );

}

export default CreatePostPage;
