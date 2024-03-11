import { csrfFetch } from "./csrf";

const GET_ALL_COMMENTS_BY_POST_ID = "comments/GET_ALL_COMMENTS_BY_POST_ID";
const POST_COMMENT = "comments/POST_COMMENT";
const EDIT_COMMENT = "comments/EDIT_Comment";
const REMOVE_COMMENT = "comments/REMOVE_COMMENT";


const loadComments = (comments) => {
  return {
    type: GET_ALL_COMMENTS_BY_POST_ID,
    payload: comments,
  };
};

const addComment = (comment) => {
  return {
    type: POST_COMMENT,
    payload: comment,
  };
};

const editComment = (postId, comment) => {
  return {
    type: EDIT_COMMENT,
    payload: { postId, comment },
  };
};

const removeComment = (commentId) => {
  return {
    type: REMOVE_COMMENT,
    payload: commentId,
  };
};


export const getCommentsThunk = (postId) => async (dispatch) => {

    const res = await fetch(`/api/posts/${postId}/comments`);

    if (res.ok) {
      const data = await res.json();
      dispatch(loadComments(data.Comments));
      return data;
    }
    throw res;
};

export const postCommentThunk = (comment, postId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comment: comment.comment,
        user_id: comment.userId,
        post_id: comment.postId,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(addComment(data));
      dispatch(getCommentsThunk(postId));
      return data;
    }
    throw res;
  } catch (e) {
    const data = await e.json()
    return data;
  }
};

export const editCommentThunk =
  (comment, commentId, postId) => async (dispatch) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment_text: comment.commentText,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(editComment(data));
        dispatch(getCommentsThunk(postId));
        return data;
      }
      throw res;
    } catch (e) {
      const data = await e.json()
      return data;
    }
  };

export const deleteCommentThunk = (commentId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(removeComment(commentId));
      return data;
    }
    throw res;
  } catch (e) {
    const data = await e.json()
    return data;
  }
};

const initialState = { allComments: [], byId: {} };

const commentsReducer = (state = initialState, action) => {
  const newState = { ...state };
  switch (action.type) {
    case GET_ALL_COMMENTS_BY_POST_ID:
      newState.allComments = action.payload;
      action.payload.forEach((comment) => {
        newState.byId[comment.id] = comment;
      });
      return newState;

    case POST_COMMENT:
      newState.allComments.push(action.payload);
      newState.byId[action.payload.id] = action.payload;
      return newState;

    case EDIT_COMMENT: {
      const index = newState.allComments.findIndex(
        (comment) => comment.id === action.payload.id
      );
      newState.allComments[index] = action.payload;
      newState.byId[action.payload.id] = action.payload;
      return newState;
    }

    case REMOVE_COMMENT:
      newState.allComments = newState.allComments.filter(
        (comment) => comment.id !== action.payload
      );
      delete newState.byId[action.payload];
      return newState;
    default:
      return state;
  }
};

export default commentsReducer;
