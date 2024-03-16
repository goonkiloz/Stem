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
  const navigate = useNavigate()
  const user = useSelector((store) => store?.session?.user);
  const [ currUser, setCurrUser] = useState({})
  const ulRef = useRef();

  const toggleMenu = async (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    dispatch(getCurrentUserThunk())
    .then((res) => {
      if(res?.user?.id !== user?.id) {
        return setCurrUser(res.user)
    }
    })
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
    setCurrUser(null)
    navigate('/')
    dispatch(thunkLogout());
    closeMenu();
  };

  return (

    <>
      <button onClick={toggleMenu}>
        <i className="fas fa-user-circle" />
      </button>
      {/* {user?.username && console.log(user?.username)} */}
      {showMenu && (
        <ul className={"profile-dropdown"} ref={ulRef}>
          {user ? (
            <>
              <div>{currUser?.username}</div>
              <div>
                <button onClick={() => navigate(`/user/${currUser.id}`)}>Profile</button>
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
