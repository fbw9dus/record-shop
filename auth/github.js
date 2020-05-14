
const { GITHUB_CLIENT, GITHUB_SECRET } = process.env;
const { Strategy } = require('passport-github');

const Config = {
  clientID:     GITHUB_CLIENT,
  clientSecret: GITHUB_SECRET
};

const filterProfile = (profile)=> ({
  id:          profile.id,
  provider:    profile.provider,
  displayName: profile.displayName,
  imageURL:    profile.photos[0].value,
});

module.exports = { Strategy, Config, filterProfile }
