// import {apiStarted, apiFinished, apiError} from '~/src/app/redux/actions/common';
import {
    getLoginStatus
} from 'store/selectors/auth';

import { FREELY_ACCESS_PAGES } from 'config/constant';
import { history } from "App.js";

const authenMiddleware = ({
    dispatch,
    getState
}) => next => action => {
    if (action.type === 'persist/REHYDRATE') {
        const isLoggedIn = getLoginStatus(getState());
        if (isLoggedIn) {
            // stay at the same page when trying to access login page if user logged in already
            if (FREELY_ACCESS_PAGES[history.location.pathname]) {
                return false;
            }

            return next(action);
        }

        // if (FREELY_ACCESS_PAGES[history.location.pathname]) {
        //     // return next(action);
        //     history.replace('login');
        //     return false;
        // }

        history.replace('login');
        return false;
    }

    return next(action);
};

export default authenMiddleware;