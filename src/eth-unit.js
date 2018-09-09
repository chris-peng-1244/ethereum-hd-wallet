import {utils} from 'web3';

function fromWei(value) {
    return utils.fromWei(value.toString(), 'ether');
}

function toWei(value) {
    return parseInt(utils.toWei(value.toString(), 'ether'));
}

export {
    fromWei,
    toWei,
}
