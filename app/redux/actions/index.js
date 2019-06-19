import * as types from './types';

export const loadingStart = () => ({
  type: types.LOADING_START
});

export const loadingEnd = err => ({
  type: types.LOADING_END,
  err,
});
