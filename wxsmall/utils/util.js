const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 获取元素索引
function getArrInd(arr, val, name) {
  if (typeof arr[0] == 'object') {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][name] == val) {
        return i
        break;
      }
    }
  } else {
    return arr.indexOf(val)
  }
}

module.exports = {
  formatTime: formatTime,
  getArrInd: getArrInd
}
