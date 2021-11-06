const DracmaToken = artifacts.require("DracmaToken");

module.exports = function (deployer) {
  deployer.deploy(DracmaToken);
};
