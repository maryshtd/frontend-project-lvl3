import { uniqueId } from 'lodash';

const parseFeed = (xmlData) => {
  // get title
  const feedTitle = xmlData.getElementsByTagName('title')[0].textContent;
  // get description
  const feedDescription = xmlData.getElementsByTagName('description')[0].textContent;
  // create feed obj with title and description
  const feed = { id: uniqueId(), title: feedTitle, description: feedDescription };
  // get posts from feed
  const posts = [];
  Array.from(xmlData.getElementsByTagName('item')).forEach((item) => posts.push({
    feedId: feed.id,
    id: uniqueId(),
    title: item.getElementsByTagName('title')[0].textContent,
    link: item.getElementsByTagName('link')[0].textContent,
    description: item.getElementsByTagName('description')[0].textContent,
  }));

  return { feed, posts };
};

export default parseFeed;
