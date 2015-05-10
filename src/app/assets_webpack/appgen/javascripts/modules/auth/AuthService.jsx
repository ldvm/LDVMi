import request from 'reqwest'
import when from 'when'
import actions from './AuthActions.jsx'

class AuthService {

    signUp({name, email, password}) {
        actions.AUTH_IN_PROGRESS(true);
        when(request({
            url: '/appgen/api/auth/signup',
            method: 'POST',
            crossOrigin: true,
            type: 'json',
            contentType: 'application/json',
            data: JSON.stringify({name, email, password})
        }))
            .then(response => {
                console.log(response.id);
                actions.AUTH_IN_PROGRESS(false);
                return true;
            });
    }

}

export default new AuthService();