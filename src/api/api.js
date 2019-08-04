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

// 状态切换开关的改变
export function changeStae (params) {
  return axios.put(`users/${params.id}/state/${params.mg_state}`)
}

//添加用户
export function addU (params) {
  return axios.post('/users', params)
}

//展示编辑表格
export function showU (params) {
  return axios.get('users/' + params)
}

//编辑用户
export function editU (params) {
  return axios.put('users/' + params.id, {
    email: params.email,
    mobile: params.mobile
  })
}

//删除用户
export function deletU (params) {
  return axios.delete('users/' + params)
}

//分配角色
export function setR (params) {
  return axios.get('roles')
}

//保存分配的角色
export function saveI (params1, params2) {
  return axios.put(`users/${params1}/role`, {
    rid: params2
  })
}

//获取角色
export function getR () {
  return axios.get('roles')
}

//获取权限管理
export function getRi () {
  return axios.get('rights/list')
}

//根据用户id删除指定的权限
export function delR (params1, params2) {
  return axios.delete(`roles/${params1.id}/rights/${params2}`)
}

//获取权限管理
export function getRit () {
  return axios.get('rights/tree')
}

//分配管理权限
export function allR (params1, params2) {
  return axios.post(`roles/${params1}/rights`, params2)
}

//获取分类
export function getC (param) {
  return axios.get('categories', {
    params: param
  })
}

export function getCa (param) {
  return axios.post('categories', param)
}

//获得商品
export function getGood (params) {
  return axios.get('goods', params)
}

//删除商品
export function delG (param) {
  return axios.delete(`goods/${param}`)
}

