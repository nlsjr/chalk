const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const expectEvent = require('./helpers/expectEvent');
const { expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { INSTITUTION_ONE_ID, INSTITUTION_TWO_ID, INITIAL_SUPPLY, ZERO_ADDRESS, TRANSFER_TEST_AMOUNT, UNAVAILABLE_AMOUNT } = require('./helpers/constants');

const DracmaToken = contract.fromArtifact('DracmaToken');

describe('DracmaToken: Token ERC20', function() {

  const [ owner, institutionOne, institutionTwo, recipient, anotherAccount ] = accounts;

  beforeEach(async function () {
    this.contract = await DracmaToken.new({ from: owner });

    await this.contract.setQuote(240000000000000, { from: owner });
  });

  describe('Valor da cotação em wei', function(){
    // Test case
    it('Quote retorna o valor da cotação previamente cadastrado', async function () {

      // Note that we need to use strings to compare the 256 bit integers
      expect((await this.contract.quote())).to.be.bignumber.equal(new web3.utils.BN(240000000000000));
    });
  });

  describe('Total supply', function(){
    // Test case
    it('Retorna a quantidade total de tokens', async function () {      
      expect((await this.contract.totalSupply())).to.be.bignumber.eq(INITIAL_SUPPLY);
    });
  });

  describe('balanceOf', function() {
    describe('Quando a conta solicitada não tem tokens', function() {

      it('retorna zero', async function(){
        expect((await this.contract.balanceOf(institutionOne))).to.be.bignumber.equal('0');
      });

    });

    describe('Quando a conta solicitada tem tokens', function() {
      it('Retorna a quantidade total de tokens da conta', async function() {
        expect((await this.contract.balanceOf(owner))).to.be.bignumber.equal(INITIAL_SUPPLY);
      });
    });
  });

  describe('transfer', function() {

    describe('Reverte ao transferir tokens para o endereço zero', function() {
      it('Reverter', async function() {
        await expectRevert.unspecified(this.contract.transfer(ZERO_ADDRESS, INITIAL_SUPPLY, { from: owner }));
      });
    });


    describe('Quando a conta não é o endereço zero', function() {
      const to = recipient;

      describe('Quando a conta que está enviando não tem saldo suficiente', function() {
        it('reverts', async function() {
          await expectRevert.unspecified(this.contract.transfer(to, UNAVAILABLE_AMOUNT, { from: owner }));
        });
      });

      describe('Quando a conta que está enviando tem saldo suficiente', function() {
        const amount = TRANSFER_TEST_AMOUNT;
        
        //verificar como funciona as taxas
        //const taxes = applyTax(amount, ALL_TAXES_SHIFT);

        it('Transfere para a conta solicitada', async function(){
          await this.contract.transfer(to, amount, { from: owner });

          expect((await this.contract.balanceOf(owner))).to.be.bignumber.equal(INITIAL_SUPPLY.sub(amount));
          
          //verificar como funciona as taxas
          //(await tokenInstance.balanceOf(owner)).should.be.bignumber.equal(INITIAL_SUPPLY.sub(amount).sub(taxes));

          expect((await this.contract.balanceOf(to))).to.be.bignumber.equal(amount);
        });

        //verificar como funciona as taxas
        /*it('should transfer the full value from the tax recipient address', async function() {
          // Transfer the value to some wallet
          await tokenInstance.transfer(to, amount, { from: owner });

          // Check the tax amount in the tax addr recipient
          (await tokenInstance.balanceOf(taxRecipientAddr)).should.be.bignumber.equal(taxes);

          // Transfer for some other wallet
          await tokenInstance.transfer(boardAccount, taxes, { from: taxRecipientAddr });

          // Final check
          (await tokenInstance.balanceOf(boardAccount)).should.be.bignumber.equal(taxes);
          (await tokenInstance.balanceOf(taxRecipientAddr)).should.be.bignumber.equal(new BN(0));
        });*/

        it('Emite um evento de transferência', async function() {
          const { logs } = await this.contract.transfer(to, amount, { from: owner });

          //verificar como funciona as taxas
          /**
           * The Foundation transaction
          
          expectEvent.inLogs(logs, 'Transfer', {
              from: owner,
              to: taxRecipientAddr,
              value: taxes
          });*/

          /**
           * The user transaction
          */
          expectEvent.inLogs(logs, 'Transfer', {
              from: owner,
              to: to,
              value: amount
          });
        });
      });
    });

    
  });

  describe('approve', function() {

    describe('Quando a conta que será responsável por gastar o token é o endereço zero', function() {
      const amount = INITIAL_SUPPLY;
      const spender = ZERO_ADDRESS;

      it('reverts', async function() {
        await expectRevert.unspecified(this.contract.approve(spender, amount, { from: owner }));
      });
    });


    describe('Quando a conta que será responsável por gastar o token não é o endereço zero', function() {
      const spender = recipient;

      describe('Quando a conta que será responsável por gastar o token tem saldo o suficiente', function() {
        const amount = INITIAL_SUPPLY;

        it('Emite um evento de aprovação', async function() {
          const { logs } = await this.contract.approve(spender, amount, { from: owner });

          expectEvent.inLogs(logs, 'Approval', {
              owner: owner,
              spender: spender,
              value: amount
          });
        });

        describe('Quando não havia valor aprovado antes', function() {
          it('Aprova a quantidade solicitada', async function() {
            await this.contract.approve(spender, amount, { from: owner });

            expect((await this.contract.allowance(owner, spender))).to.be.bignumber.equal(amount);
          });
        });

        describe('Quando a conta que será responsável por gastar o token já tinha uma quantia aprovada', function() {
          beforeEach(async function() {
            await this.contract.approve(spender, 1, { from: owner });
          });

          it('Aprova o valor solicitado e substitui o anterior', async function() {
            await this.contract.approve(spender, amount, { from: owner });

            expect((await this.contract.allowance(owner, spender))).to.be.bignumber.equal(amount);
          });
        });
      });

      describe('Quando o remetente não tem saldo suficiente para aprovar um destinatário', function() {
        const amount = UNAVAILABLE_AMOUNT;

        it('Emite um evento de aprovação', async function() {
          const { logs } = await this.contract.approve(spender, amount, { from: owner });

          expectEvent.inLogs(logs, 'Approval', {
              owner: owner,
              spender: spender,
              value: amount
          });
        });

        describe('Quando não havia valor aprovado antes', function() {
          it('Aprova a quantidade solicitada', async function() {
            await this.contract.approve(spender, amount, { from: owner });

            expect((await this.contract.allowance(owner, spender))).to.be.bignumber.equal(amount);
          });
        });

        describe('Quando a conta que será responsável por gastar o token já tinha uma quantia aprovada', function() {
          beforeEach(async function() {
            await this.contract.approve(spender, 1, { from: owner });
          });

          it('Aprova o valor solicitado e substitui o anterior', async function() {
            await this.contract.approve(spender, amount, { from: owner });

            expect((await this.contract.allowance(owner, spender))).to.be.bignumber.equal(amount);
          });
        });
      });
    });
  });

  describe('transfer from', function() {
    const spender = recipient;

    describe('Quando o destinatário é o endereço zero', function() {
      const amount = INITIAL_SUPPLY;
      const to = ZERO_ADDRESS;

      beforeEach(async function() {
        await this.contract.approve(spender, amount, { from: owner });
      });

      it('reverts', async function() {
        await expectRevert.unspecified(this.contract.transferFrom(owner, to, amount, { from: spender }));
      });
    });

    describe('Quando o destinatŕio não é o endereço zero', function() {
      const to = anotherAccount;

      describe('Quando a conta que será responsável por gastar o token já tem a quantia aprovada', function() {
        beforeEach(async function() {
          await this.contract.approve(spender, INITIAL_SUPPLY, { from: owner });
        });

        describe('Quando o owner tem saldo suficiente', function() {
          const amount = TRANSFER_TEST_AMOUNT;
          //verificar como funciona a taxa
          //const taxes = applyTax(amount, ALL_TAXES_SHIFT);

          it('Transfere a quantidade solicitada', async function() {
            await this.contract.transferFrom(owner, to, amount, { from: spender });

            //verificar como funciona a taxa
            //expect((await tokenInstance.balanceOf(owner))).to.be.bignumber.equal(INITIAL_SUPPLY.sub(amount).sub(taxes));

            expect((await this.contract.balanceOf(owner))).to.be.bignumber.equal(INITIAL_SUPPLY.sub(amount));

            expect((await this.contract.balanceOf(to))).to.be.bignumber.equal(amount);
          });

          it('Diminui o saldo para conta que pode gastar o token', async function() {
            await this.contract.transferFrom(owner, to, amount, { from: spender });

            //verificar como funciona as taxas
            //expect((await this.contract.allowance(owner, spender))).to.be.bignumber.equal(INITIAL_SUPPLY.sub(amount).sub(taxes));

            expect((await this.contract.allowance(owner, spender))).to.be.bignumber.equal(INITIAL_SUPPLY.sub(amount));
          });

          //verificar como funciona as taxas
          /*it('should transfer the full value from the tax recipient address', async function() {
            // Approve spender to manipulate the TAX wallet
            await tokenInstance.approve(spender, taxes, { from: taxRecipientAddr });

            // Transfer the value to some wallet
            await tokenInstance.transferFrom(owner, to, amount, { from: spender });

            // Check the tax amount in the tax addr recipient
            (await tokenInstance.balanceOf(taxRecipientAddr)).should.be.bignumber.equal(taxes);

            // Transfer to some other wallet
            await tokenInstance.transferFrom(taxRecipientAddr, boardAccount, taxes, { from: spender });

            // Final check
            (await tokenInstance.balanceOf(boardAccount)).should.be.bignumber.equal(taxes);
            (await tokenInstance.balanceOf(taxRecipientAddr)).should.be.bignumber.equal(new BN(0));
          });*/

          it('Emite um evento de transferência', async function() {
            const { logs } = await this.contract.transferFrom(owner, to, amount, { from: spender });

            /**
             * The Foundation transaction
            
            expectEvent.inLogs(logs, 'Transfer', {
                from: owner,
                to: taxRecipientAddr,
                value: taxes
            });
            */

            /**
             * The user transaction
            */
            expectEvent.inLogs(logs, 'Transfer', {
              from: owner,
              to: to,
              value: amount
            });
          });
        });

        describe('Quando o owner não tem saldo suficiente', function() {
          const amount = UNAVAILABLE_AMOUNT;

          it('reverts', async function() {
            await expectRevert.unspecified(this.contract.transferFrom(owner, to, amount, { from: spender }));
          });
        });
      });

      describe('Quando a conta que pode gastar o token não tem saldo suficiente aprovado', function() {
        
        beforeEach(async function(){
          await this.contract.approve(spender, INITIAL_SUPPLY.sub(new web3.utils.BN(1)), { from: owner });
        });

        describe('Quando o owner tem qtde de tokens suficientes', function() {
          const amount = INITIAL_SUPPLY;

          it('reverts', async function() {
            await expectRevert.unspecified(this.contract.transferFrom(owner, to, amount, { from: spender }));
          });
        });

        describe('Quando o owner tem qtde de tokens suficientes', function() {
          const amount = UNAVAILABLE_AMOUNT;

          it('reverts', async function(){
            await expectRevert.unspecified(this.contract.transferFrom(owner, to, amount, { from: spender }));
          });
        });
      });
    });
  });

  describe('decrease allowance', function() {

    describe('Quando a conta que pode gastar o token é o endereço zero', function() {
      const amount = INITIAL_SUPPLY;
      const spender = ZERO_ADDRESS;

      it('reverts', async function() {
        await expectRevert.unspecified(this.contract.decreaseAllowance(spender, amount, { from: owner }));
      });
    });

    describe('Quando a conta que pode gastar o token não é o endereço zero', function() {
      const spender = recipient;

      function shouldDecreaseApproval (amount) {
        describe('Quando não há valor aprovado', function() {
          it('reverts', async function() {
            await expectRevert.unspecified(this.contract.decreaseAllowance(spender, amount, { from: owner }));
          });
        });

        describe('Quando há um valor aprovado para a conta que irá gastar o token', function() {
          const approvedAmount = amount;

          beforeEach(async function() {
            ({ logs: this.logs } = await this.contract.approve(spender, approvedAmount, { from: owner }));
          });

          it('Emite um evento de Aprovação', async function() {
            const { logs } = await this.contract.decreaseAllowance(spender, approvedAmount, { from: owner });

            expectEvent.inLogs(logs, 'Approval', {
              owner: owner,
              spender: spender,
              value: new web3.utils.BN(0)
            });
          });

          it('Diminui o valor para gastar subtraindo a quantia solicitada', async function(){
            await this.contract.decreaseAllowance(spender, approvedAmount.sub(new web3.utils.BN(1)), { from: owner });

            expect((await this.contract.allowance(owner, spender))).to.be.bignumber.equal(new web3.utils.BN(1));
          });

          it('Define o valor a ser gasto para zero quando todo o subsídio é removido', async function() {
            await this.contract.decreaseAllowance(spender, approvedAmount, { from: owner });

            expect((await this.contract.allowance(owner, spender))).to.be.bignumber.equal(new web3.utils.BN(0));
          });

          it('Reverte quando mais do que todo o valor a ser gasto é removido', async function() {
            await expectRevert.unspecified(this.contract.decreaseAllowance(spender, approvedAmount.add(new web3.utils.BN(1)), { from: owner }));
          });
        });
      }

      describe('Quando a conta que irá gastar o token tem saldo suficiente', function() {
        shouldDecreaseApproval(INITIAL_SUPPLY);
      });

      describe('Quando a conta que irá gastar o token não tem saldo suficiente', function() {
        shouldDecreaseApproval(UNAVAILABLE_AMOUNT); 
      });
    });

    
  });
  
  
  describe('increase allowance', function() {
    const amount = INITIAL_SUPPLY;

    describe('Quando a conta responsável por gastar o token é o endereço zero', function() {
      const spender = ZERO_ADDRESS;

      it('reverts', async function() {
        await expectRevert.unspecified(this.contract.increaseAllowance(spender, amount, { from: owner }));
      });
    });

    describe('Quando a conta responsável por gastar o token não é o endereço zero', function() {
      const spender = recipient;

      describe('Quando a conta responsável por gastar o token tem saldo suficiente', function() {
        it('Emite um evento de aprovação', async function() {
          const { logs } = await this.contract.increaseAllowance(spender, amount, { from: owner });

          expectEvent.inLogs(logs, 'Approval', {
            owner: owner,
            spender: spender,
            value: amount
          });
        });

        describe('Quando não houver valor aprovado anteriormente', function() {
          it('Aprova a quantidade solicitada', async function() {
            await this.contract.increaseAllowance(spender, amount, { from: owner });

            expect((await this.contract.allowance(owner, spender))).to.be.bignumber.equal(amount);
          });
        });

        describe('Quando o gastador já tinha uma quantidade de tokens aprovada', function() {
          beforeEach(async function() {
            await this.contract.approve(spender, 1, { from: owner });
          });

          it('aumenta o valor de gasto adicionando a quantia solicitada', async function() {
            await this.contract.increaseAllowance(spender, amount, { from: owner });

            expect((await this.contract.allowance(owner, spender))).to.be.bignumber.equal(amount.add(new web3.utils.BN(1)));
          });
        });
      });

      describe('Quando o dono da conta não tem saldo suficiente', function() {
        const amount = UNAVAILABLE_AMOUNT;

        it('Emite um evento de aprovação', async function() {
          const { logs } = await this.contract.increaseAllowance(spender, amount, { from: owner });

          expectEvent.inLogs(logs, 'Approval', {
              owner: owner,
              spender: spender,
              value: amount
          });
        });

        describe('Quando não havia valor aprovado anteriormente', function() {
          it('Aprova a quantia solicitado', async function() {
            await this.contract.increaseAllowance(spender, amount, { from: owner });

            expect((await this.contract.allowance(owner, spender))).to.be.bignumber.equal(amount);
          });
        });

        describe('Quando o gastador já tinha uma quantidade de tokens aprovada', function() {
          beforeEach(async function() {
            await this.contract.approve(spender, 1, { from: owner });
          });

          it('Aumenta o valor de gasto adicionando a quantia solicitada', async function() {
            await this.contract.increaseAllowance(spender, amount, { from: owner });

            expect((await this.contract.allowance(owner, spender))).to.be.bignumber.equal(amount.add(new web3.utils.BN(1)));
          });
        });
      });
    });
  });
  

  describe('Registrar instituição de ensino', function(){
    // Test case
    it('institutionsAccount retorna o a insitituição registrada no smart contract', async function () {

      await this.contract.registerEducationalInstitution(INSTITUTION_ONE_ID, institutionOne, { from: owner });
  
      // Note that we need to use strings to compare the 256 bit integers
      expect((await this.contract.institutionsAccount(institutionOne)).toString()).to.equal(INSTITUTION_ONE_ID);
    });

    // Test case
    it('A mesma instituição não pode ser registrada duas vezes no smart contract', async function () {

      await this.contract.registerEducationalInstitution(INSTITUTION_ONE_ID, institutionOne, { from: owner });
      
      try {
        await this.contract.registerEducationalInstitution(INSTITUTION_ONE_ID, institutionOne, { from: owner });

      } catch(err) {
        expect(err.reason).to.equal('Instituicao de ensino ja existente.');
      }
      
    });
  });

  describe('Comprar tokens', function(){
    // Test case
    it('O saldo de tokens da instituição é correspondente ao valor informado da compra', async function () {

      await this.contract.registerEducationalInstitution(INSTITUTION_ONE_ID, institutionOne, { from: owner });

      await this.contract.buy(100, INSTITUTION_ONE_ID, { from: institutionOne, value: '1000000000000000000'});
      
      expect((await this.contract.balanceOf(institutionOne))).to.be.bignumber.equal(new web3.utils.BN(100));
    });

    // Test case
    it('Instituição não cadastrada, não tem autorização para adquirir token', async function () {
        
      try {
        await this.contract.buy(100, INSTITUTION_ONE_ID, { from: institutionOne, value: '1000000000000000000'});
      } catch(err) {
        expect(err.reason).to.equal('instituicao de ensino deve estar registrada no smart contract');
      }
    });

    // Test case
    it('Instituição só pode comprar tokens para sua conta', async function () {
        
      await this.contract.registerEducationalInstitution(INSTITUTION_ONE_ID, institutionOne, { from: owner });
      await this.contract.registerEducationalInstitution(INSTITUTION_TWO_ID, institutionTwo, { from: owner });

      try {
        await this.contract.buy(100, INSTITUTION_ONE_ID, { from: institutionTwo, value: '1000000000000000000'});
      } catch(err) {
        expect(err.reason).to.equal('Transaction is not authorized');
      }
    });

    // Test case
    it('Instituicao não enviou quantidade de ether necessária para a transação', async function () {
        
      await this.contract.registerEducationalInstitution(INSTITUTION_ONE_ID, institutionOne, { from: owner });

      try {
        await this.contract.buy(100, INSTITUTION_ONE_ID, { from: institutionOne, value: '100'});
      } catch(err) {
        expect(err.reason).to.equal('Quantidade de ether insuficiente');
      }
    });
  });
});