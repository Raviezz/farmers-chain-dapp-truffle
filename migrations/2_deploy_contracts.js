var Farmers = artifacts.require("./Farmers.sol");

module.exports = function (deployer) {
  deployer.deploy(Farmers);
};