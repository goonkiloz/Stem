import { csrfFetch } from "./csrf";

const GET_CURRENT_USER_FOLLOWERS = 'followers/GET_CURRENT_USER_FOLLOWERS'
const GET_CURRENT_USER_FOLLOWING = 'followers/GET_CURRENT_USER_FOLLOWING'
const GET_ALL_USER_FOLLOWERS = 'followers/GET_ALL_USER_FOLLOWERS';
const GET_ALL_USER_FOLLOWING = 'followers/GET_ALL_USER_FOLLOWING';
const POST_FOLLOWER = 'followers/POST_FOLLOWER';
const REMOVE_FOLLOWER = 'followers/REMOVE_FOLLOWER';

const currentFollowers = (followers) => {
  return {
    type: GET_CURRENT_USER_FOLLOWERS,
    payload: followers
  }
}

const currentFollowing = (followers) => {
  return {
    type: GET_CURRENT_USER_FOLLOWING,
    payload: followers
  }
}

const loadFollowers = (followers) => {
    return {
        type: GET_ALL_USER_FOLLOWERS,
        payload: followers
    };
};

const loadFollowing = (followers) => {
    return {
        type: GET_ALL_USER_FOLLOWING,
        payload: followers
    };
};

const addFollower = (follower) => {
    return {
        type: POST_FOLLOWER,
        payload: follower
    };
};

const removeFollower = (followerId) => {
    return {
        type: REMOVE_FOLLOWER,
        payload: followerId
    };
};

export const currentFollowersThunk = () => async (dispatch) => {
  const res = await fetch(`/api/followers/current/followers`);

  if(res.ok) {
    const data = await res.json()
    dispatch(currentFollowers(data))
    return data
  }
  throw res
}

export const currentFollowingThunk = () => async (dispatch) => {
  const res = await fetch(`/api/followers/current/following`);

  if(res.ok) {
    const data = await res.json()
    dispatch(currentFollowing(data))
    return data
  }
  throw res
}

export const getFollowersThunk = (userId) => async (dispatch) => {
    try {
      const res = await fetch(`/api/users/${userId}/followers`);

      if (res.ok) {
        const data = await res.json();
        dispatch(loadFollowers(data));
        return data;
      }
      throw res;
    } catch (e) {
      return e;
    }
  };

export const getFollowingThunk = (userId) => async (dispatch) => {
    try {
      const res = await fetch(`/api/users/${userId}/following`);

      if (res.ok) {
        const data = await res.json();
        dispatch(loadFollowing(data));
        return data;
      }
      throw res;
    } catch (e) {
      return e;
    }
  };

export const postFollowerThunk = (userId) => async (dispatch) => {
    try {
      const res = await csrfFetch(`/api/users/${userId}/follower`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(addFollower(data));
        return data;
      }
      throw res;
    } catch (e) {
      return e;
    }
  };

export const removeFollowerThunk = (followerId) => async (dispatch) => {
    try {
        const res = await csrfFetch(`/api/followers/${followerId}`, {
            method: "DELETE",
        });

        if (res.ok) {
            const data = await res.json();
            dispatch(removeFollower(followerId));
            return data;
        }
        throw res;
    } catch (e) {
        return e;
    }
};

const initialState = { followers: [], following: [], followersById: {}, followingById: {}, currentUserFollowers: [], currentUserFollowing: [] };

const followersReducer = (state = initialState, action) => {
  const newState = { ...state };
  switch (action.type) {
    case GET_CURRENT_USER_FOLLOWERS:
      newState.currentUserFollowers = action.payload;
      return newState;
    case GET_CURRENT_USER_FOLLOWING:
      newState.currentUserFollowing = action.payload;
      return newState;
    case GET_ALL_USER_FOLLOWERS:
        newState.followers = action.payload;
        return newState;
    case GET_ALL_USER_FOLLOWING:
        newState.following = action.payload;
        action.payload.forEach((follower) => {
            newState.followingById[follower.id] = follower;
        })
        return newState;
    case POST_FOLLOWER:
        newState.followers.push(action.payload);
        return newState;

    case REMOVE_FOLLOWER:
        newState.followers = newState.followers.filter(
            follower => follower.id !== action.payload
        );
        delete newState.followersById[action.payload];
        return newState;
    default:
      return state;
  }
};

export default followersReducer;
