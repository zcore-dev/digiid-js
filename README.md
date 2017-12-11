# DigiID

This is the javascript implementation of the DigiID authentication protocol.
Checkout the original Ruby version at https://github.com/digiid/digiid-ruby

Basically, what the module does is build a message challenge and verifying the signature.

## Installation

Add this line to your application's package.json dependencies:

    'digiid': 'latest'

Or install it yourself as:

    $ npm install digiid

## Usage

### Challenge

To build a challenge, you need to initialize a `DigiID` object with a `nonce` and a `callback`.

```
var digiid = new DigiID({nonce:nonce, callback:callback});
```

`nonce` is a random string associated with the user's session id.
`callback` is the url without the scheme where the wallet will post the challenge's signature.

One example of callback could be `www.site.com/callback`. A callback cannot have parameters. By
default the POST call will be done using `https`. If you need to tell the wallet to POST on
`http` then you need to add `unsecure:true`.

```
var digiid = new DigiID({nonce:nonce, callback:callback, unsecure:true});
```

Once the `DigiID` object is initialized, you have access to the following methods :

```
digiid.uri
```

This is the uri which will trigger the wallet when clicked (or scanned as QRcode). For instance :

```
digiid://digiid-demo.herokuapp.com/callback?x=987f20277c015ce7
```

If you added `unsecure:true` when initializing the object then uri will be like :

```
digiid://digiid-demo.herokuapp.com/callback?x=987f20277c015ce7&u=1
```

To get the uri as QRcode :

```
digiid.qrcode
```

This is actualy an URL pointing to the QRcode image.

### Verification

When getting the callback from the wallet, you must initialize a `DigiID` object with the received 
parameters `address`, `uri`, `signature` as well as the excpected `callback` :

```
var digiid = new DigiID(address:address, uri:uri, signature:signature, callback:callback);
```

You can after call the following methods :

```
digiid.nonce
```

Return the `nonce`, which would get you the user's session.

```
digiid.uriValid()
```

Returns `true` if the submitted URI is valid and corresponds to the correct `callback` url.

```
digiid.signatureValid()
```

If returns `true`, then you can authenticate the user's session with `address` (public Bitcoin
address used to sign the challenge).


## Integration example

JavaScript application using the digiid lib: https://github.com/porkchop/digiid-js-demo

Live demonstration: http://digiid-js-demo.herokuapp.com/

## In the Wild

The following projects use digiid-js.

If you are using digiid-js in a project, app, or module, get on the list below
by getting in touch or submitting a pull request with changes to the README.

### Startups & Apps

- [Decryptocoin](http://decryptocoin.com/)

## Author
Aaron Caswell
aaron@captureplay.com

## Credits
Eric Larchevêque (The creator of the DigiID protocol and the original Ruby gem this code is based on)
elarch@gmail.com

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
