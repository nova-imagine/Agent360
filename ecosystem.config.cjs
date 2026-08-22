module.exports = {
  apps: [
    {
      name: 'nyl-agent-360',
      script: 'server.cjs',
      interpreter: 'node',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
