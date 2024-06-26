import { getUserPostsThunk } from "./posts";

const GET_CURRENT_USER = 'users/getCurrentUser'
const GET_USERS = "users/getAll";
const GET_SINGLE_USER = "users/getSingleUser";

const getCurrentUser = (user) => {
    return {
        type: GET_CURRENT_USER,
        payload: user
    }
}

const getUsers = (users) => {
    return {
        type: GET_USERS,
        payload: users
    }
};

const getSingleUser = (userId) => {
    return {
        type: GET_SINGLE_USER,
        payload: userId
    }
};

export const getCurrentUserThunk = () => async (dispatch) => {
    const res = await fetch('/api/users');
    const data = await res.json()
    dispatch(getCurrentUser(data))
    return data
}

export const getUsersThunk = () => async (dispatch) => {
    const res = await fetch("/api/users/all");
    const data = await res.json();
    dispatch(getUsers(data))
};

export const getSingleUserThunk = (userId) => async (dispatch) => {
    const res = await fetch(`/api/users/${userId}`);
    const data = await res.json();
    dispatch(getSingleUser(data))
    dispatch(getUserPostsThunk(userId))
};

const initialState = { allUsers: [], byId: {}, currentUser: {}};

const userReducer = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case GET_CURRENT_USER: {
            let currentUser = action.payload
            newState.currentUser = currentUser;
            return newState;
        }
        case GET_USERS: {
            let users = [ ...newState.allUsers]
            users = action.payload
            newState.allUsers = users
            action.payload.forEach(user => {
                newState.byId[user.id] = user;
            })
            return newState
        }
        case GET_SINGLE_USER: {
            let user = action.payload
            newState.byId[action.payload.id] = user
            return newState;
        }
        default:
            return state;
    }
}

export default userReducer;
