const SUPABASE_URL = 'https://vskovpzojfjdkywumkvp.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZza292cHpvamZqZGt5d3Vta3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQyOTQ3ODIsImV4cCI6MTk3OTg3MDc4Mn0.euIamkEcpDRax278j2hv-LHL5UpS57qJYvVW1zeQ_GI';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Auth related functions */

export function getUser() {
    return client.auth.user();
}

export async function signUpUser(email, password) {
    return await client.auth.signUp({
        email,
        password,
    });
}

export async function signInUser(email, password) {
    return await client.auth.signIn({
        email,
        password,
    });
}

export async function signOutUser() {
    return await client.auth.signOut();
}

/* user profiles */

export async function updateProfile(profile) {
    // > Part A: upsert into profiles table
    const response = await client.from('profiles').upsert(profile).single();
    return response;
}

export async function getProfile(id) {
    // > Part B: get profile by id, maybe single row returned
    const response = await client.from('profiles').select('*').eq('id', id).maybeSingle();
    return response;
}

export async function getProfiles() {
    // > Part D: get all profiles (limit 100)
    return await client.from('profiles').select().limit(100);
}

// TODO:
// export async function uploadImage(bucketName, imageName, imageFile) {
//     // we can use the storage bucket to upload the image,
//     // then use it to get the public URL
//     const bucket = client.storage.from(bucketName);
export async function upLoadImage(bucketName, imageName, imageFile) {
    const bucket = client.storage.from(bucketName);

    //     const response = await bucket.upload(imageName, imageFile, {
    //         cacheControl: '3600',
    //         // in this case, we will _replace_ any
    //         // existing file with same name.
    //         upsert: true,
    //     });
    const response = await bucket.upload(imageName, imageFile, {
        cacheControl: '3600',
        upsert: true,
    });
    //     if (response.error) {
    //         // eslint-disable-next-line no-console
    //         console.log(response.error);
    //         return null;
    //     }
    if (response.error) {
        console.log(response.error);
        return null;
    }
    //     // bug in supabase makes this return wrong value :(
    //     // const url = bucket.getPublicUrl(data.Key);

    //     // so we will make it ourselves.
    //     // note that we exported the url from `./client.js`
    //     const url = `${SUPABASE_URL}/storage/v1/object/public/${response.data.Key}`;
    const url = `${SUPABASE_URL}/storage/v1/object/public/${response.data.Key}`;
    return url;
    //     return url;
}
