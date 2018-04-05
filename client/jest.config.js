module.exports = {
 testEnvironmentOptions: {
    // only string values is supported??
    beforeParse (window) {
     console.log('------------------------------------------  log ')
      window.document.childNodes.length === 0;
      window.alert = (msg) => { console.log(msg); };
      window.matchMedia = () => ({});
      window.scrollTo = () => { };
    }
  },
}
