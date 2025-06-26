import request from '@/utils/request'


// 查询平台账单记录
export function billRecordList(data) {
  return request({
    url: '/web/bill/record/list',
    method: 'post',
    data
  })
}

// 查询流水记录列表
export function billSerialList(data) {
  return request({
    url: '/web/serial/list',
    method: 'post',
    data
  })
}

// 查询商户账单记录
export function billMerchantList(data) {
  return request({
    url: '/web/bill/merchant/list',
    method: 'post',
    data
  })
}

// 查询渠道账单记录
export function billChannelList(data) {
  return request({
    url: '/web/bill/channel/list',
    method: 'post',
    data
  })
}

// 查询门店账单记录
export function billStoreList(data) {
  return request({
    url: '/web/bill/store/list',
    method: 'post',
    data
  })
}

// 核心指标展示
export function coreDisplay(data) {
  return request({
    url: '/web/core/display',
    method: 'post',
    data
  })
}