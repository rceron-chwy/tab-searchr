import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../../redux/reducers';
// import { storageMiddleware } from '../middleware/storage';


const middlewares = applyMiddleware(thunk);
const enhancer = compose(
  middlewares,
  // storage()
);

export default function (initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
