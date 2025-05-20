import request from '@/utils/request'
// 创建渠道
export function createChannel(data) {
  return request({
    url: '/web/channel/create',
    method: 'post',
    data
  })
}
// 修改渠道
export function updateChannel(data) {
  return request({
    url: '/web/channel/update',
    method: 'post',
    data
  })
}
// 渠道列表
export function channelList(data) {
  return request({
    url: '/web/channel/list',
    method: 'post',
    data
  })
}
// 渠道详情
export function channelDetail(data) {
  return request({
    url: '/web/channel/detail',
    method: 'post',
    data
  })
}
// 申请充值或者消费票据
export function ticketChannel(data) {
  return request({
    url: '/web/channel/ticket',
    method: 'post',
    data
  })
}
// 充值或者消费
export function channelBalanceUpdate(data) {
  return request({
    url: '/web/channel/balance/update',
    method: 'post',
    data
  })
}
// 查询余额
export function channelBalance(data) {
  return request({
    url: '/web/channel/balance',
    method: 'post',
    data
  })
}
// 渠道秘钥重置
export function channelSecretReset(data) {
  return request({
    url: '/web/channel/secret/reset',
    method: 'post',
    data
  })
}