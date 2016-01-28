import request from 'reqwest'
import when from 'when'

export async function signUp({name, email, password}) {
  const response = await when(request({
    url: '/appgen/api/auth/signup',
    method: 'POST',
    crossOrigin: true,
    type: 'json',
    contentType: 'application/json',
    data: JSON.stringify({name, email, password})
  }));
  if (response.status !== 200) throw response;
  return response.json();
}

