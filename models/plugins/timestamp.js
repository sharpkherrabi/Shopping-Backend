module.exports = function (schema) {
    schema.add({
        createdAt: Date,
        updatedAt: Date
    });

    schema.pre('save', function (next) {
        let now = Date.now();
        this.set('updatedAt', now);

        if (!this.get('createdAt')) {
            this.set('createdAt', now);
        }
        next();
    });
}