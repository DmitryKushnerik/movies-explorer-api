const emailTemplate = /[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]+/;
const urlTemplate = /^https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+\.[a-zA-Z]+([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=])+#?/;

module.exports = {
  emailTemplate,
  urlTemplate,
};
