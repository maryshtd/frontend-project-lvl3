/* eslint-disable no-param-reassign */
import axios from 'axios';
import { string } from 'yup';
import parseFeed from './rssParser.js';

const handleAddingFeed = (e, state) => {
  e.preventDefault();
  state.formState = 'loading';
  const formData = new FormData(e.target);
  const link = formData.get('url').trim();

  const rssSchema = string()
    .url('Link should be valid URL')
    .notOneOf(state.rssLinks, 'RSS already exists')
    .matches(/[a-z].rss/, 'Resource does not contain valid RSS');

  rssSchema.validate(link).then(() => {
    axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${link}`)
      .then((response) => {
        const domparser = new DOMParser();
        const xmlFeed = domparser.parseFromString(response.data.contents, 'text/xml');
        const { feed, posts } = parseFeed(xmlFeed);

        state.feeds.push(feed);
        posts.forEach((item) => state.posts.push(item));

        state.formState = 'loaded';
        state.rssLinks.push(link);
      })
      .catch(() => {
        state.error = 'Network error';
        state.formState = 'failed';
      });
  }).catch((err) => {
    state.error = err.errors;
    state.formState = 'failed';
  });
};

export default handleAddingFeed;
