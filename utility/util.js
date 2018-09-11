module.exports = {
/*****
 * Replace Undefined values with empty string.
 */
    replaceUndefined: function replaceUndefined(value) {
        if (typeof value == 'undefined') {
            value = '';
        }
        return value;
    }
};