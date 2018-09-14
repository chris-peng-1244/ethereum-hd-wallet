#! /bin/bash
mnemonic=$1
sed "s/ETHEREUM_WALLET_MNEMONIC=\".*\"/ETHEREUM_WALLET_MNEMONIC=\"$mnemonic\"/" .env > .env.tmp && mv .env.tmp .env
