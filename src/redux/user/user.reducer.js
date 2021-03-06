import { UserActionTypes } from "./user.types";

const INITIAL_STATE = {
  currentUser: null,
  allUsers: [],
  selectedUser: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };

    case UserActionTypes.LIST_ALL_USERS:
      return {
        ...state,
        allUsers: action.payload,
      };

    case UserActionTypes.SET_SELECTED_USER:
      return {
        ...state,
        selectedUser: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
