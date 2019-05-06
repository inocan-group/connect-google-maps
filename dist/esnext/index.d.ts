import { IDictionary } from "common-types";
export declare type IGoogleApi = import("google-maps").google;
export declare type IGoogleMapsLibrary = "places" | "autocomplete";
export interface IGoogleMapsLoaderOptions {
    apiKey?: string;
}
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
export declare function loadNow(library: IGoogleMapsLibrary, apiKey?: string): Promise<IGoogleApi>;
/**
 * **preload**
 *
 * Adds a preload directive to the browser to tell it to "preload" when there are
 * free cycles do so. Then after some delay factor, it will add in the script tag to parse
 * the JS. By default the delay is 2 seconds but you can set this to whatever time you like
 */
export declare function preload(library: IGoogleMapsLibrary, apiKey?: string, delay?: number): Promise<void>;
