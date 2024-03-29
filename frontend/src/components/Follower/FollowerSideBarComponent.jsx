import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUsersThunk } from "../../redux/users"
import './Follower.css'
import { currentFollowersThunk, currentFollowingThunk } from "../../redux/followers"
import { useNavigate } from "react-router-dom"

const FollowerSideBar = () => {
    const following = useSelector(state => state?.followers?.currentUserFollowing)
    const followers = useSelector(state => state?.followers?.currentUserFollowers)
    const users = useSelector(state => state?.users?.allUsers)
    const currentUser = useSelector(state => state?.session?.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if(currentUser) {
            dispatch(currentFollowersThunk())
            dispatch(currentFollowingThunk())
        }
        dispatch(getUsersThunk())
    }, [dispatch, currentUser])

    const popularUsers = users.sort(function(a, b) {
        let keyA = a.Followers.length
        let keyB = b.Followers.length

        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    })

    const newUsers = users?.sort(function(a, b) {
        let keyA = a.createdAt
        let keyB = b.createdAt

        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
    })

    return (
        <div className="follower-sidebar-container">
        {currentUser ? (
                <div className="sidebar-followers">
                    <h3>Followers</h3>
                    {followers.slice(0, 5).map((user) => {
                        return(
                            <div key={user.id}>
                                <h4 onClick={() => navigate(`/user/${user.follower.id}`)}>{user?.follower?.username}</h4>
                            </div>
                        )
                    })}

                </div>

        ): (
            <div className="sidebar-followers">
                <h3>Followers</h3>
                <p>Log in to see followers</p>
            </div>
        )}
        {currentUser ? (
            <div className="sidebar-following">
            <h3>Following</h3>
                {following.slice(0, 5).map((user) => {
                    // console.log(user)
                    return(
                        <div key={user.id}>
                            <h4 onClick={() => navigate(`/user/${user.followingUser.id}`)}>{user.followingUser.username}</h4>
                        </div>
                    )
                })}
            </div>
        ) : (
            <div className="sidebar-following">
                <h3>Following</h3>
                <p>Log in to see following</p>
            </div>
        )}
            <div className="sidebar-popular">
                <h3>Popular</h3>
                {popularUsers.slice(0, 5).reverse().map((user) => {
                    return(
                    <div key={user.id}>
                        <h4 onClick={() => navigate(`/user/${user.id}`)}>{user.username}</h4>
                    </div>
                    )
                })}
            </div>
            <div className="sidebar-new">
                <h3>New</h3>
                {newUsers.slice(0, 5).map((user) => {
                    return(
                        <div key={user.id}>
                            <h4 onClick={() => navigate(`/user/${user.id}`)}>{user.username}</h4>
                        </div>
                        )
                })}
            </div>
        </div>
    )
}

export default FollowerSideBar;
