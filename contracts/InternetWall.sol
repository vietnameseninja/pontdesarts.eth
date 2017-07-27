/// davidphan.eth

pragma solidity ^0.4.0;
contract InternetWall {

    address owner;

    event NewMessage(uint timestamp, uint msgIndex, string newMsg, address);

    struct Message{
        string message;
        address from;
        uint timestamp;
    }
    
    Message[10] public messages;
    uint messagesIndex;
    
    uint postedMessages;


    function InternetWall() {
        owner = msg.sender;
        messagesIndex = 0;
        postedMessages = 0;
    }
    
    function addMessage(string msgStr) payable {
        Message memory newMsg;
        newMsg.message = msgStr;
        newMsg.from = msg.sender;
        newMsg.timestamp = block.timestamp;
        messages[messagesIndex] = newMsg;
        NewMessage(block.timestamp, messagesIndex, msgStr, msg.sender);
        messagesIndex += 1;
        messagesIndex = messagesIndex % 10;
        postedMessages++;
    }
    
    function getMessagesCount() public returns (uint) {
        return messagesIndex;
    }
    
    function getMessage(uint index) returns(string) {
        assert(index < messagesIndex);
        return messages[index].message;
    }
    function getMessageSender(uint index) returns(address) {
        assert(index < messagesIndex);
        return messages[index].from;
    }
    function getMessageTimestamp(uint index) returns(uint) {
        assert(index < messagesIndex);
        return messages[index].timestamp;
    }

    function closeWall(){
        assert(msg.sender == owner);
        suicide(owner);
    }
    
}