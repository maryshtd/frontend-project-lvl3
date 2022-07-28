/* eslint-disable no-param-reassign */
import axios from 'axios';
import { string } from 'yup';
import _ from 'lodash';
import parseFeed from './rssParser.js';

const generateId = (item) => {
  item.id = _.uniqueId();
};

export const updateRss = (state) => {
  Promise.all(state.rssLinks.map((link) => {
    axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${link}`)
      .then((response) => {
        const { posts } = parseFeed(response);
        const allPosts = _.union(posts, state.posts);
        const newPosts = _.differenceBy(allPosts, state.posts, 'link');
        newPosts.forEach((post) => generateId(post));

        if (newPosts.length > 0) {
          state.posts = [...newPosts, ...state.posts];
        }
      })
      .catch((er) => console.error(er));
    return null;
  })).finally(() => {
    setTimeout(() => updateRss(state), 5000);
  });
};

const handleAddingFeed = (e, state) => {
  e.preventDefault();
  state.formState = 'loading';
  const formData = new FormData(e.target);
  const link = formData.get('url').trim();

  const rssSchema = string()
    .url()
    .notOneOf(state.rssLinks)
    .matches(/[a-z].rss/);

  rssSchema.validate(link).then(() => {
    axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${link}`)
      .then((response) => {
        const { feed, posts } = parseFeed(response);

        generateId(feed);
        posts.forEach((post) => generateId(post));

        state.feeds.push(feed);
        state.posts.push(...posts);

        state.formState = 'loaded';
        state.rssLinks.push(link);
      })
      .catch((err) => {
        if (err.name === 'AxiosError') {
          state.error = 'errors.networkError';
          state.formState = 'failed';
        } else {
          state.error = 'errors.invalidRSS';
          state.formState = 'failed';
        }
      });
  }).catch((err) => {
    state.error = err.errors;
    state.formState = 'failed';
  });
};

export default handleAddingFeed;
