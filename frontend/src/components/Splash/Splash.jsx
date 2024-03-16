import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getPostsThunk } from '../../redux/posts';
import './Splash.css'
import VideoPlayer from '../VideoPlayer/VideoPlayerComponent';

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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
          voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
          voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
          voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </span>
        <div className='video-player' >
          <VideoPlayer />
        </div>
      </div>
      <div className='splash-bottom'>
        <h2 className='splash-bottom-text'>Join the community today!</h2>
        <button
          className='splash-join-button'
        >Join</button>
      </div>
    </div>
  );
}

export default Splash;
