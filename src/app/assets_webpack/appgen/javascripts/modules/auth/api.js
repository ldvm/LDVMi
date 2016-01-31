import rest from '../../misc/rest'

export async function signUp({name, email, password}) {
  return await rest('auth/signup', {name, email, password});
}

export async function signIn({email, password}) {
  return await rest('auth/signin', {email, password});
}

export async function getUser() {
  return (await rest('auth/getUser', {data: "Hello!"})).data;
}
