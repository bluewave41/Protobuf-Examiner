const ProtobufReader = require('../ProtobufReader');

class PackedMessage {
	constructor(name, fields) {
		this.name = name;
        this.fields = fields;
        this.rawType = 'packed';
	}
	read(reader, proto) {
        const messages = [];

        while(reader.hasNext()) {
            const length = reader.readVarint().actual;
            const buffer = reader.slice(reader.index, length);
            const message = {};
            
            while(buffer.hasNext()) {
                const key = buffer.readVarint();

				if(!proto.fields) {
					const v = buffer.parseUnknown(key);
                    message[key.field] = v;
				}
                else if(proto.fields[key.field]) {
                    const v = proto.fields[key.field].read(buffer, proto.fields[key.field], true);
                    message[proto.fields[key.field].name] = v;
                }
            }

            messages.push(message);
        }

        return messages;
	}
}

module.exports = PackedMessage;