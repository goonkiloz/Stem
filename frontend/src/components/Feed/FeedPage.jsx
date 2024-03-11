import { useDispatch, useSelector } from "react-redux";
import { getPostsThunk } from "../../redux/posts";
import { useEffect, useState } from "react";
import PostComponent from "../Post/PostComponent/PostComponent";
import './FeedPage.css'
import { getCurrentUserThunk } from "../../redux/users";
import FollowerSideBar from "../Follower/FollowerSideBarComponent";


const FeedPage = () => {
    const currentUser = useSelector(state => state?.session?.user)
    const posts = useSelector(state => state?.posts?.allPosts)
    const [userId, setUserId ] = useState()

    const dispatch = useDispatch()
    const nonUserPosts = []

    useEffect(() => {
        dispatch(getCurrentUserThunk())
        .then((res)=> {
            setUserId(res?.user?.id)
        })
        dispatch(getPostsThunk())
    }, [dispatch])

    posts?.map((post) => {
        if(post?.userId !== userId){
            nonUserPosts.push(post)
        }
    })


    return (
        <div className="feed-page">
            <div className="followers">
                <FollowerSideBar />
            </div>
            <div className="feed">
            {nonUserPosts?.map((post) => {
                if(currentUser?.id !== post?.id)
                return(
                    <div key={post?.id} className="post">
                        <PostComponent post={post} />
                    </div>
                )
            })}
            </div>
            <div className="sidebar"/>
        </div>
    )
}


export default FeedPage;
