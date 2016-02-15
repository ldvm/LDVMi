import { Record } from 'immutable';

export const DataSource = Record({
  id: 0,
  name: "",
  isPublic: false,
  userId: 0,
  dataSourceTemplateId: 0,
  selected: false
});

