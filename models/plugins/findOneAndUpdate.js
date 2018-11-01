
module.exports = function(schema){
    schema.post('findOneAndUpdate', function (doc, next) {
        let now = Date.now();
        doc.set('updatedAt', now);
        next();
    });
    
}