import axiosClient from './api/axiosClient.js';
import postApi from './api/postApi.js';
import AppConstants from './appConstants.js';

const setFormValues = (post) => {
  const postImgElement = document.querySelector('#postHeroImage');
  if (postImgElement) {
    postImgElement.style.backgroundImage = `url(${post.imageUrl})`;
  }

  const postTitleElement = document.querySelector('#postDetailTitle');
  if (postTitleElement) {
    postTitleElement.textContent = post.title;
  }
  const formElement = document.querySelector('#postForm');

  const titleInpus = formElement.querySelector('#postTitle');
  if (titleInpus) {
    titleInpus.value = post.title;
  }

  const authorInpus = formElement.querySelector('#postAuthor');
  if (authorInpus) {
    authorInpus.value = post.author;
  }

  const descriptionInput = formElement.querySelector('#postDescription');
  if (descriptionInput) {
    descriptionInput.value = post.description;
  }
};

// const getRandomImage = async () => {
//   const randomId = 1 + Math.trunc(Math.random() * 1000);

//   const imageUrl = `https://picsum.photos/id/${randomId}/${AppConstants.DEFAULT_IMAGE_WIDTH}/${AppConstants.DEFAULT_IMAGE_HEIGHT}`;
//   try {
//     const res = await axiosClient.get(imageUrl);
//     return imageUrl;
//   } catch (error) {
//     getRandomImage();
//     console.log(error);
//   }
// };

// const handleChangeImage = async () => {
//   const imageUrl = await getRandomImage();

//   const element = document.querySelector('#postHeroImage');
//   if (element) {
//     element.style.backgroundImage = `url(${imageUrl})`;
//     element.addEventListener('error', handleChangeImage);
//   }
// };

const handleChangeImage = () => {
  const randomId = 1 + Math.trunc(Math.random() * 1000);

  const imageUrl = `https://picsum.photos/id/${randomId}/${AppConstants.DEFAULT_IMAGE_WIDTH}/${AppConstants.DEFAULT_IMAGE_HEIGHT}`;

  const element = document.querySelector('#postHeroImage');
  if (element) {
    element.style.backgroundImage = `url(${imageUrl})`;
    element.addEventListener('error', handleChangeImage);
  }
};

const changeBackgroundButton = document.querySelector('#postChangeImage');
if (changeBackgroundButton) {
  changeBackgroundButton.addEventListener('click', handleChangeImage);
}

const getImageUrlFromString = (str) => {
  const firstDoubleQuotePosition = str.indexOf('"');
  const lastDoubleQuotePosition = str.lastIndexOf('"');
  return str.slice(firstDoubleQuotePosition + 1, lastDoubleQuotePosition);
};

const getFormValues = () => {
  // if (!form) return;
  const formvalues = {};

  const titleElement = document.querySelector('#postTitle');
  if (titleElement) {
    formvalues.title = titleElement.value;
  }

  const authorElement = document.querySelector('#postAuthor');
  if (titleElement) {
    formvalues.author = authorElement.value;
  }

  const discriptionElement = document.querySelector('#postDescription');
  if (titleElement) {
    formvalues.description = discriptionElement.value;
  }

  const postImageElement = document.querySelector('#postHeroImage');
  if (postImageElement) {
    formvalues.imageUrl = getImageUrlFromString(postImageElement.style.backgroundImage);
  }
  return formvalues;
};
const validateForm = () => {
  let isValid = true;

  // title is required
  const titleElement = document.querySelector('#postTitle');
  const title = titleElement.value;
  if (!title) {
    titleElement.classList.add('is-invalid');
    isValid = false;
  }

  // author is required
  const authorElement = document.querySelector('#postAuthor');
  const author = authorElement.value;
  if (!author) {
    authorElement.classList.add('is-invalid');
    isValid = false;
  }

  return isValid;
};

const handleFormSubmit = async (postId) => {
  const formValues = getFormValues();

  console.log(formValues);
  const isValid = validateForm(formValues);

  if (!isValid) return;
  try {
    if (postId) {
      formValues.id = postId;
      await postApi.update(formValues);
    } else {
      const newPost = await postApi.add(formValues);
      window.location = `add-edit-post.html?id=${newPost.id}`;
      alert('Add new post successfully');
    }
  } catch (error) {
    console.log("Can't update data", error);
  }
};

(async () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');
  const isEditMode = !!postId;
  const loading = document.querySelector('#loader-wrapper');
  const goDetailElement = document.querySelector('#goToDetailPageLink');
  if (isEditMode) {
    try {
      const post = await postApi.get(postId);
      setFormValues(post);

      if (loading) {
        loading.setAttribute('hidden', '');
      }
      goDetailElement.href = `./post-detail.html?id=${postId}`;
      goDetailElement.innerHTML = '<i class="far fa-eye"></i> View post detail';
    } catch (error) {
      console.log(error);
    }
  } else {
    handleChangeImage();
    if (loading) {
      loading.setAttribute('hidden', '');
    }
  }

  const formElement = document.querySelector('#postForm');
  if (formElement) {
    formElement.addEventListener('submit', (e) => {
      handleFormSubmit(postId);
      e.preventDefault();
    });
  }

  const imageElement = document.querySelector('#fakeImg');
  if (imageElement) {
    imageElement.onerror = function () {
      handleChangeImage();
    };
  }
})();
