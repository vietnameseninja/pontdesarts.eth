var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var InternetWall = artifacts.require("./InternetWall.sol");

module.exports = function(deployer) {
  // deployer.deploy(SimpleStorage, {
  //   gas: 4500000
  // });
  deployer.deploy(InternetWall, {
    gas: 4500000
  });
};
