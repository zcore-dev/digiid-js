
/*!
 * DigiID
 * Copyright(c) 2014 Aaron Caswell <aaron@captureplay.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

const Message = require('digibyte-message');
const url = require('url');
const SCHEME = 'digiid:'
const PARAM_NONCE = 'x'
const PARAM_UNSECURE = 'u';


/**
* Expose `DigiID`.
*/

module.exports = Digiid;

/**
* Initialize a new `DigiID` with the given `params`
*
* @param {JSON} params
* @api public
*/

function Digiid(params) {
params = params || {};
var self = this;

this._nonce = params.nonce;
this.callback = url.parse(params.callback, true);
this.signature = params.signature;
this.address = params.address;
this.unsecure = params.unsecure;
this._uri = !params.uri ? buildURI() : url.parse(params.uri, true);

function buildURI() {
  var uri = self.callback;
  uri.protocol = SCHEME;
  var params = {};
  params[PARAM_NONCE] = self._nonce;
  if(self.unsecure) params[PARAM_UNSECURE] = 1;
  uri.query = params;
  uri.href = url.format(uri);

  return uri;
}
}

/**
* Library version.
*/

Digiid.version = require('../package').version;

Digiid.prototype.uriValid = function() {
var uri = this._uri;
var callback = this.callback;
return !!uri && uri.protocol === SCHEME && uri.hostname === callback.hostname && uri.pathname === callback.pathname && !!uri.query[PARAM_NONCE];
};

Digiid.prototype.signatureValid = function() {
try {
  return Message(this.uri).verify(this.address, this.signature);
}
catch(e) {
  return false;
}
};

Digiid.prototype.__defineGetter__('qrcode', function() {
return 'http://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=' + escape(this.uri);
});

Digiid.prototype.__defineGetter__('uri', function() {
return url.format(this._uri);
});

Digiid.prototype.__defineGetter__('nonce', function() {
return this._uri.query[PARAM_NONCE];
});