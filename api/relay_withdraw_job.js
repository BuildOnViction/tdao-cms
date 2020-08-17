const MongoClient = require('mongodb').MongoClient;
const Boom = require('boom');
const { PubSub } = require('@google-cloud/pubsub');
const Uuid = require('uuid');

const findJob = async function () {
	const client = await MongoClient.connect("mongodb://localhost:27017/gpcqueuejobs", {});
    const db = client.db("gpcqueuejobs");
    const collection = db.collection('tasks');

    // find notify_withdraw_tx_job
    collection
            .find({
                "SIGNATURE.name": "notify_withdraw_transaction",
                "created_at": {
		    "$lte": new Date("2020-08-12T00:00:00.000Z"),
		   // "$gte": new Date("2020-08-09T00:00:00.000Z"),
		}
            })
	    .sort({ "created_at": -1 })
            .limit(1000)
            .toArray(function (err, result) {
                result.forEach(element => {
                    console.log("result ", JSON.stringify(element)    )
			relayJob(element.SIGNATURE)
                });
            })

}

findJob()

const relayJob = async function (signature) {
    console.log(" signature ", signature)
    const key = Uuid.v4();
    signature.uuid = "task_" + key

    // Instantiates a client
    const pubsub = new PubSub({ projectId: "tomobridge" });

    // Creates the new topic
    const dataBuffer = Buffer.from(JSON.stringify(signature));
    const topic = pubsub.topic("bridge")

    const messageId = await topic.publish(dataBuffer);

    console.log(`Message ${messageId} published.`);
    return {
        uuid: signature.uuid,
        messageId: messageId
    }
}
