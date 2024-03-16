import { csrfFetch } from "./csrf";
import Cookies from "js-cookie";

const GET_ALL_POSTS = "posts/getPosts";
const GET_SINGLE_POST = "posts/getSinglePost";
const GET_CURRENT_USER_POSTS = "posts/getCurrentUser";
const GET_USER_POSTS = "posts/getUserPosts";
const PUT_POST = "posts/putPost";
const POST_POST = "posts/post";
const DELETE_POST = "posts/delete";

const getPosts = (posts) => {
  return {
    type: GET_ALL_POSTS,
    payload: posts,
  };
};

const getSinglePost = (postId) => {
  return {
    type: GET_SINGLE_POST,
    payload: postId,
  };
};

const getCurrentUserPosts = (posts) => {
  return {
    type: GET_CURRENT_USER_POSTS,
    payload: posts,
  };
};

const getUserPosts = (userId) => {
  return {
    type: GET_USER_POSTS,
    payload: userId
  }
}

const putPost = (postId) => {
  return {
    type: PUT_POST,
    payload: postId,
  };
};

const postPost = (post) => {
  return {
    type: POST_POST,
    payload: post,
  };
};

const deletePost = (postId) => {
  return {
    type: DELETE_POST,
    payload: postId,
  };
};

export const getPostsThunk = () => async (dispatch) => {
  const res = await fetch("/api/posts");
  const data = await res.json();
  dispatch(getPosts(data));
  return data;
};

export const getSinglePostThunk = (postId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/posts/${postId}`)

    if (!res.ok) {
      return res
    }
    const data = await res.json()
    dispatch(getSinglePost(data))
    return res
  } catch (e) {
    return e;
  }
};

export const getCurrentUserPostsThunk = () => async (dispatch) => {
  try {
    const res = await fetch("/api/posts/current");

    if (res.ok) {
      const data = await res.json();
      dispatch(getCurrentUserPosts(data));
      return data;
    }
    throw res;
  } catch (e) {
    const data = await e.json();
    return data;
  }
};

export const getUserPostsThunk = (userId) => async (dispatch) => {
  const res = await fetch(`/api/users/${userId}/posts`);

  if (res.ok) {
    const data = await res.json();
    console.log(data)
    dispatch(getUserPosts(data));
    return data;
  }
  throw res;

};

export const postPostThunk = (post) => async (dispatch) => {

    const options = {
      method: 'POST',
      headers: {},
      body: post
    }

    options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN')

    const res = await fetch("/api/posts/", options)

    if (res.ok) {
        const data = res.json();
        dispatch(postPost(data));
        return data;
    } else {
      const err = await res.json();
      return err;
  }
};

export const putPostThunk = (post, postId) => async (dispatch) => {
    const res = await csrfFetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: {},
      body: JSON.stringify({
        title: post.title,
        description: post.description
      }),
    });

    if (res.ok) {
      const data = await res.json();
      dispatch(putPost(data));
      dispatch(getCurrentUserPostsThunk());
      dispatch(getPostsThunk());
      return data;
    } else {
      const err = await res.json();
      return err;
    }
};

export const deletePostThunk = (postId) => async (dispatch) => {
    const res = await csrfFetch(`/api/posts/${postId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(deletePost(postId));
      dispatch(getCurrentUserPostsThunk())
      dispatch(getPostsThunk());
      return data;
    } else {
    const err = await res.json();
    return err;
  }
};

const initialState = { allPosts: [], byId: {}, currentUserPosts: [], userPosts: []};

const postsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_ALL_POSTS:
      newState = { ...state }
      newState.allPosts = action.payload;
      action.payload.forEach((post) => {
        newState.byId[post.id] = post;
      });
      return newState;
    case GET_SINGLE_POST:
      newState = { ...state }
      newState.byId[action.payload.id] = action.payload;
      return newState;
    case GET_CURRENT_USER_POSTS:
      newState = { ...state }
      newState.currentUserPosts = action.payload;
      action.payload.forEach((post) => {
        newState.byId[post.id] = post;
      });
      return newState;
    case GET_USER_POSTS:
      newState = { ...state }
      newState.userPosts = action.payload;
      return newState;
    case PUT_POST: {
      newState = { ...state }
      const index = newState.allPosts.findIndex(
        (post) => post.id === action.payload.id
      );
      newState.allPosts[index] = action.payload;
      newState.byId[action.payload.id] = action.payload;
      return newState;
    }
    case POST_POST:
      newState = { ...state }
      newState.allPosts.push(action.payload);
      newState.byId[action.payload.id] = action.payload;
      return newState;
    case DELETE_POST:
      newState = { ...state }
      newState.allPosts = newState.allPosts.filter(
        (post) => post.id !== action.payload.postId
      );
      delete newState.byId[action.payload];
      return newState;
    default:
      return state;
  }
};

export default postsReducer;
