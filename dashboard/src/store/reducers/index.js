import {
    combineReducers
} from 'redux';
import { routerReducer as routing } from "react-router-redux";
import {
    requests,
    toast,
    lastRoute
} from './common';
import {
    auth
} from './auth';
import {
    acl
} from './acl';
import {
    settings
} from './settings';
import {
    jwt
} from './jwt';
import {
    jobs
} from './jobs';
import {
    brokers
} from './broker'
import {
    jobTypes
} from './jobTypes'
import {
    admins
} from './admins'
import {
    companies
} from './companies'
import {
    users
} from './users'
// import {
//     router
// } from 'redux-ui-router';

// a rootReducer is like a single state, key is function return a sub state value
export default combineReducers({
    persist: combineReducers({
        routing,
        auth,
        acl,
        settings
    }),
    common: combineReducers({
        requests,
        lastRoute
    }),
    jwt,
    companies,
    jobs,
    brokers,
    admins,
    jobTypes,
    users,
    ui: combineReducers({
        toast
    })
});