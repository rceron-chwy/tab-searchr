import { combineReducers } from 'redux';
import * as ActionTypes from '../actions/types';

export const app = (state = initialState, action) => {
  const fn = actionsMap[action.type];
  if (!fn) return state;
  return fn(state, action);
};

const initialState = {
  loading: false,
};

const actionsMap = {
  [ActionTypes.LOADING_START](state) {
    return {
      ...state,
      loading: true
    };
  },

  [ActionTypes.LOADING_END](state, action) {
    return {
      ...state,
      loading: false,
      err: action.err,
    };
  }
};


export default combineReducers({
  app,
});
