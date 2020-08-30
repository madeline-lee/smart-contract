pragma solidity ^0.5.16;

contract Property{
    //Model a house: id, value, account
    enum Status {Pending, Sold}
    struct PropertyDetails {
        uint PropId;
        Status status;
        uint value;
        address currOwner;
    }
    //Store houses
    //Fetch houses
    mapping(uint => PropertyDetails) public properties;
    mapping(uint => address) public propOwnerChange;
    mapping(address => bool) public users;
    //Store house count
    uint public propertyCount;

    event PropertyCreated(
        uint indexed _value,
        address indexed _currOwner
    );

    modifier onlyOwner(uint _propId){
        require(properties[_propId].currOwner == msg.sender);
        _;
    }

    //Constructor 
    constructor () public {
        createProperty(1010, 0x03068a598062B50B8CB011d47f079b6D105D6E6F);
    }

    //A. Create Property
    function createProperty(uint _value, address _currOwner) public {
        propertyCount ++;
        users[msg.sender] = true;
        properties[propertyCount] = PropertyDetails(propertyCount, Status.Pending, _value, _currOwner);
        emit PropertyCreated(_value, _currOwner);
    }

    //B. Change Ownership
    function changeOwnership(uint _propId, address _newOwner) public {
        require(properties[_propId].currOwner != _newOwner);
		require(properties[_propId].status == Status.Pending);
		propOwnerChange[_propId] = _newOwner;
        properties[_propId].status = Status.Sold;
    }

    //C. GET property details of an address
    function getProperty(uint _currOwner) public view returns (uint) {
        require(properties[_currOwner].status == Status.Pending);
        return (properties[_currOwner]);
    }
    
    //D.GET property details using ID and address
    function getPropertywithId(uint _propId, address _currOwner) public view returns (Status, uint, address) {
        return (properties[_propId].status, properties[_propId].value, properties[_propId].currOwner);
    }

    //E. Edit Property Details (Value)
    function editProperty(uint _propId, uint _newValue) public  {
        properties[_propId].value == _newValue;
    }

}