module.exports = {
	roundToPrecision: function(value, decimals) {
		const pow = Math.pow(10, decimals);
		return Math.round((value + Number.EPSILON) * pow) / pow;
    },
    rnd: function(len, chars='abcdef0123456789') {
        return [...Array(len)].map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    } ,
    chunk: function(array, size) {
        const chunks = [];
        for(var i=0;i<array.length;i+=size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    },
    getSubField: function(fields, key) {
        if(!key) {
            return null;
        }
        const split = key.split('_');
        let field = fields[split[0]];
        for(var i=1;i<split.length;i++) {
            field = field.fields[split[i]];
        }
        return field;
    }
}