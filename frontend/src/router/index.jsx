import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Splash from '../components/Splash';
import FeedPage from '../components/Feed/FeedPage';
import PostDetailPage from '../components/Post/PostDetailPage/PostDetailPage';
import NotFoundPage from '../components/NotFound/NotFoundPage';
import ProfilePage from '../components/Profile/ProfilePage';
import CreatePostPage from '../components/Post/CreatePostPage/CreatePostPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Splash />,
      },
      {
        path: 'feed',
        element: <FeedPage />
      },
      {
        path: 'posts/:postId',
        element: <PostDetailPage />
      },
      {
        path: 'user/:userId',
        element: <ProfilePage />
      },
      {
        path: 'posts/new',
        element: <CreatePostPage />
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ],
  },

]);
