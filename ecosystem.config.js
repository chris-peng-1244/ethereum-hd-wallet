module.exports = {
    apps : [
        {
            name      : 'Ethereum',
            script    : 'lib/index.js',
            output: 'logs/wallet-out.log',
            error: 'logs/wallet-error.log',
            env: {
                watch: ['lib'],
                NODE_ENV: 'development'
            },
            env_production : {
                watch: false,
                NODE_ENV: 'production'
            },
        },
        {
            name: 'Watch Ethereum',
            output: 'logs/watch-ethereum.log',
            error: 'logs/watch-ethereum.log',
            script: 'lib/commands/watchNewTransactions.js',
        },
        {
            name: 'Watch Withdraw',
            output: 'logs/withdraw.log',
            error: 'logs/withdraw.log',
            script: 'lib/commands/watchWithdraw.js',
        },
    ],

    deploy : {
        production : {
            user : 'node',
            host : '212.83.163.1',
            ref  : 'origin/master',
            repo : 'git@github.com:repo.git',
            path : '/var/www/production',
            'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
        }
    }
};
