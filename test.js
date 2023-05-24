import test from '@loomat/testkit'
import Identity from './index.js'

/// CASES
const SEEDPHRASE_LENGTH = 12
const ADDRESS_LENGTH = 40
const PUBKEY_LENGTH = 66
const PRIVKEY_LENGTH = 64

const seedphrase = 'problem donor disease west exact worth garage bonus worry attend own exercise'
const address = 'c7f884044b8bce01263516eb1ec98631ee99a5e8'
const publicKey = '037839f18f04838f3e5250f6289e78da001648208b5709253794561ca9ee0d3065'
const privateKey = '424cb475107939c1582917f06aeb5ffcf1a874ac013fd090a2fc2f2f000b8307'
const text = 'hello world!'
const signature = 'cFWG3mQWMggrUTFbrBSEHqA2PhfxTnqHz2xIgrCLjQBAy1BxlTpZg+3M039sydpEwDC8FfBFOfM6xkaQpdoR4g=='

var id = await Identity.create(seedphrase)
var id2 = await Identity.create()

var cases = ([
    {
        name: 'identity return seedphrase',
        fn: () => id2.getSeedphrase().split(' ').length == SEEDPHRASE_LENGTH
                    && id.getSeedphrase() == seedphrase
    },
    {
        name: 'identity return address',
        fn: () => id2.getAddress().length == ADDRESS_LENGTH
                    && id.getAddress() == address
    },
    {
        name: 'identity return public key',
        fn: () => id2.getPublicKey().length == PUBKEY_LENGTH
                    && id.getPublicKey() == publicKey
    },
    {
        name: 'identity return private key',
        fn: () => id2.getPrivateKey().length == PRIVKEY_LENGTH
                    && id.getPrivateKey() == privateKey
    },
    {
        name: 'identity sign',
        fn: () => id.sign(text) == signature
    },
    {
        name: 'identity verify signature',
        fn: () => id.verify(text, signature)
    },
    {
        name: 'identity encrypt & decrypt',
        fn: () => id.decrypt(id.encrypt(text)) == text
    },

])

test(cases)
