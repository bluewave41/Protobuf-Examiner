import PackedMessage from './types/PackedMessage';
import String from './types/String';
import Varint from './types/Varint';
import Group from './types/Group';
import LengthEncoded from './types/LengthEncoded';

const build = (proto) => {
    const keys = Object.keys(proto);
    for(const key of keys) {
        switch(proto[key].type) {
            case 'packed':
                if(proto[key].fields) {
                    const fields = build(proto[key].fields);
                    proto[key].type = new PackedMessage(null, fields);
                }
                else {
                    proto[key].type = new PackedMessage();
                }
            break;
            case 'string':
                proto[key].type = new String();
            break;
            case 'varint':
                proto[key].type = new Varint();
            break;
            case 'group':
                proto[key].type = new Group();
            break;
            case 'length-encoded':
                proto[key].type = new LengthEncoded();
            break;
        }
    }
    return proto;
}

export default { build }