const namespace = 'RFC';
const createAction = action => `@${namespace}/${action}`;

export const LOADING_START = createAction('LOADING_START');
export const LOADING_END = createAction('LOADING_END');
