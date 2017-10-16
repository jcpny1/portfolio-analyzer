// Check a fetch response status.
function checkStatus(response) {
  if (response.status < 200 || response.status >= 300) {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.status;
    error.response = response;
    console.log(error);
debugger;
  }
  return response;
}

const Fetch = {checkStatus};
export default Fetch;
