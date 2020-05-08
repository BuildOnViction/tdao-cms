import { createSelector } from 'reselect'
const geListJobTypes = (state) => state.jobTypes.list;
export const getListJobTypesState = createSelector(
    geListJobTypes,
    (jobType) => jobType
)