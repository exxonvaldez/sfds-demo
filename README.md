## Introduction

This is a simple web app that displays data about affordable rental housing in San Francisco.

The housing data comes from [DataSF](https://data.sfgov.org/Housing-and-Buildings/Mayor-s-Office-of-Housing-and-Community-Developmen/9rdx-httc).  The data can be accessed directly via the SODA API at [https://data.sfgov.org/resource/9rdx-httc.json](https://data.sfgov.org/resource/9rdx-httc.json).

The app is a single page with the following features:

- Shows a table to display some columns of the data.
- Allows sorting by any of the visible columns.
- Displays a map with (approximate) locations of the properties.  In the data, latitude is given to only two decimal places (about 0.7 mile increments), so plotted locations are offset north or south slightly based on row number to spread the markers apart.
- Allows toggling selection of individual properties via the map or table, and seeing that same selection in both the map and table.
- When properties are selected, the table shows filtering buttons to show only selected rows or all rows. 
- Shows a chart of the total number of affordable units and beds by year affordability began.
- Has styling and layout that resembles an information page from [https://sf.gov](https://sf.gov).  including some support for smaller screen and window sizes and older browsers such as Internet Explorer 9 and above.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).  The standard Create React App instructions are at the bottom of this document, and remain fully applicable.

This app is heavily based on code from [OpenTransit](https://codeforsanfrancisco.org/projects/opentransit/), an open source web app developed by community volunteers, including myself, for visualizing historical movement data of Muni trains and buses.  OpenTransit has a React front end that displays data in the form of tables, maps, and charts.  Both apps use Material UI for layout and tables, React-Leaflet for maps, react-vis for charts, and Redux/redux-thunk as a shared store for state.  

OpenTransit recently shifted from using class components to functional components that use hooks, but some of the components (in particular, the maps) are still class based.  OpenTransit has no automated tests yet.

## Demo Animation

![Demo gif](/demo.gif?raw=true "Demo")

## Code Structure

Under `components`:

- `ProjectScreen` Main page with html
- `ProjectMap` react-leaflet map
- `ProjectTable` Material UI table
- `ProjectTimelineChart` react-vis chart

Under `reducers`:

- `index.js` The one reducer

At the root level:

- `actions.js` The action creators (one to fetch data and one to update selections)
- `App.js` A Material UI themed wrapper around `ProjectScreen`
- `index.js` Sets up a redux-thunk store and renders `App`
- `index.css` All the css, mostly borrowed from sf.gov


## Developer Discussion

Creating this app took much more time than I expected and much more time than was recommended.  It was a fun app to work on, and gave me a chance to learn a lot of things, so it felt like time well spent.   Time intensive aspects of developing this app are listed below.

After bootstrapping a new React app, choosing from packages used by OpenTransit.  Then porting over the core parts of the OpenTransit app but with things like routing removed.  Fixing new lint errors that appeared, as OpenTransit is on React 16.8 and this app is on 16.9.  For example, any use of componentWillMount generates a new warning.

Adapting OpenTransit components, by iteratively choosing some features to remove, then some more, and then some more.

Resolving differences between Create React App styles and sf.gov, so that text looks the same on both.  In particular the CRA
body has these attributes, which seems to affect how font weights for the "Rubik" font are rendered:
- `-webkit-font-smoothing: antialiased;`
- `-moz-osx-font-smoothing: grayscale;`
  
Understanding the css, design, and color schemes for the sf.gov home page and department page well enough to realize that these templates are not a flexible enough design to reuse here.  Then looking for and switching to a more suitable type of page, in this case, an information page.

Picking just the needed css rules (so many!) and html structure from sf.gov to create an alpha banner, a hero banner, and some subheadings and paragraphs.

Recreating sf.gov's responsive container layout in React by using theming and custom breakpoints.

Given the sf.gov color scheme, adapting the map, chart, and checkboxes to not clash.  In particular, for the map it was hard to pick two colors that make sense together on a light background.  It was also hard find the best opacity for the marker fill and stroke where closely placed markers still looked distinct, and an isolated marker still had some contrast from the background.

I did not set up a full Material UI theme with colors.  I using the default theme's primary color (blue) throughout and then
customized colors for the map.  In hindsight, a custom theme with colors and palette whose colors were accessed by non-Material UI components would have been better.

Setting up a VM from modern.ie to run IE 9/10.  Selecting the IE 9 option for VMWare, despite the VM's name, resulted a VM with IE 8, so had to download IE 10.  I then discovered that Axios dropped IE support in the last few versions, leading to false CORS errors, requiring a downgrade to 0.18.0.  Also rediscovered that IE 10 comes with TLS 1.2 turned off by default.

Looking at IE 10 issues:  project selection takes a while. 7 seconds per click, and the js profiler does not show this delay. The react-vis chart is missing vertical bars (possibly solvable using core-js polyfills: https://github.com/uber/react-vis/issues/392).

Iterating to decide on map mouseover and click behaviors, and to decide whether the table should support selection of rows or not.

Learning how to test connected components, as this seems to be an ongoing issue as packages evolve.  The tests are extremely basic and do not include any snapshots.

Writing documentation (this document plus source comments) and adding an animated demo.


<br/><br/><br/>


(Below are the standard Create React App README instructions.)
 
## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
