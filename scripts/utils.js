import { getMetadata } from './aem.js';

export function createTag(tag, attributes, content) {
  // eslint-disable-next-line no-param-reassign
  attributes = attributes || {};
  const element = document.createElement(tag);
  if (content instanceof HTMLElement) {
    element.appendChild(content);
  } else if (content) {
    element.innerHTML = content;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  return element;
}

export function modifyHeaders(block) {
  if (getMetadata('template') === 'blog-page-template') {
    return null;
  }
  block.querySelectorAll('h2 > strong').forEach((element) => {
    element.replaceWith(createTag('span', { class: 'text-color-blue' }, element.innerText));
  });
  block.querySelectorAll('h2 > em').forEach((element) => {
    element.replaceWith(createTag('span', { class: 'text-color-linear' }, element.innerText));
  });

  block.querySelectorAll('h1 > strong').forEach((element) => {
    element.replaceWith(createTag('span', { class: 'text-color-blue' }, element.innerText));
  });
  block.querySelectorAll('h1 > em').forEach((element) => {
    element.replaceWith(createTag('span', { class: 'text-color-linear' }, element.innerText));
  });
  return block;
}

export const getBlockProperties = (block) => {
  const propertiesMap = {};
  let contentHtml;
  [...block.children].forEach((row) => {
    if (row.firstElementChild.textContent === 'content') {
      contentHtml = row.lastElementChild.innerHTML;
    }
    propertiesMap[row.firstElementChild.textContent] = row.lastElementChild.textContent;
  });
  if (propertiesMap.insertHtml === 'true' && contentHtml) {
    propertiesMap.content = contentHtml;
  }
  return propertiesMap;
};
