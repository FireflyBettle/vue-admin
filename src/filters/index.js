// src/filters/index.js  
import { parseTime } from '@/utils/index'
 
export function timeFormat(time, format) {
  return parseTime(time, format)
}