import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
// import { useSelector } from "react-redux";
import { useState } from "react";

function Navigation() {

  // const currentUser = useSelector(state => state.session.user)
  const [search, setSearch] = useState('')

  const fetchData = (value) => {
    return value
  }

  const handleChange = (value) => {
    setSearch(value)
    fetchData(value)
  }

    const handleOnClick = (e) => {
    e.preventDefault();
    alert(`Feature to come later!`)
  }

  return(
  <div className="page-container">
    <div className="navbar-container">
    <NavLink>
      <img className="navbar-logo" src="../favicon-32x32.png" alt="Home"/>
    </NavLink>

    <NavLink className='navbar-feed' to='/feed'>
      Feed
    </NavLink>

    <NavLink className='navbar-post' to='/posts/new'>
      New Post
    </NavLink>

    <form className="navbar-search">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => handleChange(e?.target?.value)}
      />
      <button
        type="submit"
        onClick={handleOnClick}
      >
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </form>

    <div className="navbar-profile-container">
      {/* {currentUser &&
      // <div className="nav-username">{currentUser.username}</div>
      } */}
      <ProfileButton className='navbar-profile'/>
    </div>
    </div>
  </div>
  )
}

export default Navigation;
