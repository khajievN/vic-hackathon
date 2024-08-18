import {InjectedConnector} from "@web3-react/injected-connector";
import {KaikasConnector} from "kaikas-connector";
import {KlipConnector} from "klip-connector";

export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 1001, 137]
});

export const kaikasConnector = new KaikasConnector({
    supportedChainIds: [1001, 8217]
});

export const klipConnector = new KlipConnector({
    supportedChainIds: [1001, 8217]
});