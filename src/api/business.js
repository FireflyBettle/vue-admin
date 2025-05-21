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

// 修改门店
export function changeStores(data) {
  return request({
    url: '/web/store/update',
    method: 'post',
    data
  })
}

// 批量门店信息
export function batchStoreInformation(data) {
  return request({
    url: '/web/store/details',
    method: 'post',
    data
  })
}

// 批量删除门店
export function deleteStores(data) {
  return request({
    url: '/web/store/delete',
    method: 'post',
    data
  })
}

// 门店秘钥重置
export function resetStoresSecret(data) {
  return request({
    url: '/web/store/secret/reset',
    method: 'post',
    data
  })
}