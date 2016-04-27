import rest from '../../misc/rest'

export async function signUp({ name, email, password }) {
  return await rest('auth/signUp', {name, email, password});
}

export async function signIn({ email, password }) {
  return (await rest('auth/signIn', {email, password})).data;
}

export async function googleSignIn({ token }) {
  return (await rest('auth/googleSignIn', { token })).data;
}

export async function getUser() {
  return (await rest('auth/getUser', {data: "Hello!"})).data;
}

export async function signOut() {
  return (await rest('auth/signOut', {})).data;
}
