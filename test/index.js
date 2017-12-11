
/**
 * Module dependencies.
 */

var DigiID = require('../')
  , should = require('should');

DigiID.version.should.match(/^\d+\.\d+\.\d+$/);

describe('DigiID', function() {
  var nonce ='fe32e61882a71074';
  var callback = 'http://localhost:3000/callback';
  var uri = 'digiid://localhost:3000/callback?x=fe32e61882a71074';
  var address = '1HpE8571PFRwge5coHiFdSCLcwa7qetcn';
  var signature = 'IPKm1/EZ1AKscpwSZI34F5NiEkpdr7QKHeLOPPSGs6TXJHULs7CSNtjurcfg72HNuKvL2YgNXdOetQRyARhX7bg=';

  describe('#qrcode', function() {
    it('should build a qrcode', function() {
      var digiid = new DigiID({nonce:nonce, callback:callback});

      var uri_encoded = escape(digiid.uri);
      ('http://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=' + uri_encoded).should.equal(digiid.qrcode);
    });
  });

  describe('#buildURI', function() {
    it('_uri components', function() {
      var digiid = new DigiID({nonce:nonce, callback:callback});

      should.exist(digiid._uri);
      'digiid:'.should.equal(digiid._uri.protocol);
      'localhost'.should.equal(digiid._uri.hostname);
      digiid._uri.port.should.eql(3000);
      '/callback'.should.equal(digiid._uri.path);
      digiid._uri.href.should.equal(uri);

      nonce.should.equal(digiid._uri.query['x']);
    });

    it('uri string format', function() {
      var digiid = new DigiID({nonce:nonce, callback:callback});

      digiid.uri.should.match(/^digiid\:\/\/localhost\:3000\/callback\?x=[a-z0-9]+$/);
    });

    it('uri string format with unsecure param', function() {
      var digiid = new DigiID({nonce:nonce, callback:callback, unsecure:true});

      digiid.uri.should.match(/^digiid\:\/\/localhost\:3000\/callback\?x=[a-z0-9]+&u=1$/);
    });
  });

  describe('#uriValid', function() {
    it('should accept a valid uri', function() {
      var digiid = new DigiID({address:address, uri:uri, signature:signature, callback:callback});

      digiid.uriValid().should.be.ok;
    });

    it('should fail a bad uri', function() {
      var digiid = new DigiID({address:address, uri:'garbage', signature:signature, callback:callback});

      digiid.uriValid().should.not.be.ok;
    });

    it('should fail a bad protocol', function() {
      var digiid = new DigiID({address:address, uri:'http://localhost:3000/callback?x=fe32e61882a71074', signature:signature, callback:callback});

      digiid.uriValid().should.not.be.ok;
    });

    it('should fail an invalid callback url', function() {
      var digiid = new DigiID({address:address, uri:'site.com/callback?x=fe32e61882a71074', signature:signature, callback:callback});

      digiid.uriValid().should.not.be.ok;
    });
  });

  describe('#signatureValid', function() {
    it('should verify a valid signature', function() {
      var digiid = new DigiID({address:address, uri:uri, signature:signature, callback:callback});

      digiid.signatureValid().should.be.ok;
    });

    it('should not verify an invalid signature', function() {
      var digiid = new DigiID({address:address, uri:uri, signature:'garbage', callback:callback});

      digiid.signatureValid().should.not.be.ok;
    });

    it('should not verify mismatched signature and text', function() {
      var digiid = new DigiID({address:address, uri:uri, signature:'H4/hhdnxtXHduvCaA+Vnf0TM4UqdljTsbdIfltwx9+w50gg3mxy8WgLSLIiEjTnxbOPW9sNRzEfjibZXnWEpde4=', callback:callback});

      digiid.signatureValid().should.not.be.ok;
    });
  });

  describe('#nonce', function() {
    it('should extract the nonce', function() {
      var digiid = new DigiID({address:address, uri:uri, signature:signature, callback:callback});

      digiid.nonce.should.equal('fe32e61882a71074');
    });
  });

  describe('#testnet', function() {
    it('should create a valid signature on testnet', function() {
      var digiid = new DigiID({
        address:'mpsaRD2ugdCY1iFrQdsDYRT4qeZzCnvGHW', 
        uri:'digiid://digiid.bitcoin.blue/callback?x=3893a2a881dd4a1e&u=1',
        signature:'ID5heI0WOeWoryGhZHaxoOH5vkmmcwDsfc4nDQ5vPcXSWh2jyETDGkSNO5zk4nbESGD6k0tgFxYA3HzlEGOf5Uc=',
        callback:'http://digiid.bitcoin.blue/callback'
      });
      digiid.signatureValid().should.be.ok;
    });
  });
});