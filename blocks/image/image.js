import { createTag } from '../../scripts/utils.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

const buildIcon = (iconContainer) => {
  const icons = iconContainer.querySelectorAll('p:not(:has(sub))');
  const mainIcon = icons[0].textContent;
  const hoverIcon = icons[1] ? icons[1].textContent : '';

  const link = iconContainer.querySelector('a');
  const tagData = {
    class: 'image-icon',
    style: `--image-icon-path: url("${mainIcon}"); --image-icon-hover-path: url("${hoverIcon || mainIcon}");`,
  };

  const ariaLabel = iconContainer.querySelector('sub');

  if (link) {
    tagData.href = link.getAttribute('href');
    tagData['aria-label'] = ariaLabel ? ariaLabel.textContent || 'Icon' : 'Icon';
  }

  const iconTag = createTag(link ? 'a' : 'span', tagData, '');
  return iconTag;
};

const getIconsTag = (block) => {
  const icons = [];
  for (let i = 1; i < block.children.length; i += 1) {
    const iconContainer = block.children[i];
    icons.push(buildIcon(iconContainer));
  }
  let iconsTag;
  if (icons) {
    iconsTag = createTag('div', { class: 'image-icons' }, '');
    icons.forEach((icon) => iconsTag.appendChild(icon));
  }
  return iconsTag;
};

const optimizePicture = (block, picture) => {
  if (!block.classList.contains('optimize')) {
    return;
  }
  let optimizeSize = 750;
  if (block.classList.contains('optimize-large')) {
    optimizeSize = 300;
  } else if (block.classList.contains('optimize-medium')) {
    optimizeSize = 500;
  }

  picture.querySelectorAll('img')
    .forEach((img) => img.closest('picture')
      .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: optimizeSize }])));
};

export default function decorate(block) {
  const picture = block.querySelector('picture');
  picture.querySelector('img').removeAttribute('loading', 'eager');
  const icons = getIconsTag(block);
  block.innerHTML = '';
  block.appendChild(picture);
  optimizePicture(block, picture);
  if (icons) {
    block.appendChild(icons);
  }
}
