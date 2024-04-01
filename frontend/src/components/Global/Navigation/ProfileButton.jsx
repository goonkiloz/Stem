import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../../Login/LoginFormModal";
import SignupFormModal from "../../Signup/SignupFormModal";
import './ProfileButton.css'
import { useNavigate } from "react-router-dom";
import { getCurrentUserThunk } from "../../../redux/users";


function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [currentUser, setCurrentUser ] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)
  const navigate = useNavigate()
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = async (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if(!user && user !== null) {
      dispatch(getCurrentUserThunk())
      setCurrentUser(user)
    } else if(user === null) {
      setCurrentUser(null)
    } else {
      setCurrentUser(user)
    }
  }, [dispatch, user])


  useEffect(() => {
    if (!showMenu) return

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu, dispatch]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    navigate('/')
    dispatch(thunkLogout());
    closeMenu();
  };

  useEffect(() => {
    if(currentUser === null) {
      setIsLoaded(true)
    } else if(currentUser !== null && currentUser.username) {
      setIsLoaded(true)
    }
  }, [currentUser])

  console.log(currentUser)

  return (

    <>
      <button onClick={toggleMenu}>
        <i className="fas fa-user-circle" />
      </button>

      {showMenu && isLoaded && (
        <ul className={"profile-dropdown"} ref={ulRef}>
          {currentUser ? (
            <>
              <div>{currentUser.username}</div>
              <div>
                <button onClick={() => navigate(`/user/${currentUser?.id}`)}>Profile</button>
              </div>
              <div>
                <button onClick={logout}>Log Out</button>
              </div>
            </>
          ) : (
            <>
            <div>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </div>
            <div>
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </div>
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
