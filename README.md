# Connect Google Maps

This library provides a simple way to include the google maps API into your favorite SPA framework. 
It includes Typescript typings and it allows for several high-performance improvements to basic 
loading techniques.

## Installation

```sh
# npm
npm install connect-google-maps
# yarn
yarn add connect-google-maps
```

## Usage

There are two major use-cases you can use this library in:

### Preloading

In cases where your application will likely navigate to a page which doesn't need to use the Google API
yet but you want to be ready to use the library immediately when you get to the pages where the API is
needed then _preloading_ may be a good idea.

Before we discuss how to use with this package, let's discuss what is actually being done functionally.
In the below example is how you could manually add to your  `index.html` file to preload the Google API:

```html
<head>
  <link rel="preload" as="script"
    href="https://maps.googleapis.com/maps/api/js?key=XXXYYYZZZZ&libraries=places">
  </link>
  <script>
    setTimeout(() => {
      if (window.google && window.google.maps) {
        return
      }
      var loadLater = document.createElement('script');
      loadLater.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD-AQKOVKFqVWF98qnYMvpFNH_u_ZrUOQk&libraries=places"
      document.body.appendChild(loadLater);
    }, 3000)
  </script>
</head>
```

Here's what is happening:

1. The browser displays a `preload` directive immediately on load and this tells the browser ... at it's discression ...
to load the JS over the network when it has network availability. It will **not** get in the way of initial page load but will
load as soon as it can. It will _not_, however, parse the JS yet.
2. After some indiscriminate timeout period -- in this example 3 seconds -- it will check to see if somehow the Google Maps API is
available on the global namespace. If it is then it's done. If NOT then the actual script tag to load the API is added to the page.
3. In most cases the addition of the script tag will result in only the JS parsing as the _preload_ has already fetched the JS from
the network. If the user is on an old browser that doesn't understand the _preload_ then it will at this point in time load AND parse
the JS.

Now whenever you come to a page that _needs_ the Google Maps API it will be ready immediately but by preloading it in this fashion you
have not inconvenienced the user at all by paying a performance penality ealier in the cycle. Largely a "win/win".

So how does this library help here? Mainly it just codifies the above HTML into an easy to include JS snippet. If in VueJS, for instance,
we wanted to add this functionality we could add the following to our `App.vue` file:

```vue
<script>
import { preload } from 'connect-google-maps';
export default {
  mounted() {
    preload('places', 'my-api-key');
  }
}
</script>
```

That will in essence do exactly the same thing as the HTML example above. That's interesting but really not the main use case for this library.
For an introduction into that please read onto the next section.

### Load Now

When you arrive at a page which DOES need to the Google Maps to be loaded you want to be able to get a promise-based way of loading the library
and then having control passed back to you. Using VueJS as the example again you can achieve this by:

```vue
<script>
import { loadNow } from 'connect-google-maps';
export default {
  async mounted() {
    await loadNow('places', 'my-api-key');
    // do whatever else you want with Google API knowning that it is available
  }
}
</script>
```

This library will return control (via promise resolution) once the library is loaded. If the library was ALREADY loaded prior to arriving at this
page it will return immediately, if it was not loaded than it will asynchronously load it at that point in time.

## Typescript

Though the examples we used were with standard Javascript we have written this in Typescript and all typings are exported. Because of the typings
and the limited API surface that this library exposes we will leave the documentation here. Hope you enjoy the library. PR's are always welcome.

## Module Formats

We export in both CommonJS and ESNEXT formats. Typically this library best used when consumed via ESNEXT (which _should_ be the default if you're using
modern build system for your app).

## License

Copyright (c) 2019 Inocan Group

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.