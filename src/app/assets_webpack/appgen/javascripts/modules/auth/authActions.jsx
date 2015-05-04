import {dispatch} from '../../libs/dispatcher.jsx'

class AuthActions {
    AUTH_IN_PROGRESS(inProgress)  {
        dispatch(this.AUTH_IN_PROGRESS, {inProgress});
    }
}

export default new AuthActions();