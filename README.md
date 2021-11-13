# Chalk

# Dracma Token

### Comandos

> npx create-react-app chalk
> npm start

### Configuração

#### Instalar truffle

```$ npm install -g truffle```


#### Inicializar o projeto com a estrutura do truffle

```$ truffle init```

Depois do comando teremos a estrutura a seguir no projeto

1. contracts/: Diretorio dos smart contracts Solidity
2. migrations/: Diretorio dos arquivos de deployment
3. test/: Diretorio de arquivos de teste da aplicação e smart contracts
4. truffle-config.js: Arquivo de configuração do Truffle

#### Inicializar projeto com npm

```$ npm init -y```

#### Simulador blockchain Truffle

```$ truffle develop```

> Será inicializado a blockchain local no endereço http://localhost:9545 e criado algumas wallets com o address, private key e o Mnemonic com as palavras chave.

> Caso o contrato seja um token, instalar a dependência pelo npm

> ```$ npm install @openzeppelin/contracts```

#### Compilar contrato

> De dentro do ambiente de dev do Truffle, executar o comando 

```$ compile```

#### Deploy do contrato

> Lembrando que o contrato deve estar na pasta **contracts/**

```$ migrate```

#### Pegar contas pelo web3.js

```js
const accounts = web3.eth.getAccounts()
```

#### Instanciando contrato

```js
const dracmaToken = await DracmaToken.deployed()
```

### Deploy em rede de Testes

<p>O deploy do smart contract será na rede Ropsten</p>

#### Alterar arquivo truffle-config.js

```js
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
    networks: {
        ropsten: {
            provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.INFURA_URL),
            network_id: process.env.NETWORK_ID,
            gas: 5500000,        // Ropsten has a lower block limit than mainnet
            confirmations: 2,    // # of confs to wait between deployments. (default: 0)
            timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
            skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
        }
    }
}
```

> Necessário configurar as váriaveis de ambiente **MNEMONIC**, **INFURA_URL** e **NETWORK_ID**

#### Deploy do contrato em rede de teste

```$ truffle migrate --network ropsten```

##### Smart Contract Migrations
- Transaction hash: 0xed441a6a621b30bb86c0214b5a4488aaef51ee9284263f44b08c5d6efef01979
- Contract Address: 0x27008013f3A2421D8Da88411c5527a9Af4f8cfA4
- Blocks: 1            Seconds: 25
- contract address:    0x27008013f3A2421D8Da88411c5527a9Af4f8cfA4
- block number:        11311435
- block timestamp:     1635364769
- account:             0x864d6654D79e5BD295234d9577d07104AAe05968
- balance:             1.229574459270839156
- gas used:            250142 (0x3d11e)
- gas price:           2.136305606 gwei
- value sent:          0 ETH
- total cost:          0.000534379756896052 ETH

##### Smart Contract DracmaToken
- transaction hash:    0x668c1420b5fd7830919793a8480e0cbc72360696ca0ea69eba9965583c0939e6
- Blocks: 4            Seconds: 99
- contract address:    0x2fb11D34B18ad29BDB8756642F64A5814273F1B4
- block number:        11311441
- block timestamp:     1635364879
- account:             0x864d6654D79e5BD295234d9577d07104AAe05968
- balance:             1.224633814618894423
- gas used:            2266792 (0x2296a8)
- gas price:           2.136305604 gwei
- value sent:          0 ETH
- total cost:          0.004842560452702368 ETH


### Casos de Teste

#### msg.sender = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4

- **Deploy do contrato**
    - Gas da transacao
    - Gwei: 2197925
    - Wei: 2197925000000000
    - Ether: 0.002197925
    - Dolar: $8.94

- **Transacao setQuote**
    - Wei: 240000000000000
    - Ether: 0.00024
    - Dolar: $1.00
    - **Valor da transacao**
        - Gas em Gwei: 45975
        - Ether: 0.000045975
        - Dolar: $0.19


- **Transacao registerEducationalInstitution**

    - **idInstitution1: 0x64613031343338322d393261632d346334332d383530652d3431363334396438**
    - **address: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2**
        - Valor da transacao
        - Gas em gwei: 69578
        - Ether: 0.000069578
        - Dolar: $0.29
        - json input: {"0x64613031343338322d393261632d346334332d383530652d3431363334396438", "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"}

    - **idInstitution2: 0x65393932356236632d373332372d343237302d396133342d6163643632626165**
    - **address: 0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c**
        - Valor da transacao
        - Gas em gwei: 69578
        - Ether: 0.000069578
        - Dolar: $0.29
        - json input: {"0x65393932356236632d373332372d343237302d396133342d6163643632626165", "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c"}



- **Transação buy tokens**
    **- institutionId1: 0x64613031343338322d393261632d346334332d383530652d3431363334396438**
    - numTokens: 10000
    - valor cotacao: 240000000000000
    - valor em ether: 2.4
    - valor em dolar: $9758.69
    - address account: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
    - total tokens atual: 1000000000000000000000000
    - total tokens apos transacao: 999999999999999999990000
    - json input: {"10000", "0x64613031343338322d393261632d346334332d383530652d3431363334396438"}
    - Valor da Transação
    - Gas em gwei: 69415
    - Ether: 0.000069415
    - Dolar: $0.28

    **- institutionId2: 0x65393932356236632d373332372d343237302d396133342d6163643632626165**
    - numTokens: 10000
    - valor cotacao: 240000000000000
    - valor em ether: 2.4
    - valor em dolar: $9758.69
    - address account: 0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c
    - total tokens atual: 999999999999999999990000
    - total tokens apos transacao: 999999999999999999980000
    - json input: {"10000", "0x65393932356236632d373332372d343237302d396133342d6163643632626165"}
    - Valor da Transação
    - Gas em gwei: 69090
    - Ether: 0.00006909 
    - Dolar: $0.28


- **Approve - Dando permissao para o sender usar a qtde de tokens informada**
    - Valor da Transação
    - Gas em gwei: 46844
    - Ether: 0.000046844
    - Dolar: $0.19
    - json input: {"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "100"}


- **TransferFrom**
    Para eu ter permissao para usar esse método, primeiramente preciso do allowance
    {"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "100"} - Reason provided by the contract: "ERC20: transfer amount exceeds allowance".

    Transferindo 10 tokens para a conta ...2148, onde o owner desse token é a conta ...ddC4, mas 
    ...ddC4 deu permissão para o caller(executor do contrato) ...5cb2

    - Valor da Transação
    - Gas em gwei: 60430
    - Ether: 0.000060430
    - Dolar: $0.24
    - json input: {"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "0xdD870fA1b7C4700F2BD7f44238821C26f7392148", "10"}
  

- **Allowance - Consultar a qtde de tokens com permissao ainda**
    - json input: {"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"}
  

- **Increase Allowance - Aumentar a qtde de tokens para serem distribuídos**
    - Valor da Transação
    - Gas em gwei: 30151
    - Ether: 0.000030151
    - Dolar: $0.12
    - json input: {"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","20"}


- **Decrease Allowance - Remove a qtde de tokens para serem distribuídos**
    - Valor da Transação
    - Gas em gwei: 30046
    - Ether: 0.000030046
    - Dolar: $0.12
    - json input: {"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","10"}

## Integração interface

- **Institution1** 
    - **ID**: 0x38613433646330372d633664662d343839332d613761632d3132326235636536
    - **address**: 0xb79932D16B4bd12044936b6875DCE08F0a53Fa82

- **Institution2**
    - **ID**: 0x37636537343036342d343462302d313165632d383164332d3032343261633133
    - **address**: 0xe7337F7b470daA4D219269Cf777e8B06c9270927

- **Aluno**
    - **address**: 0xb7Eb8BcE73F9c7006c9b8DCE72599aC37469bFc6

## Obsevações

### Estudar

- Waffle, and Hardhat