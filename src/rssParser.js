import { uniqueId } from 'lodash';

const parseFeed = (response) => {
  const domparser = new DOMParser();
  const xmlData = domparser.parseFromString(response.data.contents, 'text/xml');
  const feedTitle = xmlData.getElementsByTagName('title')[0].textContent;
  const feedDescription = xmlData.getElementsByTagName('description')[0].textContent;
  const feed = { id: uniqueId(), title: feedTitle, description: feedDescription };

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
