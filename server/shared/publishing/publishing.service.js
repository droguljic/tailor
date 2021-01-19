'use strict';

const {
  publishActivity,
  publishRepositoryDetails,
  unpublishActivity,
  updatePublishingStatus,
  updateRepositoryCatalog
} = require('./helpers');
const oauthClient = require('./oauthClient');
const PromiseQueue = require('promise-queue');

class PublishingService {
  constructor() {
    this.queue = new PromiseQueue(1, Infinity);
  }

  publishActivity(activity) {
    const publish = () => publishActivity(activity)
      .then(data => oauthClient.send(data) && data);
    return this.queue.add(publish);
  }

  publishRepoDetails(repository) {
    return this.queue.add(() => publishRepositoryDetails(repository));
  }

  unpublishActivity(repository, activity) {
    return this.queue.add(() => unpublishActivity(repository, activity));
  }

  updateRepositoryCatalog(repository) {
    return this.queue.add(() => updateRepositoryCatalog(repository));
  }

  updatePublishingStatus(repository, activity) {
    return this.queue.add(() => updatePublishingStatus(repository, activity));
  }
}

module.exports = new PublishingService();
