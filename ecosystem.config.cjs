module.exports = {
  apps: [
    {
      name: 'wt-frontend',
      script: 'yarn',
      args: 'build',
      type: 'module'
    }
  ],
  deploy: {
    staging: {
      user: 'ubuntu',
      host: '18.118.67.255',
      ref: 'origin/staging',
      repo: 'git@github.com:angel82800/Watertower_frontend.git',
      path: '/home/ubuntu/wt_frontend_app',
      'post-deploy': 'git reset && git pull && npm install && npm run build'
    },
    prod: {
      user: 'ubuntu',
      host: '3.134.162.56',
      ref: 'origin/main',
      repo: 'git@github.com:angel82800/Watertower_frontend.git',
      path: '/home/ubuntu/wt_frontend_app',
      'post-deploy': 'git reset && git pull && npm install && npm run build'
    }
  }
}
