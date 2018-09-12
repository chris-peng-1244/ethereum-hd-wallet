const config = {
    ETHEREUM_PROVIDER: process.env.ETHEREUM_PROVIDER || 'http://localhost:7545',
    ETHEREUM_WALLET_MNEMONIC: process.env.ETHEREUM_WALLET_MNEMONIC || '',
    ETHEREUM_WALLET_COLLECT_LIMIT: process.env.ETHEREUM_WALLET_COLLECT_LIMIT || 5,
};

export default config;
