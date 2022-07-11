const Key = require('../Key');

class String {
	constructor(name, field, options={}) {
		this.name = name;
		this.field = field;
		this.options = options;
	}
	read(reader, proto) {
		let strs = [];
		let length;
		if(this.options.repeating) {
			while(reader.hasNext()) {
				reader.readVarint();
				length = reader.readVarint().actual;
				strs.push(reader.slice(reader.index, length).toString());
			}
			return strs;
		}
		length = reader.readVarint().actual;

		return {
			type: 'string',
			val: reader.slice(reader.index, length).toString()
		}
	}
}

module.exports = String;