import ApiV1 from './v1';
import ApiV2 from './v2';

// export default api;

const api = {
  ApiV1,
  ApiV2,
  default: {},
};

api.default = api;

module.exports = api;
