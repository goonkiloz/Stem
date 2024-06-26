import { useDispatch, useSelector } from "react-redux";
// import { Suspense } from "react";
import { getSinglePostThunk } from "../../../redux/posts";
import { getFollowingThunk, postFollowerThunk, removeFollowerThunk } from "../../../redux/followers";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FollowerSideBar from "../../Follower/FollowerSideBarComponent";
import LikesComponent from "../../Likes/LikesComponent";
import CommentsComponent from "../../Comment/CommentsComponent/CommentComponent";
import './PostDetail.css'

const PostDetailPage = () => {
    const{ postId } = useParams();
    const post = useSelector(state => state?.posts?.byId[postId])
    const [ follower, setFollower ] = useState(false)
    const [ followerId, setFollowerId] = useState()
    const [ isLoaded, setIsLoaded ] = useState(false)
    const currentUser = useSelector(state => state?.session?.user?.user)
    const dispatch = useDispatch()

    useEffect(() => {
        if(post) {
            setIsLoaded(true)
        } else {
            dispatch(getSinglePostThunk(postId))
        }
    }, [dispatch, postId, post])

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
    return (
            <div className="detail-page">
                    <div className="followers">
                        <FollowerSideBar />
                    </div>
                    {isLoaded &&
                    <div className="detail">
                    <div className="detail-post-info">
                        <h3 className='post-title'>{post?.title}</h3>
                        <div className="post-user">
                            <p>{post?.User?.username}</p>
                            {currentUser && currentUser?.id !== post?.userId &&
                            <>
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
                                </>
                                }
                        </div>
                    </div>
                        <div className="detail-video-div">
                            <video controls>
                                <source src={post?.filepath}/>
                            </video>
                        </div>
                        <div className="detail-video-foot">
                        <p>{post?.description}</p>
                        {currentUser &&
                                <LikesComponent post={post}/>
                            }
                        </div>
                        <div className="comment-container">
                            {/* <Suspense fallback={ <Loading />}> */}
                                <CommentsComponent post={post}/>
                            {/* </Suspense> */}
                        </div>
                    </div>
                    }
                    <div className="sidebar"/>
                </div>
        )
}

// function Loading() {
//     return <h2>🌀 Loading...</h2>;
//   }


export default PostDetailPage;
