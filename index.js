import vars from '@loomat/vars'
import utils from '@loomat/utils'

import hdkey from 'hdkey'
import keccak256 from 'keccak256'
import * as bip39 from 'bip39'
import ecies from 'ecies-lite'

export default class Identity {

    constructor(pubkey) {
        if(pubkey){
            this._keypair = new hdkey()
            this._keypair.publicKey = Buffer.from(pubkey, 'base64')
        }
    }

    static async create(mn){
        const id = new Identity()
        mn ||= bip39.generateMnemonic()
        let seed = await bip39.mnemonicToSeed(mn)
        let origin = hdkey.fromMasterSeed(seed)
        id._keypair =  origin.derive(vars.derive_path.keccak)
        id._seedphrase = mn
        return Promise.resolve(id)
    }

    // static async fromMnemonic(mn){
    //     return await Identity.create(mn)
    // }

    getAddress(){
        return utils.convert(this._keypair._identifier).from('buf').to('hex')
    }

    getPublicKey(){
        return utils.convert(this._keypair.publicKey).from('buf').to('hex')
    }

    getPrivateKey(){
        return utils.convert(this._keypair._privateKey).from('buf').to('hex')
    }

    getSeedphrase(){
        return this._seedphrase
    }

    sign(msg, encoding = 'base64'){
        return this._keypair.sign(keccak256(msg)).toString(encoding)
    }

    verify(msg, signature){
        return this._keypair.verify(keccak256(msg), B64ToBuf(signature))
    }

    encrypt(msg, encoding = 'base64') {
        var crypt = ''
        var s = ecies.encrypt(this._keypair.publicKey, Buffer.from(msg))
        crypt += s.ct.toString(encoding) + ':'
        crypt += s.epk.toString(encoding) + ':'
        crypt += s.iv.toString(encoding) + ':'
        crypt += s.mac.toString(encoding)
        return crypt
    }

    decrypt(enc, encoding = 'utf8') {
        var s = enc.split(':')
        var crypt = {}
        crypt.ct = B64ToBuf(s[0])
        crypt.epk = B64ToBuf(s[1])
        crypt.iv = B64ToBuf(s[2])
        crypt.mac = B64ToBuf(s[3])

        // TODO : FIX THIS
        crypt.mac.__proto__.compare =  this._keypair._publicKey.__proto__.compare

        return ecies.decrypt(this._keypair._privateKey, crypt).toString()
    }


}
