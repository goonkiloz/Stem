import FollowerSideBar from "../Follower/FollowerSideBarComponent";
import PostComponent from "../Post/PostComponent/PostComponent";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './Profile.css'
import { useDispatch, useSelector } from "react-redux";
import { getSingleUserThunk } from "../../redux/users";
import { getFollowingThunk, postFollowerThunk, removeFollowerThunk, getFollowersThunk } from "../../redux/followers";
import { getUserPostsThunk } from "../../redux/posts";

const ProfilePage = () => {
    const { userId } = useParams();
    const user = useSelector(state => state?.users?.byId[userId])
    const userPosts = useSelector(state => state?.posts?.userPosts)
    const [ follower, setFollower ] = useState(false)
    const [ followerId, setFollowerId] = useState()
    const [ followers, setFollowers ] = useState([])
    const [ following, setFollowing ] = useState([])
    const currentUser = useSelector(state => state?.session?.user)
    const dispatch = useDispatch()

    // console.log(userPosts)
    useEffect(() => {
        dispatch(getSingleUserThunk(userId))
    }, [dispatch, userId])

    useEffect(() => {
        dispatch(getFollowingThunk(currentUser?.id))
        .then(res => {
            if(res.length > 0) {
                const check = res?.find(follower =>follower?.followingUser?.id === userId)
                if(check){
                    setFollower(true)
                    setFollowerId(check?.id)
                } else {
                    setFollower(false)
                    setFollowerId(null)
                }
            }
        })
    }, [dispatch, userId, currentUser, follower])

    useEffect(() => {
        dispatch(getFollowersThunk(userId))
        .then(res => {
            console.log(res)
            setFollowers(res)
        })
    }, [dispatch, userId])

    useEffect(() => {
        dispatch(getFollowingThunk(userId))
        .then(res => {
            setFollowing(res)
        })
        dispatch(getUserPostsThunk(userId))
    }, [dispatch, userId])


    const handleFollow = () => {
        if(!follower) {
            dispatch(postFollowerThunk(userId))
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
        <div className="profile-page">
            <div className="followers">
                <FollowerSideBar />
            </div>
            <div className="profile">
                <div className="user-card">
                    <img className='profile-picture' src={user?.profileImg}/>
                    <div className="user-info">
                        <div className="username-button">
                            <h2 className="user-username">{user?.username}</h2>
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
                        <div className="user-followers">
                            <h3>Followers</h3>
                            <div>
                                {followers?.map((follower) => {
                                    return(
                                        <>
                                            <img src={follower?.follower?.profileImg}/>
                                            <span>{follower?.follower?.username}</span>
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="user-following">
                            <h3>Following</h3>
                            <div>
                                {following?.map((follower) => {
                                    return(
                                        <>
                                            <img src={follower?.followingUser?.profileImg}/>
                                            <span>{follower?.followingUser?.username}</span>
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="user-posts">
                    <h3>{user?.username}&apos;s Posts</h3>
                    <div className="user-videos">
                        {userPosts?.map((post) => {
                            return (
                                <PostComponent post={post} />
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="sidebar"/>
        </div>
    )
}


export default ProfilePage;
