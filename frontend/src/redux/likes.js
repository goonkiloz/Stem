import { csrfFetch } from "./csrf";

const GET_ALL_LIKES = 'likes/GET_ALL_LIKES'
const GET_ALL_LIKES_BY_POST = "likes/GET_ALL_LIKES_BY_POST";
const POST_LIKE = "likes/POST_LIKE";
const REMOVE_LIKE = "likes/REMOVE_LIKE";
const GET_ALL_DISLIKES = 'likes/GET_ALL_DISLIKES'
const GET_ALL_DISLIKES_BY_POST = "likes/GET_ALL_DISLIKES_BY_POST";
const POST_DISLIKE = "likes/POST_DISLIKE";
const REMOVE_DISLIKE = "likes/REMOVE_DISLIKE";

const allLikes =(likes) => {
  return {
    type: GET_ALL_LIKES,
    payload: likes
  }
}

const loadLike = (likes) => {
  return {
    type: GET_ALL_LIKES_BY_POST,
    payload: likes,
  };
};

const addLike = (like) => {
  return {
    type: POST_LIKE,
    payload: like,
  };
};

const removeLike = (likeId) => {
  return {
    type: REMOVE_LIKE,
    payload: likeId,
  };
};

const allDislikes =(dislikes) => {
  return {
    type: GET_ALL_DISLIKES,
    payload: dislikes
  }
}

const loadDislike = (dislikes) => {
    return {
      type: GET_ALL_DISLIKES_BY_POST,
      payload: dislikes,
    };
  };

  const addDislike = (dislike) => {
    return {
      type: POST_DISLIKE,
      payload: dislike,
    };
  };

  const removeDislike = (dislikeId) => {
    return {
      type: REMOVE_DISLIKE,
      payload: dislikeId,
    };
  };

export const getAllLikesThunk = () => async(dispatch) =>{
  const res = await fetch(`/api/likes/`)

  if(res.ok) {
    const data = await res.json()
    dispatch(allLikes(data))
    return data;
  }
}

//thunk action to fetch all likes
export const getLikesThunk = (postId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/posts/${postId}/likes`);

    if (res.ok) {
      const data = await res.json()
      dispatch(loadLike(data.Likes));
      return data;
    }
    throw res;
  } catch (e) {
    return e;
  }
};

//thunk action to add like to a post
export const postLikeThunk = (postId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/posts/${postId}/likes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(addLike(data));
      dispatch(getLikesThunk(postId));
      return data;
    }
    throw res;
  } catch (e) {
    return e;
  }
};

//thunk action to remove like to a post
export const removeLikeThunk = (likeId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/likes/${likeId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      const data = await res.json();
      dispatch(removeLike(likeId));
      return data;
    }
    throw res;
  } catch (e) {
    return e;
  }
};

export const getAllDislikesThunk = () => async(dispatch) =>{
  const res = await fetch(`/api/likes/dislikes`)

  if(res.ok) {
    const data = await res.json()
    dispatch(allDislikes(data))
    return data;
  }
}

//thunk action to fetch all dislikes
export const getDislikesThunk = (postId) => async (dispatch) => {
    try {
      const res = await fetch(`/api/posts/${postId}/dislikes`);

      if (res.ok) {
        const data = await res.json();
        dispatch(loadDislike(data.Dislikes));
        return data;
      }
      throw res;
    } catch (e) {
      return e;
    }
  };

  //thunk action to add dislike to a post
  export const postDislikeThunk = (postId) => async (dispatch) => {
    try {
      const res = await csrfFetch(`/api/posts/${postId}/dislikes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(addDislike(data));
        dispatch(getDislikesThunk(postId));
        return data;
      }
      throw res;
    } catch (e) {
      return e;
    }
  };

  //thunk action to remove dislike to a post
  export const removeDislikeThunk = (dislikeId) => async (dispatch) => {
    try {
      const res = await csrfFetch(`/api/likes/dislikes/${dislikeId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        dispatch(removeDislike(dislikeId));
        return data;
      }
      throw res;
    } catch (e) {
      return e;
    }
  };


const initialState = { allLikes: [], likesByPostId: {}, allDislikes: [], dislikesByPostId: {} };

//create likes reducers to process actions
const likesReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_ALL_LIKES:
        newState = { ...state }
        newState.allLikes = action.payload;
        return newState;
    case GET_ALL_DISLIKES:
        newState = { ...state }
        newState.allDislikes = action.payload;
        return newState;
    case GET_ALL_LIKES_BY_POST:
        newState = { ...state }
        newState.allLikes = action.payload;
        action.payload.forEach((like) => {
            newState.likesByPostId[like.postId] = like;
        });
        return newState;
    case POST_LIKE:
        newState = { ...state }
        newState.allLikes.push(action.payload);
        newState.likesByPostId[action.payload.id] = action.payload;
        return newState;

    case REMOVE_LIKE:
        newState = { ...state }
        newState.allLikes = newState.allLikes.filter(
            like => like.id !== action.payload
        );
        delete newState.likesByPostId[action.payload];
        return newState;

    case GET_ALL_DISLIKES_BY_POST:
        newState = { ...state }
        newState.allDislikes = action.payload;
        action.payload.forEach((dislike) => {
            newState.dislikesByPostId[dislike.id] = dislike;
        });
        return newState;

      case POST_DISLIKE:
        newState = { ...state }
        newState.allDislikes.push(action.payload);
        newState.dislikesByPostId[action.payload.id] = action.payload;
        return newState;

      case REMOVE_DISLIKE:
        newState = { ...state }
        newState.allDislikes = newState.allDislikes.filter(
          dislike => dislike.id !== action.payload
        );
        delete newState.dislikesByPostId[action.payload];
        return newState;

    default:
      return state;
  }
};

export default likesReducer;
