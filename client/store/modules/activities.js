import calculatePosition from 'utils/calculatePosition.js';
import filter from 'lodash/filter';
import find from 'lodash/find';
import {
  getDescendants as getDeepChildren,
  getAncestors as getParents
} from 'utils/activity.js';
import map from 'lodash/map';
import { OBJECTIVES } from 'shared/activities';
import VuexCollection from '../helpers/collection.js';

const { getter, action, mutation, build } = new VuexCollection('activities');

getter(function activities() {
  return this.state.items;
}, { global: true });

getter(function getParent() {
  return activityId => {
    const activity = find(this.state.items, { id: activityId });
    return activity ? find(this.state.items, { id: activity.parentId }) : null;
  };
});

getter(function getDescendants() {
  return activity => getDeepChildren(this.state.items, activity);
});

getter(function getAncestors() {
  return activity => getParents(this.state.items, activity);
});

getter(function getLineage() {
  return activity => {
    const ancestors = getParents(this.state.items, activity);
    const descendants = getDeepChildren(this.state.items, activity);
    return [...ancestors, ...descendants];
  };
});

getter(function getExamObjectives() {
  const getObjectives = activity => {
    let children = getDeepChildren(this.state.items, activity);
    return filter(children, it => map(OBJECTIVES, 'type').includes(it.type));
  };

  return exam => getObjectives(find(this.state.items, { id: exam.parentId }));
});

action(function reorder({ activity, context }) {
  this.commit('reorder', { activity, position: calculatePosition(context) });
  const data = { position: context.newPosition };
  return this.api.post(`${activity.id}/reorder`, data)
    .then(res => {
      let activity = res.data.data;
      this.api.setCid(activity);
      this.commit('save', activity);
    });
});

mutation(function reorder({ activity, position }) {
  activity.position = position;
});

export default build();
