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
            const packedLength = reader.readVarint().actual;
            const buffer = reader.slice(reader.index, packedLength);
            
            while(buffer.hasNext()) {
                const message = {};
                const messageLength = buffer.readVarint().actual;
                const messageBuffer = buffer.slice(buffer.index, messageLength);

                while(messageBuffer.hasNext()) {
                    const key = messageBuffer.readVarint();

                    if(!proto.fields) {
                        const v = messageBuffer.parseUnknown(key);
                        message[key.field] = v;
                    }
                    else if(proto.fields[key.field]) {
                        const v = proto.fields[key.field].type.read(messageBuffer, proto.fields[key.field], true);
                        message[key.field] = v;
                    }
                }
                messages.push(message);
            }
        }

        return messages;
	}
}

module.exports = PackedMessage;