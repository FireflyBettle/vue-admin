import request from '@/utils/request'

// 创建分发
export function createDistribution(data) {
  return request({
    url: '/web/distribution/create',
    method: 'post',
    data
  })
}
// 修改分发
export function updateDistribution(data) {
  return request({
    url: '/web/distribution/update',
    method: 'post',
    data
  })
}
// 分发列表
export function distributionList(data) {
  return request({
    url: '/web/distribution/list',
    method: 'post',
    data
  })
}
// 分发详情
export function distributionDetail(data) {
  return request({
    url: '/web/distribution/detail',
    method: 'post',
    data
  })
}
// 申请券码
export function applyCoupon(data) {
  return request({
    url: '/web/coupon/apply',
    method: 'post',
    data
  })
}