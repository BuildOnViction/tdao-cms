export const requestStatus = state => state.common.requests;

export const getToast = state => state.ui.toast;

export const getRequest = (state, key) => state.requests[key] || {};

export const getLastRoute = state => state.common.lastRoute;
