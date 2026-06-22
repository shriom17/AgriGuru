# Blockchain Integration Dependencies for KisanMitra

## Frontend Dependencies (Add to package.json)
```json
{
  "dependencies": {
    "ethers": "^6.8.0",
    "web3": "^4.2.0",
    "@walletconnect/web3-provider": "^1.8.0",
    "@web3-react/core": "^8.2.0",
    "@web3-react/metamask": "^8.2.0",
    "@web3-react/walletconnect": "^8.2.0",
    "react-toastify": "^9.1.3",
    "ipfs-http-client": "^60.0.0",
    "axios": "^1.5.0"
  }
}
```

## Backend Dependencies (Add to requirements.txt)
```txt
web3==6.11.0
eth-account==0.9.0
python-dotenv==1.0.0
requests==2.31.0
flask-cors==4.0.0
celery==5.3.0
redis==4.6.0
```

## Smart Contract Dependencies
```json
{
  "devDependencies": {
    "@openzeppelin/contracts": "^4.9.0",
    "@nomiclabs/hardhat-ethers": "^2.2.3",
    "@nomiclabs/hardhat-waffle": "^2.0.6",
    "hardhat": "^2.17.0",
    "chai": "^4.3.8",
    "ethereum-waffle": "^4.0.10"
  }
}
```

## Installation Commands
```bash
# Frontend
npm install ethers web3 @walletconnect/web3-provider react-toastify ipfs-http-client

# Backend
pip install web3 eth-account python-dotenv requests flask-cors

# Smart Contracts (if setting up development environment)
npm install -g @remix-project/remixd
npm install hardhat @openzeppelin/contracts
```
