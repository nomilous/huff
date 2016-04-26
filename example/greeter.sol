import "./mortal.sol";

contract greeter is mortal {
    /* define variable greeting of the type string */
    string greeting;

    /* this runs when the contract is executed */
    function greeter(string _greeting) public {
        greeting = _greeting;
    }

    /* main function */
    function greet() constant returns (string) {
        return greeting;
    }

    /* constant reply */
    function echo(string value1, string value2) constant returns (string, string, int16) {
        return (value1, value2, 2);
    } 
}
