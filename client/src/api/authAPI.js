import request from './request';

// const register = data => {
//   return request({
//     url: '/api/users/register',
//     method: 'POST',
//     data
//   });
// };

const login = data => {
  return request({
    url: '/api/users/login',
    method: 'POST',
    data
  });
};

const predict=data=>{
  return request({
    url:"/api/disease/predict",
    method:"POST",
    data
  })
}


export default {
  login,
  predict
};
