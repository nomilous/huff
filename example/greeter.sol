/*

ethereum_deploy_contract --sender 6b41859d5da286265bfe09c33e771434223d9de2 --param 'hello world!' greeter.sol

*/

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
}
