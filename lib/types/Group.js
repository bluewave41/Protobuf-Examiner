class Group {
    constructor(name, fields) {
        this.name = name;
        this.fields = fields;
    }
    read(reader, proto) {
        const length = reader.readVarint().actual;
        const buffer = reader.slice(reader.index, length);
        const message = {};

        while(buffer.hasNext()) {
            const key = buffer.readVarint();

            if(proto.fields[key.field]) {
                const v = proto.fields[key.field].read(buffer, proto.fields[key.field], true);
                message[proto.fields[key.field].name] = v;
            }
            else {
                //unknown
            }
        }

        return message;
    }
}

module.exports = Group;