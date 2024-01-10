import api from 'api';
const sdk = api('@docs-tam/v1.0.0#4avjy1rlq4t0v5k');

sdk.checkPaymentOptionsAvailability()
  .then(({ data }) => console.log(data))
  .catch(err => console.error(err));