import { normalize, denormalize, schema } from 'normalizr';

const group = new schema.Entity('groups');
const groups = new schema.Array(group);
group.define({ groups });

export function normalizeGroups(payload) {
  return normalize(payload, groups);
}

export function denormalizeGroups(shownIds, allIds) {
  return denormalize(shownIds, groups, { groups: allIds });
}
