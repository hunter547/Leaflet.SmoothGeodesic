# 🌎 Leaflet.SmoothGeodesic

## [Demo](https://leaflet-smoothgeodesic.netlify.app/)

![Image of smooth geodesic path](https://raw.githubusercontent.com/hunter547/leaflet-smooth-geodesic-gatsby-site/main/static/ogImage.png)

## Purpose

Draw smooth geodesic (Great Circle) paths from a source latitude/longitude to a destination latitude/longitude.

<div id="top"></div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<br />

### Built With

- [Leaflet.js](https://leafletjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [rollup.js](https://rollupjs.org/guide/en/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Setup

You need to have a leaflet map setup before usage. Follow the setup guide here:
<br />
Vanilla Javasciprt: https://leafletjs.com/SlavaUkraini/examples/quick-start/
<br />
React: https://react-leaflet.js.org/docs/start-installation/

## Installation

### Node.js

```
npm i leaflet.smoothgeodesic
```

Import leaflet FIRST, then leaflet.smoothgeodesic:

```javascript
import L from "leaflet"; // import { smoothGeodesic, SmoothGeodesic } from 'leaflet'; // for TypeScript
import "leaflet.smoothgeodesic";
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Give a source coordinate and destination coordinate (with options) and optionally animate it

### Parameters

```
L.smoothGeodesic(Source Coords, Dest Coords, Number of Midpoints, Options)
```

1. **Source Coords**
   |Purpose|Available Data Types|Example|
   |---------|-------|--------------------|
   The starting location of the curve|`[number, number]` and `L.LatLng(lat, lng)`| `[0, 0]` or `(new L.LatLng(0, 0) or L.latLng(0, 0))` |
2. **Dest Coords**
   |Purpose|Available Data Types|Example|
   |---------|-------|--------------------|
   The ending location of the curve|`[number, number]` and `L.LatLng(lat, lng)`| `[0, 0]` or `(new L.LatLng(0, 0) or L.latLng(0, 0))` |
3. **Number of Midpoints**
   |Purpose|Available Data Types|Example|
   |---------|-------|--------------------|
   |The number calculated points along the geodesic path for use by the curve. The higher the number, the more accurate the curve, but more intensive the calculation. 65 points seems to be a good balance of true geodesic accuracy and calculation intensity. 100+ for really accurate lines.| `number (integer)` | `65` |
4. **Options**
   |Purpose|Available Data Types|Example|
   |---------|-------|--------------------|
   |Allow for customization of the geodesic path. This options object is an extension of the [Leaflet Path Options](https://leafletjs.com/SlavaUkraini/reference.html#path). All options listed there can be used here, as well as an `animate` property, which is of type [KeyframeAnimationOptions](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.keyframeanimationoptions.html) or just a number. This gives the user the ability to both customize the path and animate it from point a to point be with keyframes, or just a number defining the duration of the point A to pont B "flight"|{...[Path Options](https://leafletjs.com/SlavaUkraini/reference.html#path), animate: [`KeyframeAnimationOptions`](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.keyframeanimationoptions.html) or `number` | }| |

<!-- ROADMAP -->

## Roadmap

- [ ] Add Changelog.
- [ ] Add CDN delivery of the src code for vanilla javascript support.
- [ ] Add methods to allow setting of new source and destination coordinates on an existing path.
- [ ] Extend off the Leaflet Path class instead of extending using the extend method (better typing / more readable)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See [`LICENSE`](https://github.com/hunter547/Leaflet.SmoothGeodesic/blob/main/LICENSE) for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Hunter Evanoff - hunter@evanoff.dev

Project Link: [https://github.com/hunter547/Leaflet.SmoothGeodesic](https://github.com/hunter547/Leaflet.SmoothGeodesice)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

This repo wouldn't be possible without the work of these repos:

- How to get under the hood of L.Path and customize it: [Leaflet.curve](https://github.com/onikiienko/Leaflet.curve)
- Geodesic calculations: [arc.js](https://github.com/springmeyer/arc.js/)

<p align="right">(<a href="#top">back to top</a>)</p>