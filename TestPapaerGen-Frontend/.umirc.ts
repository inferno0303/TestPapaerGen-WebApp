import { defineConfig } from 'umi';

export default defineConfig({
  history: {
    type: 'hash'
  },
  routes: [
    {
      path: '/',
      component: '@/layouts/index',
      routes: [

        // 登陆
        { path: '/',  exact: true, component: '@/pages/login' },
        { path: '/login',  exact: true, redirect: '/' },

        // 管理员
        {exact: true, path: '/admin', component: '@/pages/admin'},

        // 用户
        {exact: true, path: '/home', component: '@/pages/home'},
        {exact: true, path: '/questionBank', component: '@/pages/questionBank'},
        {exact: true, path: '/questionEdit', component: '@/pages/questionEdit'},
        {exact: true, path: '/questionGenerator', component: '@/pages/questionGenerator'},
        {exact: true, path: '/questionGenHistory', component: '@/pages/questionGenHistory'}
      ]
    }
  ],
  plugins: [],
});
