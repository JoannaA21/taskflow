//This tells babel: JSX -> normal JavaScript
// Nav.test.jsx -> Jest runs test -> Babel converts JSX → JS -> Jest executes it -> jsdom simulates browser
export default {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
};
