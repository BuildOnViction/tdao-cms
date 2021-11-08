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
    admins
} from './admins'

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
    admins,
    ui: combineReducers({
        toast
    })
});