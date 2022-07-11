class Group {
    constructor(name, fields) {
        this.name = name;
        this.fields = fields;
    }
    read(reader, proto) {
        const length = reader.readVarint().actual;
        const buffer = reader.slice(reader.index, length);
        const message = {};
        let v;

        while(buffer.hasNext()) {
            const key = buffer.readVarint();

            if(!proto.fields) {
                v = buffer.parseUnknown(key);
            }
            else if(proto.fields[key.field]) {
                v = proto.fields[key.field].type.read(buffer, proto.fields[key.field], true);
            }
            message[key.field] = {
                type: key.type,
                val: v
            }
        }

        return {
            type: 'group',
            fields: message
        }
    }
}

module.exports = Group;