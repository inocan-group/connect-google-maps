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
export declare function loadNow(library: IGoogleMapsLibrary, apiKey?: string): Promise<IGoogleApi>;
export declare function preload(library: IGoogleMapsLibrary, apiKey?: string, delay?: number): Promise<void>;
