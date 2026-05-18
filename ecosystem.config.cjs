module.exports = {
  apps: [
    {
      name: 'nyl-agent-360',
      script: 'npx',
      args: 'wrangler pages dev dist --ip 0.0.0.0 --port 3000 --compatibility-date=2025-12-02',
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
