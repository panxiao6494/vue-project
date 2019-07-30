// 引入axios 封装所有的请求数据的函数
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
//登录请求
export const login = (params) => {
  return axios.post('login', params)
}

//获取侧边栏导航请求
export function menu (params) {
  return axios.get('menus', params)
}

//获取用户列表请求
export function getUser (parmas) {
  return axios.get('/users', parmas)
}
