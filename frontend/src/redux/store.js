import {
    legacy_createStore as createStore,
    applyMiddleware,
    compose,
    combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import userReducer from "./users";
import postsReducer from "./posts";
import commentsReducer from "./comments";
import likesReducer from "./likes";
import followersReducer from "./followers";

const rootReducer = combineReducers({
    session: sessionReducer,
    users: userReducer,
    posts: postsReducer,
    comments: commentsReducer,
    likes: likesReducer,
    followers: followersReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
    enhancer = applyMiddleware(thunk);
} else {
    const logger = (await import("redux-logger")).default;
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
