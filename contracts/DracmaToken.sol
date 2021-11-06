// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

/*
* Objetivo:
*   - O contrato tem com o propósito de servir como um token digital que será a forma de 
* recompensa apresentado no Projeto Aplicado.
*   - Teremos uma estrutura de EducationalInstitution, onde refere-se a intituição de ensino
* Regras:
*   - O contrato será gerido pelo Owner do contrato
*        - O owner terá a responsabilidade alterar a cotação do token em wei 
*        e criar EducationalInstitution
*   - EducationalInstitution, a mesma poderá realizar a compra de tokens através da função
*   buy, desde que esteja cadastrada previamente. 
*   - A distribuição do token poderá ser feita pela instituição informando o endereço da
    e a quantidade que ela quer distribuir.
*   - Os próprios detentores poderá realizar a transferência dos tokens para outras contas 
*   desejadas
*
* Importando contrato default que representa um token ERC20 da blockchain Ethereum
* O contrato ERC20.sol será a base para a criação de um novo token 
*/

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract DracmaToken is ERC20{

    using SafeMath for uint256;

    string public SYMBOL = "DRC";
    string public NAME = "DRC";
    uint8 public DECIMALS = 18;
    uint256 public INITIAL_SUPPLY = 1000000000000000000000000;

    
    /*
    * owner: Owner do contrato e terá a responsabilidade de
    *   - Alterar a cotação do token
    *   - Registrar uma insituição educacional
    */
    address payable public owner;

    /*
    * quote: atributo que representa o valor da cotação do token em wei
    *   - Será usado no momento da compra do token
    *       weiNecessarios = quote * quantidadeTokensDesejadas;
    *   - É possível obter o valor da cotação em ether utilizando o método getQuote()
    */
    uint256 public quote;


    /*
    * Estrutura criada que representa uma Instituição de ensino
    */
    struct EducationalInstitution {
        bytes32 id;
    }


    /*
    * Mapping criado pensando em custo de gas e performance
    * Vincula o id da instituição de ensino ao address
    */
    mapping (address => EducationalInstitution) public institutionsAccount;
    
    /*
    * Mapping criado para facilitar e ser mais performático 
    * a verificação da existência da instituicao
    */
    mapping (bytes32 => address) public institutionsId;

    /*
    * Construtor do Smart Contract
    * Ao criar o contrato inteligente é definido o owner do contrato
    * juntamente com definição de quantidade inicial de tokens
    */
    constructor() ERC20(NAME, SYMBOL) {
        owner = payable(msg.sender);
        _mint(owner, INITIAL_SUPPLY);
    }

    /*
    * Modificador criado com o objetivo de colocar restrições de execução em algumas funções
    * Nesse caso, somente o owner do contrato poderá executar a função com esse modificador
    */
    modifier onlyOwner {
        require(msg.sender == owner, "Only owner!");
        _;
    }

    /*
        Funcao responsavel por alterar a cotacao do token
        params:
            - quoteValue: Valor da cotacao em wei
    */
    function setQuote(uint256 quoteValue) onlyOwner public{
        quote = quoteValue;
    }
    

    /*  
        Funcao responsavel por registrar uma instituicao de ensino para futuras distribuicoes de tokens para os alunos 
        params:
            - id: hash do identificador da instituicao de ensino
            - addressAccount: Conta da instituição
    */
    function registerEducationalInstitution(bytes32 id, address addressAccount) onlyOwner public {
        require(getEducationalInstitutionAddress(id) == address(0), "Instituicao de ensino ja existente.");
        
        institutionsAccount[addressAccount].id = id; 
        institutionsId[id] = addressAccount;
    }

    /*
        Funcao responsavel por realizar a compra de token pela instituicao de ensino
        params:
            - numTokens: numero de tokens desejado
            - institutionId: Hash do identificador da instituicao de ensino
    */
    function buy(uint numTokens, bytes32 institutionId) public payable returns (bool) {
        uint256 necessaryWei = quote.mul(numTokens);

        require(verifyEducationalInstitution(institutionId), "instituicao de ensino deve estar registrada no smart contract");
        require(getEducationalInstitutionAddress(institutionId) == msg.sender, "Transaction is not authorized");
        require(necessaryWei <= msg.value, "Quantidade de ether insuficiente");
        require(numTokens <= balanceOf(owner), "numero de tokens solicitados maior que o saldo existente");

        owner.transfer(msg.value);

        _transfer(owner, msg.sender, numTokens);
        return true;
    }
    
    /* 
        Funcao responsavel por verificar a existencia de uma instituicao de ensino
        params:
            - institutionId: Hash do identificador da instituicao de ensino
    */
    function verifyEducationalInstitution(bytes32 institutionId) public view returns(bool){
        return getEducationalInstitutionAddress(institutionId) != address(0);
    }

    /* 
        Funcao responsavel por obter o address da instituicao de ensino pelo identificador
        params:
            - institutionId: Hash do identificador da instituicao de ensino
    */
    function getEducationalInstitutionAddress(bytes32 institutionId) private view returns(address) {
        return institutionsId[institutionId];
    }
    
    /*
        Funcao responsavel por consultar o saldo de uma instituicao de ensino
        obs: Uma instituicao de ensino só pode consultar o saldo dela mesmo
        params:
            - institutionId: Hash do identificador da instituicao de ensino
    */
    function getEducationalInstitutionBalance(bytes32 institutionId) public view returns(uint256) {
        address account = getEducationalInstitutionAddress(institutionId);
        
        require(msg.sender == account, "Sem permissao para consultar o saldo");

        return balanceOf(account);
    }
    
}