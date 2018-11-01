const env = process.env.NODE_ENV || "dev";
const dev = {
    db: "product_test",
    mongoPort: 27017,
    dbUrl: "mongodb://localhost",
    forexApiKey: "ADiUyRpH9QBqpLE3tlBz3drfEi5IojnD",
    forexUrl: "https://forex.1forge.com/1.0.3/"
}

const config = {
    dev
};

module.exports = config[env];