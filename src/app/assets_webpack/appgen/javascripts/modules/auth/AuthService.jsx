import actions from './AuthActions.jsx'

class AuthService {

    signUp({name, email, password}) {
        actions.AUTH_IN_PROGRESS(true);
        setTimeout(() => {
            actions.AUTH_IN_PROGRESS(false);
        }, 1000);
    }

}

export default new AuthService();