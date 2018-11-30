module.exports = {
  'automock': false,
  'setupFiles': ['./src/setupTests.js'],
  testEnvironmentOptions: {
    beforeParse (window) {
      console.log('------------------------------------------  log ');
      window.document.childNodes.length === 0;
      window.alert = (msg) => { console.log(msg); };
      window.matchMedia = () => ({});
      window.scrollTo = () => { };
    }
  },
}
