const { Activity } = require('../shared/database');
const pick = require('lodash/pick');
const processQuery = require('../shared/util/processListQuery');

function create({ body, params, user }, res) {
  const attrs = ['type', 'parentId', 'position', 'data'];
  const data = Object.assign(pick(body, attrs), { courseId: params.courseId });
  const opts = { context: { userId: user.id } };
  return Activity.create(data, opts).then(data => res.json({ data }));
}

function show({ activity }, res) {
  return res.json({ data: activity });
}

function patch({ activity, body, user }, res) {
  return activity.update(body, { context: { userId: user.id } })
    .then(data => res.json({ data }));
}

function list({ course, query }, res) {
  const opts = processQuery(query.integration ? query : { sortBy: 'position' });
  if (!query.detached) opts.where.$and = [{ detached: false }];
  return course.getActivities(opts).then(data => res.json({ data }));
}

function remove({ activity, user }, res) {
  const options = { recursive: true, soft: true, context: { userId: user.id } };
  return activity.remove(options)
    .then(data => res.json({ data: pick(data, ['id']) }));
}

function reorder({ activity, body }, res) {
  return activity.reorder(body.position).then(data => res.json({ data }));
}

function publish({ activity }, res) {
  return activity.publish().then(data => res.json({ data }));
}

module.exports = {
  create,
  show,
  list,
  patch,
  remove,
  reorder,
  publish
};
