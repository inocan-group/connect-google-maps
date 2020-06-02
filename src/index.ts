import { IDictionary, wait } from "common-types";
export type IGoogleApi = import("google-maps").google;
export type IGoogleMapsLibrary = "places" | "autocomplete";

const cache: IDictionary<IGoogleApi> = {};
export interface IGoogleMapsLoaderOptions {
  apiKey?: string;
}
const BASE_URL = "https://maps.googleapis.com/maps/api/js";
declare global {
  interface Window extends IDictionary {
    mapsLookupCallback?: () => void;
    placesLookupCallback?: () => void;
  }
}

/**
 * **loadNow**
 *
 * Loads the given maps library function (e.g., places, maps, etc.) by injecting
 * a script tag into the page and then waits for the library to load before
 * returning
 */
export async function loadNow(
  library: IGoogleMapsLibrary,
  apiKey?: string
): Promise<IGoogleApi> {
  if (checkIfScriptTagExists(library, apiKey)) {
    return window.google;
  }
  await addScriptTagToBrowser(library, apiKey);
  return window.google;
}

/**
 * **preload**
 *
 * Adds a preload directive to the browser to tell it to "preload" when there are
 * free cycles do so. Then after some delay factor, it will add in the script tag to parse
 * the JS. By default the delay is 2 seconds but you can set this to whatever time you like
 */
export async function preload(
  library: IGoogleMapsLibrary,
  apiKey?: string,
  delay = 2000
) {
  addPreloadLinkToBrowser(library, apiKey);
  await wait(delay);
  await addScriptTagToBrowser(library, apiKey);
}

async function addScriptTagToBrowser(
  library: IGoogleMapsLibrary,
  apiKey?: string,
  options: { timeout?: number } = {}
) {
  if (checkIfScriptTagExists(library, apiKey)) {
    console.info(
      `Attempt to add script tag for the "${library}" library in Google Maps ignored as this tag already exists in the DOM${
        apiKey ? " [ " + apiKey + "]" : ""
      }`
    );
    return;
  }
  const timeout = async (howLong: number = 2000) => {
    await wait(howLong);
    throw new Error(
      `Timed out waiting for Google API to load [ ${library} / ${howLong} ]`
    );
  };

  const waitForLoad = () => {
    var script = document.createElement("script");
    script.id = `google-maps-${library}-js`;
    script.src = getUrl(library, apiKey);
    (document.querySelector("head") as HTMLHeadElement).appendChild(script);

    return new Promise(resolve => {
      window[`${library}LoaderCallback`] = () => {
        resolve();
      };
    });
  };

  return Promise.race(
    options.timeout ? [timeout(options.timeout), waitForLoad()] : [waitForLoad()]
  );
}

function addPreloadLinkToBrowser(library: IGoogleMapsLibrary, apiKey?: string) {
  var link = document.createElement("link");
  link.id = `preload-for-${library}`;
  link.rel = "preload";
  link.as = "script";
  link.href = getUrl(library, apiKey, false);
  (document.querySelector("head") as HTMLHeadElement).appendChild(link);
}

function getUrl(library: IGoogleMapsLibrary, apiKey?: string, callback: boolean = true) {
  let url = `${BASE_URL}?libraries=${library}&sensors=false`;
  if (apiKey) {
    url = `${url}&key=${apiKey}`;
  }
  if (callback) {
    url = `${url}&callback=${library}LoaderCallback`;
  }
  return url;
}

function checkIfScriptTagExists(library: IGoogleMapsLibrary, apiKey?: string) {
  const found = document.querySelector(`#google-maps-${library}-js`);
  return Boolean(found);
}
