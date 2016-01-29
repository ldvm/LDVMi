import rest from '../../misc/rest'

export async function signUp({name, email, password}) {
  return await rest('auth/signup', {name, email, password});
}

