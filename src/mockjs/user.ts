import { User } from "../types/user";
import { Result } from "../types/result";

let user: User = {
  'userId': '1992',
  'username': 'admin',
}

const menus = [
  
  {
    id: '/system',
    icon: "layui-icon-set",
    title: '系统管理',
    children: [
      {
        id: '/system/user',
        icon: "layui-icon-user",
        title: '用户管理',
      },
      {
        id: '/system/traderProfiles',
        icon: "layui-icon-user",
        title: '交易者档案管理',
      },
      {
        id: '/system/video',
        icon: "layui-icon-video",
        title: '视频管理',
      },
      {
        id: '/system/documents',
        icon: "layui-icon-file",
        title: '文档管理',
      },
      {
        id: '/system/aiStockPicker',
        icon: "layui-icon-android",
        title: 'AI股票选股',
      },
      {
        id: '/system/announcement',
        icon: "layui-icon-notice",
        title: '公告管理',
      },
      {
        id: '/system/contactRecord',
        icon: "layui-icon-dialogue",
        title: '联系记录管理',
      },
      {
        id: '/system/membershipLevel',
        icon: "layui-icon-diamond",
        title: '会员等级管理',
      },
      {
        id: '/system/trade',
        icon: "layui-icon-rmb",
        title: '交易管理',
      },
      {
        id: '/system/tradingStrategies',
        icon: "layui-icon-star",
        title: '交易策略管理',
      },
      {
        id: '/system/leaderboardTraders',
        icon: "layui-icon-ranking",
        title: '交易员排行榜管理',
      }
    ]
  },

]

const getInfo = (req: any, res: any) => {
  let result: Result = {
    code: 200,
    msg: "操作成功",
    data: user,
    success: true
  }
  return result;
}

const getPermission = (req: any, res: any) => {
  let result: Result = {
    code: 200,
    msg: "操作成功",
    data: ['sys:user:add', 'sys:user:edit', 'sys:user:delete', 'sys:user:import', 'sys:user:export'],
    success: true
  }
  return result;
}

const getMenu = (req: any, res: any) => {
  let result: Result = {
    code: 200,
    msg: "操作成功",
    data: menus,
    success: true
  }
  return result;
}

const getLogin = (req: any, res: any) => {
  let item = JSON.parse(req.body);
  let account = item.account;
  let password = item.password;
  if (account === 'admin' && password === '123456') {
    return {
      'code': 200,
      'msg': '登陆成功',
      'data': {
        'userId': '35002',
        'token': 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOiJhZG1pbiIsInVzZXJOYW1lIjoiYWRtaW4iLCJvcmdDb2RlIjoiMzUwMDAiLCJkZXB0Q29kZSI6IjM1MDAwIiwiYXVkIjoiYWRtaW4iLCJpc3MiOiJhZG1pbiIsImV4cCI6MTU5MzUzNTU5OH0.0pJAojRtT5lx6PS2gH_Q9BmBxeNlgBL37ABX22HyDlebbr66cCjVYZ0v0zbLO_9241FX9-FZpCkEqE98MQOyWw',
      }
    }
  } else {
    return {
      'code': 500,
      'msg': '登陆失败,账号密码不正确'
    }
  }
}

const getUpload = (req: any, res: any) => {
  return {
    'code': 200,
    'msg': '上传成功',
    'success': true
  }
}

export default {
  getInfo, getMenu, getLogin, getPermission, getUpload
}