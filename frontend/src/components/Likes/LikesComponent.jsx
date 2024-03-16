import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postLikeThunk, getLikesThunk,  getDislikesThunk, postDislikeThunk, removeDislikeThunk, removeLikeThunk } from '../../redux/likes';
import './Likes.css'

const LikesComponent = ({post}) => {
    const dispatch = useDispatch();
    const [ like, setLike ] = useState(false)
    const [ dislike, setDislike ] = useState(false)
    const [ likeId, setLikeId ] = useState(0)
    const [ dislikeId, setDislikeId ] = useState(0)
    const currentUser = useSelector(state => state?.session?.user)

    useEffect(() => {
        dispatch(getLikesThunk(post?.id))
        .then((res) => {
            if(res?.Likes?.length > 0 ) {
                const check = res?.Likes.find(like => like?.userId === currentUser?.id && like?.postId === post?.id)
                if(check){
                    setLike(true)
                    setLikeId(check?.id)
                } else {
                    setLikeId(null)
                    setLike(false)
                }
            }
        })
    }, [dispatch, currentUser, post])

    useEffect(() => {
        dispatch(getDislikesThunk(post?.id))
        .then((res) => {
            if(res?.Dislikes?.length > 0){
                const check = res?.Dislikes.find(dislike => dislike?.userId === currentUser?.id && dislike?.postId === post?.id)
                if(check){
                    setDislike(true)
                    setDislikeId(check?.id)
                } else {
                    setDislikeId(null)
                    setDislike(false)
                }
            }
        })
    }, [dispatch, currentUser, post])


    const handleLike = () => {
        if(!like && !dislike) {
            dispatch(postLikeThunk(post?.id))
            .then((res) => {
                setLikeId(res.id)
                setLike(true)
            })
            .catch((e) => {
                console.log(e)
            })
        } else {
            dispatch(removeLikeThunk(likeId))
            .then(() => {
                setLikeId(null)
                setLike(false)
            })
            .catch((e) => {
                console.log(e)
            })
        }
    }

    const handleDislike = () => {
        if(!like && !dislike) {
            dispatch(postDislikeThunk(post?.id))
            .then((res) => {
                setDislikeId(res.id)
                setDislike(true)
            })
            .catch((e) => {
                console.log(e)
            })
        } else {
            dispatch(removeDislikeThunk(dislikeId))
            .then(() => {
                setDislikeId(null)
                setDislike(false)
            })
            .catch((e) => {
                console.log(e)
            })
        }
    }

    if(post?.userId !== currentUser?.id)

    return (
        <span className="like-buttons">
            <div className="likesContainer" >
                <div
                    className={like ? `filled` : `empty`}
                    onClick={handleLike}
                >
                    <i className="fa-solid fa-heart"></i>
                </div>
            </div>
            <div className="dislikesContainer">
                <div
                    className={dislike ? `filled` : `empty`}
                    onClick={handleDislike}
                >
                    <i className="fa-solid fa-heart-crack"></i>
                </div>
            </div>
        </span>
    )
}

export default LikesComponent;
