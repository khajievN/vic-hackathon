import { combineReducers } from "redux"
import loader from "./loader/reducer"

const allReducers = combineReducers({

	loader,
})

export const rootReducer = (state, action) => {
	// when a logout action is dispatched it will reset redux state
	if (action.type === 'USER_LOGGED_OUT') {
		state = undefined;
	}

	return allReducers(state, action);
};

export default rootReducer
