// jshint esversion:6 

exports.getDate = function () {
    // logic code 
    const today = new Date();

    const options = {
        weekday: "long",
        day: "numeric", 
        month: "long"
    };

    return today.toLocaleDateString("en-US", options);
}

exports.getDay = function () {
    // logic code 
    const today = new Date();

    const options = {
        weekday: "long",
    };

    return today.toLocaleDateString("en-US", options);

}

// console.log(module.exports);
