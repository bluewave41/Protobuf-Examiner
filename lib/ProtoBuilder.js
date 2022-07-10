import PackedMessage from './types/PackedMessage';
import String from './types/String';
import Varint from './types/Varint';
import Group from './types/Group';

const build = (proto) => {
    const keys = Object.keys(proto);
    for(const key of keys) {
        switch(proto[key].type) {
            case 'packed':
                proto[key].type = new PackedMessage();
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
        }
    }
    return proto;
}

export default { build }