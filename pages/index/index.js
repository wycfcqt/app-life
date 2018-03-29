//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    weekList: [
      { name: 'Sunday', value: '日' },
      { name: 'Monday', value: '一' },
      { name: 'Tuesday', value: '二' },
      { name: 'Wednesday', value: '三' },
      { name: 'Thursday', value: '四' },
      { name: 'Friday', value: '五' },
      { name: 'Saturday ', value: '六' }
    ],
    yearRange: 10,
    curYear: 0,
    curMonth: 0,
    curDay: 0,
    times: [],
    years: [],
    months: [],
    active: 0
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    const curYear = new Date().getFullYear() // 获取当前年
    const curMonth = new Date().getMonth()  // 获取当前月
    const curDay = new Date().getDate() // 天
    this.calendars(curYear, curMonth, curDay)
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 是否是闰年
  isLeapYear(year) {
    return ((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0))
  },
  // 获取某个月的天数
  monthDays(year, month) {
    return [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (this.isLeapYear(year) ? 29 : 28)
  },
  // 获取某天是 某年 的第几周
  getWeek (y, m ,d) {
    const now = new Date(y, m, d)
    const year = now.getFullYear()
    const month = now.getMonth()  
    let day = now.getDate() 
    // 那一天是那一年中的第多少天
    for (let i = 0; i < month; i++) {
      day += this.monthDays(year, i)
    }
    // 那一年第一天是星期几 0-sunday 6-saturday
    const yearFirstDay = new Date(year, 0, 1).getDay() || 7
    let week = 0
    if (yearFirstDay === 1) {
      week = Math.ceil(day / 7)
    } else {
      day -= (7 - yearFirstDay +  1)
      week = Math.ceil(day / 7) + 1
    }
    return {year, month: month + 1, week, day}
  },
  // 返回某天是 某年某月 的第几周, 当月1日输入上周，则记入上周
  getWeeks(y, m, d) {
    const now = new Date(y, m, d)
    const year = now.getFullYear()
    let week = Math.ceil(now.getDate() / 7);
    let month = now.getMonth() + 1;
    // 判断这个月前7天是周几，如果不是周一，则计入上个月
    if (now.getDate() < 7) {
      if (now.getDay() !== 1) {
        week = 5
        month = now.getMonth()
      }
    }
    return {year, month, week}
  },
  // 获取星座
  getSign(month, day) {
    const str = '摩羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手摩羯'
    var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22]
    return str.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2)
  },
  calendars(year, month = this.data.curMonth, day = new Date().getDate()) {
    const curDate = new Date(year, month, day) //不可变化
    let curYear = curDate.getFullYear()
    let curMonth = curDate.getMonth()
    let curDay = curDate.getDate()
    let dayArr = []
    // 动态活得年份
    const years = [], months = []
    for (let m = curYear - this.data.yearRange; m <= curYear + this.data.yearRange; m++) {
      years.push({ name: m + '年', year: m })
    }
    //月份范围
    for (let j = 1; j <= 12; j++) {
      months.push({ name: (curYear + '年' + j + '月'), month: j });
    }
    let diff = 1 - curDate.getDay()
    if (diff == 1) {
      diff = -6
    }
    curDate.setDate(diff) // 日历的起始日期  
    // 42个格子    
    for (let i = 0; i < 42; i++) {
      let another = false
      let now = false
      let date = curDate.getDate()
      if (curDate.getMonth() !== curMonth) {//不是同一个月的时间 
        another = true
      }
      if (date === curDay) {
        now = true
      }
      dayArr.push({ date: [curDate.getFullYear(), curDate.getMonth() + 1, date], day: date, another, now, index: i })
      curDate.setDate(date + 1)
    }
    this.data.times = dayArr
    const yearWeek = this.getWeek(curYear, curMonth, curDay)
    const monthWeek = this.getWeeks(curYear, curMonth, curDay)
    const sign = this.getSign(curMonth, curDay)
    console.log(yearWeek, monthWeek)
    this.setData({
      curYear,
      curMonth,
      curDay,
      years,
      months,
      times: dayArr,
      dataTime: curYear + '年' + (curMonth + 1) + '月',
      yearWeek,
      monthWeek,
      sign,
      active: curDay
    })
  },
  // 选择年份
  chooseYear(e) {
    const index = parseInt(e.detail.value || 0)
    this.calendars(this.data.years[index].year)
  },
  // 选择月份
  chooseMonth(e) {
    console.log(this.data.months, e)
    let index = parseInt(e.detail.value || 0)
    this.calendars(this.data.curYear, this.data.months[index].month - 1)
  },
  // 月份加减
  handleMonth(e) {
    const isPrev = e.currentTarget.dataset.handle === 'prev' ? true : false
    if (isPrev) {
      this.data.curMonth -= 1
      this.calendars(this.data.curYear, this.data.curMonth)
    } else {
      this.data.curMonth += 1
      this.calendars(this.data.curYear, this.data.curMonth)
    }
  },
  showTime(e) {
    const data = e.currentTarget.dataset
    const time = data.date
    const activeDate = new Date(time)
    const yearWeek = this.getWeek(time[0], time[1] - 1, time[2])
    const monthWeek = this.getWeeks(time[0], time[1] - 1, time[2])
    const sign = this.getSign(time[1] - 1, time[2])
    this.setData({
      yearWeek,
      monthWeek,
      sign,
      curDay: time[2],
      active: activeDate.getDate()
    })
    wx.showModal({
      content: '<view>这里是内容</view>'
    })
  }
})
