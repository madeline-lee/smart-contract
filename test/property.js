var Property = artifacts.require("./Property.sol");

contract ("Property", function(accounts) {

    var propertyInstance;
  
    it("initializes with 1 property", function() {
      return Property.deployed().then(function(instance) {
        return instance.propertyCount();
      }).then(function(count){
        assert.equal(count, 1);
      });
    });

    it("it initializes the property with the correct values", function() {
        return Property.deployed().then(function(instance) {
        propertyInstance = instance;
          return propertyInstance.properties(1);
        }).then(function(properties) {
          assert.equal(properties[0], 1, "contains the correct id");
          assert.equal(properties[1], 0, "contains the status");
          assert.equal(properties[2], 1010, "contains the correct value");
          assert.equal(properties[3], 0x03068a598062B50B8CB011d47f079b6D105D6E6F, "contains the correct address");
        });
    });

    // it("allows a users to add propery", function() {
    //     return Property.deployed().then(function(instance) {
    //       propertyInstance = instance;
    //       propId = 1;
    //       return propertyInstance.createProperty(propId, { from: accounts[0] });
    //     }).then(function(receipt) {
    //       assert.equal(receipt.logs.length, 1, "an event was triggered");
    //       assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
    //       assert.equal(receipt.logs[0].args.propId.toNumber(), propId, "the candidate id is correct");
    //       return propertyInstance.voters(accounts[0]);
    //     }).then(function(createProperty) {
    //       assert(created, "the voter was marked as voted");
    //       return propertyInstance.properties(propId);
    //     }).then(function(properties) {
    //       assert.equal(user, true, "increments the candidate's vote count");
    //     })
    //   });


});