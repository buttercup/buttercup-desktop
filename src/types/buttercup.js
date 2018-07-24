// @flow
export type EntryFacadeField = {
  title: string,
  field: 'property' | 'attribute',
  property: string,
  value: string,
  secret: boolean,
  multiline: boolean,
  formatting: boolean | any,
  removeable: boolean
};

export type EntryFacade = {
  type: string,
  fields: EntryFacadeField[]
};

export type Entry = {
  id: string,
  facade: EntryFacade,
  icon?: string,
  isInTrash: boolean
};
