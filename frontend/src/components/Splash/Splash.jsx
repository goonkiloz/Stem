import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getPostsThunk } from '../../redux/posts';
import './Splash.css'
import VideoPlayer from '../VideoPlayer/VideoPlayerComponent';
import SignupFormModal from "../Signup/SignupFormModal";
import OpenModalButton from '../Global/OpenModalButton/OpenModalButtton';

const Splash = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getPostsThunk())
  }, [dispatch])


  return (
    <div className='splash-page'>
      <div className='splash-page-head'>
        <img className='splash-page-backdrop' src='../../backdrop.jpg'/>
        <span className='splash-page-span'>
          Welcome to Stem! Look around and have a laugh!
        </span>
        <div className='video-player' >
          <VideoPlayer />
        </div>
      </div>
      <div className='splash-bottom'>
        <h2 className='splash-bottom-text'>Join the community today!</h2>
        <div className="splash-join-button">
          <OpenModalButton
            buttonText="Join!"
            modalComponent={<SignupFormModal />}
          />
        </div>
      </div>
    </div>
  );
}

export default Splash;
