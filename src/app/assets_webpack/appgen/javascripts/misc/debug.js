import debug from 'debug'

debug.enable('ldvmi:*');

export default function(name) {
    return debug('ldvmi:' + name);
}