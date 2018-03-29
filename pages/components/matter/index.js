// pages/components/matter/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    name: '',
    content: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 提交待办事项
    formSubmit(e) {
      console.log(1)
    },
    // 取消表单
    formReset(e) { },
    // 是否提醒
    switchMind(e) {
      if (e.detail.value) {
        wx.showActionSheet({
          itemList: ['A', 'B', 'C'],
          success: function (res) {
            console.log(res.tapIndex)
          },
          fail: function (res) {
            console.log(res.errMsg)
          }
        })
      }
    }
  }
})
