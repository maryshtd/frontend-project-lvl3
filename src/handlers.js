/* eslint-disable no-param-reassign */
import axios from 'axios';
import { string } from 'yup';
import parseFeed from './rssParser.js';

const updateRss = (state) => {
  Promise.all(state.rssLinks.map((link) => {
    axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${link}`)
      .then((response) => {
        const { posts } = parseFeed(response);
        return posts;
      })
      .then((updatedPosts) => {
        const newPosts = updatedPosts.filter((post) => state.posts.includes(post));
        if (newPosts.length > 0) {
          state.posts = [...newPosts, ...state.posts];
        }
      })
      .catch((er) => console.error(er));
    return null;
  }));

  setTimeout(() => updateRss(state), 5000);
};

const handleAddingFeed = (e, state, i18nInstance) => {
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

        state.feeds.push(feed);
        state.posts.push(...posts);

        state.formState = 'loaded';
        state.rssLinks.push(link);

        updateRss(state);
      })
      .catch((err) => {
        if (err.name === 'AxiosError') {
          state.error = i18nInstance.t('errors.networkError');
          state.formState = 'failed';
        } else {
          state.error = i18nInstance.t('errors.invalidRSS');
          state.formState = 'failed';
        }
      });
  }).catch((err) => {
    state.error = err.errors;
    state.formState = 'failed';
  });
};

export default handleAddingFeed;
