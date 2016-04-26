var Promise = require('bluebird');
var read = require('read');

module.exports.getConfirmed = function() {
  return new Promise(function(resolve, reject) {
    read({prompt: 'pass phrase: ', silent: true}, function(error, password1) {
      if (error) return reject(error);
      read({prompt: 'repeat it: ', silent: true}, function(error, password2) {
        if (error) return reject(error);
        if (password1 !== password2) return reject (new Error('non matching phrases'));
        resolve(password1);
      });
    });
  });
};


module.exports.get = function() {
  return new Promise(function(resolve, reject) {
    read({prompt: 'pass phrase: ', silent: true}, function(error, password) {
      if (error) return reject(error);
      resolve(password);
    });
  });
};
