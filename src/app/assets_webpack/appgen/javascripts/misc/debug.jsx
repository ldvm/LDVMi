import debug from 'debug'

debug.enable('payola:*');

export default function(name) {
    return debug('payola:' + name);
}