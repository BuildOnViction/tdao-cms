import {createSelector} from "reselect";

const getBrokerJob = (state) => state.brokers.job_broker;

export const getBrokerJobState = createSelector(
    getBrokerJob,
    (broker) =>  broker.name
    )

const getListBroker = (state) => state.brokers.list_broker;

export const getListBrokerState = createSelector(
    getListBroker,
    (broker) => broker
)