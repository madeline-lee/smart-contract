App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
      window.ethereum.enable();
    } else {
      // Specify default instance if no web3 instance provided
  
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Property.json", function(property) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Property = TruffleContract(property);
      // Connect provider to interact with contract
      App.contracts.Property.setProvider(App.web3Provider);

      App.listenForEvents();
      return App.render();
    });
  },

  listenForEvents: function() {
    App.contracts.Property.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.PropertyCreated({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        App.render();
      });
    });
  },


  render: function() {
    var propertyInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getAccounts(function(err, accounts) {
      if (err === null) {
        $("#accountAddress").html("Your Account: " + accounts[0]);
      }
    });

    // Load property data
    App.contracts.Property.deployed().then(function(instance) {
      propertyInstance = instance;
      return propertyInstance.propertyCount();
    }).then(function(propertyCount) {
      var propertyResults = $("#propertyDetails");
      propertyResults.empty();

      for (var i = 1; i <= propertyCount; i++) {
        propertyInstance.properties(i).then(function(properties) {
          var id = properties[0];
          var status = properties[1];
          var value = properties[2];
          var owner = properties[3];

          // Render property Result
          var propertyTemplate = "<tr><th>" + id + "</th><td>" + status + "</td><td>" + value + "</td><td>" + owner + "</td></tr> "
          propertyResults.append(propertyTemplate);
        });
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  createProperty: function(){
    var propValue = $('#PropVal').val();
    var propOwner = $('#PropOwner').val();
    App.contracts.Property.deployed().then(function(instance){
      return instance.createProperty(propValue, propOwner);
    }).then(function(result){
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err){
      console.error(err);
    });
  }
};


$(function() {
  $(window).load(function() {
    App.init();
  });
});