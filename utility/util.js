module.exports = {
/*****
 * Replace Undefined values with empty string.
 */
    replaceUndefined: function replaceUndefined(value) {
        if (typeof value == 'undefined') {
            value = '';
        }
        return value;
    },

    generateUserId: function generateUserId(value) {
        if(value == "")
        provider = "normal";
        var timestamp = Date.now();
        var user_id = provider+"_"+timestamp;
        return user_id;
    }
};