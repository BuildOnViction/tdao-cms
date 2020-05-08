export const getWaitingApis = state => state.jwt.waitingApisBuffer;
export const requestingNewToken = state => state.jwt.isRefreshingToken;