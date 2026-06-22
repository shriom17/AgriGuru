// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title KisanMitra Marketplace Smart Contract
 * @dev Decentralized marketplace for agricultural products and equipment
 */
contract KisanMitraMarketplace is ReentrancyGuard, Ownable {
    
    // Structs
    struct Product {
        uint256 id;
        address seller;
        string name;
        string description;
        uint256 price; // in wei
        uint256 quantity;
        string category;
        string ipfsHash; // Product metadata on IPFS
        bool isActive;
        uint256 createdAt;
    }
    
    struct Order {
        uint256 id;
        uint256 productId;
        address buyer;
        address seller;
        uint256 quantity;
        uint256 totalAmount;
        OrderStatus status;
        uint256 createdAt;
        uint256 escrowReleaseTime;
    }
    
    struct Review {
        address reviewer;
        uint256 productId;
        uint8 rating; // 1-5 stars
        string comment;
        uint256 timestamp;
    }
    
    enum OrderStatus {
        Pending,
        Confirmed,
        Shipped,
        Delivered,
        Disputed,
        Cancelled,
        Completed
    }
    
    // State variables
    uint256 public productCounter;
    uint256 public orderCounter;
    uint256 public platformFeePercent = 250; // 2.5% in basis points
    uint256 public escrowPeriod = 7 days;
    
    mapping(uint256 => Product) public products;
    mapping(uint256 => Order) public orders;
    mapping(uint256 => Review[]) public productReviews;
    mapping(address => bool) public verifiedFarmers;
    mapping(address => uint256[]) public userProducts;
    mapping(address => uint256[]) public userOrders;
    
    // Supported tokens for payment
    mapping(address => bool) public supportedTokens;
    address public usdtToken; // USDT contract address
    
    // Events
    event ProductListed(uint256 indexed productId, address indexed seller, uint256 price);
    event OrderCreated(uint256 indexed orderId, uint256 indexed productId, address indexed buyer);
    event OrderStatusUpdated(uint256 indexed orderId, OrderStatus status);
    event PaymentReceived(uint256 indexed orderId, uint256 amount, address token);
    event ReviewAdded(uint256 indexed productId, address indexed reviewer, uint8 rating);
    event FarmerVerified(address indexed farmer);
    event EscrowReleased(uint256 indexed orderId, address indexed seller, uint256 amount);
    
    // Modifiers
    modifier onlyVerifiedFarmer() {
        require(verifiedFarmers[msg.sender], "Only verified farmers can list products");
        _;
    }
    
    modifier onlyProductOwner(uint256 _productId) {
        require(products[_productId].seller == msg.sender, "Only product owner can modify");
        _;
    }
    
    modifier validProduct(uint256 _productId) {
        require(_productId > 0 && _productId <= productCounter, "Invalid product ID");
        require(products[_productId].isActive, "Product is not active");
        _;
    }
    
    constructor(address _usdtToken) {
        usdtToken = _usdtToken;
        supportedTokens[_usdtToken] = true;
        supportedTokens[address(0)] = true; // ETH/MATIC
    }
    
    /**
     * @dev List a new product on the marketplace
     */
    function listProduct(
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _quantity,
        string memory _category,
        string memory _ipfsHash
    ) external onlyVerifiedFarmer {
        require(_price > 0, "Price must be greater than 0");
        require(_quantity > 0, "Quantity must be greater than 0");
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        productCounter++;
        
        products[productCounter] = Product({
            id: productCounter,
            seller: msg.sender,
            name: _name,
            description: _description,
            price: _price,
            quantity: _quantity,
            category: _category,
            ipfsHash: _ipfsHash,
            isActive: true,
            createdAt: block.timestamp
        });
        
        userProducts[msg.sender].push(productCounter);
        
        emit ProductListed(productCounter, msg.sender, _price);
    }
    
    /**
     * @dev Create an order for a product
     */
    function createOrder(
        uint256 _productId,
        uint256 _quantity,
        address _paymentToken
    ) external payable validProduct(_productId) nonReentrant {
        Product storage product = products[_productId];
        require(product.quantity >= _quantity, "Insufficient quantity available");
        require(product.seller != msg.sender, "Cannot buy your own product");
        require(supportedTokens[_paymentToken], "Payment token not supported");
        
        uint256 totalAmount = product.price * _quantity;
        uint256 platformFee = (totalAmount * platformFeePercent) / 10000;
        uint256 totalWithFee = totalAmount + platformFee;
        
        if (_paymentToken == address(0)) {
            // ETH/MATIC payment
            require(msg.value >= totalWithFee, "Insufficient payment");
        } else {
            // ERC20 token payment
            IERC20 token = IERC20(_paymentToken);
            require(token.transferFrom(msg.sender, address(this), totalWithFee), "Token transfer failed");
        }
        
        orderCounter++;
        
        orders[orderCounter] = Order({
            id: orderCounter,
            productId: _productId,
            buyer: msg.sender,
            seller: product.seller,
            quantity: _quantity,
            totalAmount: totalAmount,
            status: OrderStatus.Pending,
            createdAt: block.timestamp,
            escrowReleaseTime: block.timestamp + escrowPeriod
        });
        
        // Update product quantity
        product.quantity -= _quantity;
        if (product.quantity == 0) {
            product.isActive = false;
        }
        
        userOrders[msg.sender].push(orderCounter);
        userOrders[product.seller].push(orderCounter);
        
        emit OrderCreated(orderCounter, _productId, msg.sender);
        emit PaymentReceived(orderCounter, totalWithFee, _paymentToken);
    }
    
    /**
     * @dev Update order status (seller only)
     */
    function updateOrderStatus(uint256 _orderId, OrderStatus _status) external {
        Order storage order = orders[_orderId];
        require(order.seller == msg.sender, "Only seller can update order status");
        require(order.status != OrderStatus.Completed, "Order already completed");
        require(order.status != OrderStatus.Cancelled, "Order is cancelled");
        
        order.status = _status;
        
        // Auto-release escrow when delivered
        if (_status == OrderStatus.Delivered) {
            order.escrowReleaseTime = block.timestamp + 2 days; // 2-day grace period
        }
        
        emit OrderStatusUpdated(_orderId, _status);
    }
    
    /**
     * @dev Release escrow payment to seller
     */
    function releaseEscrow(uint256 _orderId) external nonReentrant {
        Order storage order = orders[_orderId];
        require(
            msg.sender == order.buyer || 
            msg.sender == order.seller || 
            block.timestamp >= order.escrowReleaseTime,
            "Cannot release escrow yet"
        );
        require(order.status == OrderStatus.Delivered, "Order not delivered");
        require(order.status != OrderStatus.Completed, "Escrow already released");
        
        order.status = OrderStatus.Completed;
        
        // Calculate platform fee
        uint256 platformFee = (order.totalAmount * platformFeePercent) / 10000;
        uint256 sellerAmount = order.totalAmount - platformFee;
        
        // Transfer to seller
        (bool success,) = payable(order.seller).call{value: sellerAmount}("");
        require(success, "Transfer to seller failed");
        
        emit EscrowReleased(_orderId, order.seller, sellerAmount);
    }
    
    /**
     * @dev Add a review for a product
     */
    function addReview(
        uint256 _productId,
        uint8 _rating,
        string memory _comment
    ) external validProduct(_productId) {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        
        // Check if buyer has purchased this product
        bool hasPurchased = false;
        uint256[] memory buyerOrders = userOrders[msg.sender];
        
        for (uint i = 0; i < buyerOrders.length; i++) {
            if (orders[buyerOrders[i]].productId == _productId && 
                orders[buyerOrders[i]].buyer == msg.sender &&
                orders[buyerOrders[i]].status == OrderStatus.Completed) {
                hasPurchased = true;
                break;
            }
        }
        
        require(hasPurchased, "You must purchase the product to review it");
        
        productReviews[_productId].push(Review({
            reviewer: msg.sender,
            productId: _productId,
            rating: _rating,
            comment: _comment,
            timestamp: block.timestamp
        }));
        
        emit ReviewAdded(_productId, msg.sender, _rating);
    }
    
    /**
     * @dev Verify a farmer (only owner)
     */
    function verifyFarmer(address _farmer) external onlyOwner {
        verifiedFarmers[_farmer] = true;
        emit FarmerVerified(_farmer);
    }
    
    /**
     * @dev Get product details
     */
    function getProduct(uint256 _productId) external view returns (Product memory) {
        return products[_productId];
    }
    
    /**
     * @dev Get order details
     */
    function getOrder(uint256 _orderId) external view returns (Order memory) {
        return orders[_orderId];
    }
    
    /**
     * @dev Get reviews for a product
     */
    function getProductReviews(uint256 _productId) external view returns (Review[] memory) {
        return productReviews[_productId];
    }
    
    /**
     * @dev Get user's products
     */
    function getUserProducts(address _user) external view returns (uint256[] memory) {
        return userProducts[_user];
    }
    
    /**
     * @dev Get user's orders
     */
    function getUserOrders(address _user) external view returns (uint256[] memory) {
        return userOrders[_user];
    }
    
    /**
     * @dev Add supported payment token
     */
    function addSupportedToken(address _token) external onlyOwner {
        supportedTokens[_token] = true;
    }
    
    /**
     * @dev Update platform fee
     */
    function updatePlatformFee(uint256 _newFeePercent) external onlyOwner {
        require(_newFeePercent <= 1000, "Fee cannot exceed 10%");
        platformFeePercent = _newFeePercent;
    }
    
    /**
     * @dev Withdraw platform fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success,) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}