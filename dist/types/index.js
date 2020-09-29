import { wait } from "common-types";
const cache = {};
const BASE_URL = "https://maps.googleapis.com/maps/api/js";
export async function loadNow(library, apiKey) {
    if (checkIfScriptTagExists(library, apiKey)) {
        return window.google;
    }
    await addScriptTagToBrowser(library, apiKey);
    return window.google;
}
export async function preload(library, apiKey, delay = 2000) {
    addPreloadLinkToBrowser(library, apiKey);
    await wait(delay);
    await addScriptTagToBrowser(library, apiKey);
}
async function addScriptTagToBrowser(library, apiKey, options = {}) {
    if (checkIfScriptTagExists(library, apiKey)) {
        console.info(`Attempt to add script tag for the "${library}" library in Google Maps ignored as this tag already exists in the DOM${apiKey ? " [ " + apiKey + "]" : ""}`);
        return;
    }
    const timeout = async (howLong = 2000) => {
        await wait(howLong);
        throw new Error(`Timed out waiting for Google API to load [ ${library} / ${howLong} ]`);
    };
    const waitForLoad = () => {
        var script = document.createElement("script");
        script.id = `google-maps-${library}-js`;
        script.src = getUrl(library, apiKey);
        document.querySelector("head").appendChild(script);
        return new Promise(resolve => {
            window[`${library}LoaderCallback`] = () => {
                resolve();
            };
        });
    };
    return Promise.race(options.timeout ? [timeout(options.timeout), waitForLoad()] : [waitForLoad()]);
}
function addPreloadLinkToBrowser(library, apiKey) {
    var link = document.createElement("link");
    link.id = `preload-for-${library}`;
    link.rel = "preload";
    link.as = "script";
    link.href = getUrl(library, apiKey, false);
    document.querySelector("head").appendChild(link);
}
function getUrl(library, apiKey, callback = true) {
    let url = `${BASE_URL}?libraries=${library}&sensors=false`;
    if (apiKey) {
        url = `${url}&key=${apiKey}`;
    }
    if (callback) {
        url = `${url}&callback=${library}LoaderCallback`;
    }
    return url;
}
function checkIfScriptTagExists(library, apiKey) {
    const found = document.querySelector(`#google-maps-${library}-js`);
    return Boolean(found);
}
