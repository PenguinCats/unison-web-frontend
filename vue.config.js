module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9500', // API服务器的地址
        ws: true, // 代理websockets
        changeOrigin: true, // 虚拟的站点需要更管origin
      },
    },
  },
};
