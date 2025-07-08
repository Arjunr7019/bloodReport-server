const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    ip: String,
    headers: Object,
    body: Object,
    method: String,
    url: String,
    status: Number,
    responseTime: Number,
    timestamp: { type: Date, default: Date.now }
});

const Log = mongoose.model('Blood-report-Log', logSchema);

module.exports = function saveLogToMongo(tokens, req, res) {
    const logEntry = new Log({
        ip: req.headers['x-forwarded-for']?.split(',').shift() || // for proxies
            req.socket?.remoteAddress ||
            req.ip === '::1' ? '127.0.0.1' : req.ip,
        headers: req.headers,
        body: req.body,
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: parseInt(tokens.status(req, res), 10),
        responseTime: parseFloat(tokens['response-time'](req, res))
    });

    logEntry.save().catch(err => console.error('MongoDB log error:', err));

    return null; // Prevents output to console
};