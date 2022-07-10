class Varint {
	constructor(name, field) {
		this.name = name;
		this.field = field;
	}
	read(reader, proto, packed) {
		if(!packed) {
			return reader.data;
		}
		return reader.readVarint().actual;
	}
}

module.exports = Varint;