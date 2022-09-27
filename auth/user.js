import { getUser, signOutUser, getProfile } from '../fetch-utils.js';

const signOutLink = document.getElementById('sign-out-link');
const userAvatar = document.getElementById('user-avatar');

// make sure we have a user!
const user = getUser();
if (!user) {
    const base =
        location.pathname === '/' || location.pathname === '/solutions-web/user-auth/'
            ? './'
            : '../';
    location.replace(`${base}auth/?redirectUrl=${encodeURIComponent(location)}`);
}

signOutLink.addEventListener('click', signOutUser);

let error = null;
let profile = null;

window.addEventListener('load', async () => {
    const response = await getProfile(user.id);
    error = response.error;
    profile = response.data;

    if (error) {
        console.log(error);
        return;
    }

    if (profile) {
        displayProfile();
    }
});

function displayProfile() {
    if (userAvatar && profile && profile.avatar_url) {
        userAvatar.src = profile.avatar_url;
    }
}
