import postApi from './api/postApi.js';
import AppConstants from './appConstants.js';

const formatDate = (dateString) => {
  if (!dateString) return null;

  // Format: HH:mm dd/MM/yyyy
  const date = new Date(dateString);
  const hour = `0${date.getHours()}`.slice(-2);
  const minute = `0${date.getMinutes()}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const year = date.getFullYear();

  return `${hour}:${minute} ${day}/${month}/${year}`;
};

const renderPost = (postList) => {
  const postElement = document.querySelector('#postsList');

  postList.forEach((post) => {
    const templateElement = document.querySelector('#postItemTemplate');
    if (!templateElement) return;

    const liElementFromTemplate = templateElement.content.querySelector('li');
    const newLiElement = liElementFromTemplate.cloneNode(true);

    const ImgElement = newLiElement.querySelector('#postItemImage');
    if (ImgElement) {
      ImgElement.src = post.imageUrl;
      ImgElement.addEventListener('click', (e) => {
        window.location = `/post-detail.html?id=${post.id}`;
      });
    }

    const titleElement = newLiElement.querySelector('#postItemTitle');
    if (titleElement) {
      titleElement.textContent = `${post.title}`;
      titleElement.addEventListener('click', (e) => {
        window.location = `/post-detail.html?id=${post.id}`;
      });
    }

    const descriptionElement = newLiElement.querySelector('#postItemDescription');
    if (descriptionElement) {
      descriptionElement.textContent = `${post.description.slice(0, 100)}...`;
    }

    const authorElement = newLiElement.querySelector('#postItemAuthor');
    if (authorElement) {
      authorElement.textContent = `${post.author}`;
    }

    const postItemTimeElement = newLiElement.querySelector('#postItemTimeSpan');
    if (postItemTimeElement) {
      postItemTimeElement.textContent = `- ${formatDate(post.createdAt)}`;
    }

    const editElement = newLiElement.querySelector('#postItemEdit');
    if (editElement) {
      editElement.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location = `/add-edit-post.html?id=${post.id}`;
      });
    }

    const removeElement = newLiElement.querySelector('#postItemRemove');
    if (removeElement) {
      removeElement.addEventListener('click', async (e) => {
        e.stopPropagation();
        const message = `Do You Really Want To Remove ${post.title}?`;
        if (window.confirm(message)) {
          try {
            await postApi.remove(post.id);

            newLiElement.remove();
            window.location.reload();
          } catch (error) {
            console.log('Failed To Remove Post:', error);
          }
        }
      });
    }

    postElement.appendChild(newLiElement);
  });
};

const getPageList = (pagination) => {
  const { _limit, _totalRows, _page } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);
  let prevPage = -1;

  if (_page < 1 || _page > totalPages) return [0, -1, -1, -1, 0];

  if (_page === 1) prevPage = 1;
  else if (_page === totalPages) prevPage = _page - 2 > 0 ? _page - 2 : 1;
  else prevPage = _page - 1;

  const currPage = prevPage + 1 > totalPages ? -1 : prevPage + 1;
  const nextPage = prevPage + 2 > totalPages ? -1 : prevPage + 2;

  return [
    _page === 1 || _page === 1 ? 0 : _page - 1,
    prevPage,
    currPage,
    nextPage,
    _page === totalPages || totalPages === _page ? 0 : _page + 1,
  ];
};
const renderPostsPagination = (pagination) => {
  const postPagination = document.querySelector('#postsPagination');
  if (postPagination) {
    const pageList = getPageList(pagination);
    const { _page, _limit } = pagination;
    const pageItems = postPagination.querySelectorAll('.page-item');
    if (pageItems.length === 5) {
      pageItems.forEach((item, idx) => {
        if (pageList[idx] === -1) {
          item.setAttribute('hidden', '');
          return;
        }

        if (pageList[idx] === 0) {
          item.classList.add('disabled');
          return;
        }

        const pageLink = item.querySelector('.page-link');
        if (pageLink) {
          pageLink.href = `?_page=${pageList[idx]}&_limit=${_limit}`;

          if (idx > 0 && idx < 4) {
            pageLink.textContent = pageList[idx];
          }
        }

        if (idx > 0 && idx < 4 && pageList[idx] === _page) {
          item.classList.add('active');
        }
      });

      postPagination.removeAttribute('hidden');
    }
  }
};

(async () => {
  const urlParam = new URLSearchParams(window.location.search);
  const page = urlParam.get('_page');
  const limit = urlParam.get('_limit');
  const params = {
    _page: page || AppConstants.DEFAULT_PAGE,
    _limit: limit || AppConstants.DEFAULT_LIMIT,
    _sort: 'updatedAt',
    _order: 'desc',
  };

  try {
    const response = await postApi.getAll(params);
    const postList = response.data;
    const pagination = response.pagination;
    renderPostsPagination(pagination);
    renderPost(postList);
    document.querySelector('#loader-wrapper').setAttribute('hidden', '');
  } catch (error) {
    console.log('Some error here', error);
  }
})();
