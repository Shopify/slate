module.exports = [
  {
    type: 'confirm',
    name: 'tracking',
    message:
      'Do you wish to participate in developer analytics to help make Slate better?',
    default: true,
  },
  {
    type: 'input',
    name: 'email',
    message:
      '(optional) Provide your email if you wish to receive updates about the lastest features of Slate: ',
    filter: input => {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(input).toLowerCase()) ? input : null;
    },
  },
];
