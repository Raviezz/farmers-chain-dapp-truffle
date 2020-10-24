pragma solidity ^0.5.0;

contract Farmers {
    uint256 public txnCount = 0;
    uint256 public totUsers = 0;
    uint256 public totProducts = 0;

    struct User {
        uint256 user_id;
        string user_name;
        string user_cnic;
        string city;
        string user_type;
    }

    mapping(address => User) public users;

    struct Product {
        uint256 product_id;
        string product_name;
        uint256 product_price;
        string harvested_date;
        address product_owner;
        string recorded_date;
    }
    mapping(uint256 => Product) public products;
    mapping(address => Product[]) public userProducts;

    struct Track {
        uint256 track_id;
        uint256 product_id;
        address seller_address;
        address buyer_address;
        string recorded_date;
    }

    mapping(uint256 => Track) public tracks;

    event UserCreated(
        uint256 id,
        string user_name,
        string user_cnic,
        string city,
        string user_type
    );

    event ProductRegistered(
        uint256 product_id,
        string product_name,
        uint256 product_price,
        string harvested_date,
        address product_owner,
        string recorded_date
    );

    event Transcation(
        uint256 track_id,
        uint256 product_id,
        address seller_address,
        address buyer_address,
        string recorded_date
    );

    function createUser(
        string memory uname,
        string memory cnic,
        string memory city,
        string memory user_type,
        address user_address
    ) public returns (address) {
        totUsers++;
        users[user_address] = User(totUsers, uname, cnic, city, user_type);
        emit UserCreated(totUsers, uname, cnic, city, user_type);

        return user_address;
    }

    function registerProduct(
        string memory product_name,
        uint256 product_price,
        string memory harvested_date,
        address product_owner,
        string memory recorded_date
    ) public returns (uint256) {
        totProducts++;
        products[totProducts] = Product(
            totProducts,
            product_name,
            product_price,
            harvested_date,
            product_owner,
            recorded_date
        );
        userProducts[msg.sender].push(products[totProducts]);
        emit ProductRegistered(
            totProducts,
            product_name,
            product_price,
            harvested_date,
            product_owner,
            recorded_date
        );

        return totProducts;
    }

    function transferOwnerShip(
        uint256 product_id,
        address seller,
        address buyer,
        string memory recorded_date
    ) public returns (uint256) {
        txnCount++;
        tracks[txnCount] = Track(
            txnCount,
            product_id,
            seller,
            buyer,
            recorded_date
        );
        emit Transcation(txnCount, product_id, seller, buyer, recorded_date);
        return txnCount;
    }

    function getUserDetails(address user_add)
        public
        view
        returns (
            string memory,
            address,
            string memory,
            string memory,
            string memory,
            uint256
        )
    {
        User storage user = users[user_add];
        return (
            user.user_name,
            user_add,
            user.user_cnic,
            user.user_type,
            user.city,
            user.user_id
        );
    }
}
