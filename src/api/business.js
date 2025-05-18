import request from '@/utils/request'

export function createShop(data) {
  return request({
    url: '/web/merchant/create',
    method: 'post',
    data
  })
}