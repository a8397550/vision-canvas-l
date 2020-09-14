import axios from 'axios';



export default function request(params) {
  if (!params.method) {
    params.method = 'GET';
  }

  if (params.headers) {
    const keyList = Object.keys(params);
    for (let i = 0; i < keyList.length; i++) {
      const key = keyList[i];
      if (key.toLowerCase() === 'content-type') {
        break;
      }
      if (i + 1 === keyList.length && flag) {
        params.headers['Content-Type'] = 'application/json';
      }
    }
  } else {
    params.headers = {
      'Content-Type': 'application/json'
    }
  }

  return axios(params).then(res => {
    return res.data
  }).catch(err => {
    return err;
  });
}; 