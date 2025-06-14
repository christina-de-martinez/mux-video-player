# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# mux-video-player

## bugs / ideas

* make a sound inversely loud to how you want the video to be? right now it's as loud...
* your playback speed is a function of your battery percentage: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery
* factor your playback speed in to your longitude. People at the equator get 1x playback speed, but if you're at a different latitude it slows it down for you
* make the moveX when seeking dynamic based on how much we're seeking (seeking by 1 min should move more than seeking by 10 seconds)
* something with the accelerometer?
* I partially implemented seeking info to the websocket but we're not actually reading it. if one person seeks, we all seek. we are a hive mind. sharing is caring.
* improve styling
