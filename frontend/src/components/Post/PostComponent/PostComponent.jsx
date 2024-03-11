import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import './PostComponent.css'
import LikesComponent from "../../Likes/LikesComponent";
import { getFollowingThunk, postFollowerThunk, removeFollowerThunk } from "../../../redux/followers";
import { useEffect, useState } from "react";


const PostComponent = ({post}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const currentUser = useSelector(state => state?.session?.user)
    const [ follower, setFollower ] = useState(false)
    const [ followerId, setFollowerId] = useState()

    const handleFollow = () => {
        if(!follower) {
            dispatch(postFollowerThunk(post?.userId))
            .then((res) => {
                setFollowerId(res?.id)
                setFollower(true)
            })
        } else {
            dispatch(removeFollowerThunk(followerId))
            .then(() => {
                setFollowerId(null)
                setFollower(false)
            })
        }
    }

    useEffect(() => {
        dispatch(getFollowingThunk(currentUser?.id))
        .then(res => {
            if(res.length > 0) {
                console.log(res)
                const check = res?.find(follower =>follower?.followingUser?.id === post?.userId)
                console.log(check)
                if(check){
                    setFollower(true)
                    setFollowerId(check?.id)
                } else {
                    setFollower(false)
                    setFollowerId(null)
                }
            }
        })
    }, [dispatch, currentUser, follower, post])

    if(post?.userId !== currentUser?.id) {
        return (
            <div className="post-div">
                <div className="video-div">
                    <video controls>
                        <source src={post?.filepath}/>
                    </video>
                </div>
                <div className="post-info">
                    <h3 className='post-title' onClick={() => navigate(`/posts/${post?.id}`)}>{post?.title}</h3>
                    <div className="post-user">
                            <p>{post?.User?.username}</p>
                            {follower ? (
                                <>
                                    <div
                                        className="follow-button"
                                        onClick={handleFollow}
                                    >
                                        <i className="fa-solid fa-check"></i>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div
                                        className="follow-button"
                                        onClick={handleFollow}
                                    >
                                        <i className="fa-solid fa-plus"></i>
                                    </div>
                                </>
                            )}
                    </div>
                    {currentUser &&
                            <LikesComponent post={post}/>
                        }
                </div>
            </div>
        )
    }

    return (
        <div className="post-div">
            <div className="video-div">
                <video controls>
                    <source src={post?.filepath}/>
                </video>
            </div>
            <div className="post-info">
                <h3 className='post-title' onClick={() => navigate(`/posts/${post?.id}`)}>{post?.title}</h3>
                {currentUser &&
                        <LikesComponent post={post}/>
                    }
            </div>
        </div>
    )

}


export default PostComponent;
