import { Record } from 'immutable'

export const User = Record({
  id: 0,
  name: 'Anonymous user',
  email: ''
});

User.prototype.isSignedIn = function() {
  return this.id != 0;
};
