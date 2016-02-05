var i = 0;

var hello = function(callback) {
    var id = setInterval(function() {
        i += 1;
        if (i > 5) {
            callback();
            clearInterval(id);
        }
    }, 1000);
};

hello(function() {
    console.log('done');
});
