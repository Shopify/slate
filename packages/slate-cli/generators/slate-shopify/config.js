module.exports = {
  questions: function(generator) {
    return [
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for your new theme',
        default: generator.name
      },
      {
        type: 'input',
        name: 'storeurl',
        message: 'Enter development store URL',
        default: '<my-store-name>.myshopify.com'
      },
      {
        type: 'input',
        name: 'token',
        message: 'Enter your access token ...instructions here...',
        default: 'REQUIRED'
      },
      {
        type: 'input',
        name: 'apikey',
        message: 'Enter your api key ...instructions here...',
        default: 'REQUIRED'
      }
    ];
  }
};
