const mongoose = require('mongoose')
const DEFAULT_MONGOOSE_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}

exports.connect = (uri, callback) => {
    return mongoose.connect(
        uri,
        DEFAULT_MONGOOSE_OPTIONS,
        callback
    )
}

exports.executeScript = async (uri, callback) => {
    const mongooseConnection = await mongoose.connect(uri, DEFAULT_MONGOOSE_OPTIONS)
    await callback(mongooseConnection.connection)
    await mongooseConnection.disconnect()
}