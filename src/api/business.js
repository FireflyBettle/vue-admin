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
export function changeMerchant(data) {
  return request({
    url: '/web/merchant/update',
    method: 'post',
    data
  })
}

// 门店列表
export function storesList(data) {
  return request({
    url: '/web/store/list',
    method: 'post',
    data
  })
}

// 创建门店
export function createStores(data) {
  return request({
    url: '/web/store/create',
    method: 'post',
    data
  })
}