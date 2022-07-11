class LengthEncoded {
	constructor(name, field) {
		this.name = name;
		this.field = field;
	}
	read(reader, proto) {
        const length = reader.readVarint().actual;
        
        return {
            type: 'length-encoded',
            val: reader.slice(reader.index, length)
        }
	}
}

module.exports = LengthEncoded;