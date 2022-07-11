class Varint {
	constructor(name, field) {
		this.name = name;
		this.field = field;
	}
	read(reader, proto) {
		return {
			type: 'varint',
			val: reader.readVarint().actual
		}
	}
}

module.exports = Varint;