const Key = require('../Key');

class String {
	constructor(name, field, options={}) {
		this.name = name;
		this.field = field;
		this.options = options;
	}
	read(reader, proto, packed) {
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
		if(!packed) {
			return proto.data;
		}
		length = reader.readVarint().actual;
		return reader.slice(reader.index, length).toString();
	}
}

module.exports = String;