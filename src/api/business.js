import request from '@/utils/request'

export function createMerchant(data) {
  return request({
    url: '/web/merchant/create',
    method: 'post',
    data
  })
}
export function merchantList(data) {
  return request({
    url: '/web/merchant/list',
    method: 'post',
    data
  })
}
export function merchantDetail(data) {
  return request({
    url: '/web/merchant/detail',
    method: 'post',
    data
  })
}