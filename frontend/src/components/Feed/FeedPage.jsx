import { useDispatch, useSelector } from "react-redux";
import { getPostsThunk } from "../../redux/posts";
import { useEffect, useState } from "react";
import PostComponent from "../Post/PostComponent/PostComponent";
import './FeedPage.css'
import { getCurrentUserThunk } from "../../redux/users";
import FollowerSideBar from "../Follower/FollowerSideBarComponent";


const FeedPage = () => {
    const currentUser = useSelector(state => state.session.user)
    const posts = useSelector(state => state.posts.allPosts)
    const [ isLoaded, setIsLoaded ] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        if(!currentUser) {
            dispatch(getCurrentUserThunk())
        }
        dispatch(getPostsThunk())
    }, [dispatch, currentUser])

    // posts.map((post) => {
    //     if(post.userId !== userId){
    //         nonUserPosts.push(post)
    //     }
    // })

    useEffect(() => {
        if(posts.length > 0 && (currentUser || currentUser === null)) {
            setIsLoaded(true)
        }
    }, [dispatch, posts, currentUser])

    return (
        <div className="feed-page">
            {isLoaded &&
            <>
                <div className="followers">
                    <FollowerSideBar />
                </div>
                <div className="feed">
                {posts.map((post) => {
                        return(
                            <div key={post.id} className="post">
                                <PostComponent post={post} />
                            </div>
                        )
                })}
                </div>
                <div className="sidebar"/>
            </>
            }
        </div>
    )
}


export default FeedPage;
