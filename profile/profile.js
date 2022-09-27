import '../auth/user.js';
// > Part A: import updateProfile from fetch-utils.js
// > Part B: import getUser and getProfile from fetch-utils.js
import { updateProfile, getProfile, getUser, upLoadImage } from '../fetch-utils.js';

// > Part B: get the user
const user = getUser();

const errorDisplay = document.getElementById('error-display');
const profileForm = document.getElementById('profile-form');
const updateButton = profileForm.querySelector('button');
const userNameInput = profileForm.querySelector('[name=user_name]');
const bioTextArea = profileForm.querySelector('[name=bio]');
const avatarInput = profileForm.querySelector('[name=avatar_url]');
const preview = document.getElementById('preview');

let profile = null;
let error = null;

window.addEventListener('load', async () => {
    // > Part B:
    //      - get the profile based on user.id
    const response = await getProfile(user.id);
    //      - set profile and error state from response object
    profile = response.data;
    error = response.error;

    if (error) {
        displayError();
    }

    if (profile) {
        displayProfile();
    }
});

avatarInput.addEventListener('change', () => {
    const file = avatarInput.files[0];
    preview.src = URL.createObjectURL(file);
});

profileForm.addEventListener('submit', async (e) => {
    // keep the form from changing the browser page
    e.preventDefault();

    // niceties for "saving" and errors:
    // reset the error
    errorDisplay.textContent = '';
    // remember the button text
    const buttonText = updateButton.textContent;
    // disabled button and change to "saving..."
    updateButton.disabled = true;

    // create a form data object for easy access to form values
    const formData = new FormData(profileForm);

    // > Part A
    //      - create a profile update object
    const profileUpdate = {
        user_name: formData.get('user_name'),
        bio: formData.get('bio'),
    };

    // get the avatar file from the form
    const imageFile = formData.get('avatar_url');
    // Do we have a file? If so size will be > 0
    if (imageFile.size) {
        // put the image in the bucket using the user id
        // as a folder, and whatever file name the uploaded
        // image has
        const imageName = `${user.id}/${imageFile.name}`;
        // do the upload and get the returned url
        const url = await upLoadImage('avatars', imageName, imageFile);
        // add the url property to the update object
        profileUpdate.avatar_url = url;
    }
    //      - call updateProfile passing in profile update object, capture the response
    const response = await updateProfile(profileUpdate);

    error = response.error;

    // did it work?
    if (error) {
        // display the error
        displayError();
        // reset the button to be active
        updateButton.disabled = false;
        // restore the button text to what it was
        updateButton.textContent = buttonText;
    } else {
        // > Part A: uncomment when working to redirect user
        location.assign('../');
    }
});

function displayProfile() {
    // > Part B: update user name and bio from profile object
    userNameInput.value = profile.user_name;
    bioTextArea.value = profile.bio;
    if (profile.avatar_url) {
        preview.src = profile.avatar_url;
    }
}

function displayError() {
    errorDisplay.textContent = error.message;
}
