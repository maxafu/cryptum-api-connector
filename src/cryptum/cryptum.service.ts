import { BadRequestException, Injectable } from '@nestjs/common';
import CryptumSdk from 'cryptum-sdk';
import { Block, GetBlockDto } from '../block/dto/get-block.dto';
import { Prices } from '../prices/dto/get-prices.dto';
import { GetTransactionByHashDto } from '../transaction/dto/get-transaction.dto';
import { GetUtxosDto } from '../transaction/dto/get-utxo.dto';
import { SendTransactionDto } from '../transaction/dto/send-transaction.dto';
import { Transaction, UTXO, TransactionResponse } from '../transaction/dto/transaction.dto';
import { GetWalletInfoDto } from '../wallet/dto/get-wallet-info.dto';
// import { Wallet } from '../wallet/dto/wallet.dto';
import { GenerateWalletDto } from '../wallet/dto/generate-wallet.dto';
import {
  CreateBitcoinTransferTransactionDto,
  CreateCardanoTransferTransactionDto,
  CreateCeloTransferTransactionDto,
  CreateEthereumTransferTransactionDto,
  CreateHathorTransferTransactionDto,
  CreateRippleTransferTransactionDto,
  CreateSolanaTransferTransactionDto,
  CreateStellarTransferTransactionDto,
  CreateTrustlineTransactionDto,
} from '../transaction/dto/create-transaction.dto';
import { Protocol, TrustlineProtocol } from './interfaces/protocols.interface';
import {
  CallSmartContractDto,
  CallSmartContractResponse,
  CreateSmartContractCallTransactionDto,
  CreateSmartContractDeployTransactionDto,
} from '../transaction/dto/smartcontract-transaction.dto';
import {
  CreateEthTokenDeployTransactionDto,
  CreateHathorMeltTokenTransaction,
  CreateHathorMintTokenTransaction,
  CreateHathorTokenDeployTransaction,
  CreateSolanaTokenDeployTransaction,
  CreateSolanaTokenMintTransaction,
  CreateSolanaTokenBurnTransaction
} from '../transaction/dto/token-transaction.dto';
import {
  BitcoinTransferTransactionInput,
  CeloTransferTransactionInput,
  EthereumTransferTransactionInput,
  HathorTransferTransactionInput,
  RippleTransferTransactionInput,
  SignedTransaction,
  SmartContractDeployTransactionInput,
  SolanaTransferTransactionInput,
  StellarTransferTransactionInput,
  TokenDeployTransactionInput,
} from 'cryptum-sdk/dist/src/features/transaction/entity';
import config from '../config';

@Injectable()
export class CryptumService {
  private sdk: CryptumSdk;

  constructor() {
    this.sdk = new CryptumSdk(config.cryptumConfig());
  }
  generateRandomMnemonic(strength?: number): string {
    return this.sdk.getWalletController().generateRandomMnemonic(strength);
  }
  async generateWallet(input: GenerateWalletDto) {
    return this.sdk.getWalletController().generateWallet(input);
  }
  async getWalletInfo(input: GetWalletInfoDto) {
    return this.sdk.getWalletController().getWalletInfo(input);
  }
  async getTransactionByHash(input: GetTransactionByHashDto): Promise<Transaction> {
    return this.sdk.getTransactionController().getTransactionByHash(input);
  }
  async getUtxos(input: GetUtxosDto): Promise<UTXO[]> {
    return this.sdk.getTransactionController().getUTXOs(input);
  }
  async getBlock(input: GetBlockDto): Promise<Block> {
    return this.sdk.getTransactionController().getBlock(input);
  }
  async sendTransaction(input: SendTransactionDto): Promise<TransactionResponse> {
    return this.sdk.getTransactionController().sendTransaction(input);
  }
  async getPrices(asset: string): Promise<Prices> {
    return this.sdk.getPricesController().getPrices(asset);
  }
  async createTrustlineTransaction(input: CreateTrustlineTransactionDto): Promise<SignedTransaction> {
    const txController = this.sdk.getTransactionController();
    const walletController = this.sdk.getWalletController();
    const { protocol, privateKey, assetSymbol, issuer, limit, memo, fee } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol,
      privateKey,
    });
    const transaction = {
      wallet,
      assetSymbol,
      issuer,
      limit,
      memo,
      fee,
    } as any;
    switch (protocol) {
      case TrustlineProtocol.STELLAR:
        return txController.createStellarTrustlineTransaction(transaction);
      case TrustlineProtocol.RIPPLE:
        return txController.createRippleTrustlineTransaction(transaction);
      default:
        throw new BadRequestException('Unsupported protocol');
    }
  }
  async createStellarTransferTransaction(input: CreateStellarTransferTransactionDto): Promise<SignedTransaction> {
    const txController = this.sdk.getTransactionController();
    const walletController = this.sdk.getWalletController();
    const { privateKey, issuer, assetSymbol, amount, destination, memo, createAccount, fee } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol: Protocol.STELLAR,
      privateKey,
    });
    return txController.createStellarTransferTransaction({
      wallet,
      assetSymbol,
      issuer,
      amount,
      destination,
      createAccount,
      memo,
      fee,
    } as StellarTransferTransactionInput);
  }
  async createRippleTransferTransaction(input: CreateRippleTransferTransactionDto): Promise<SignedTransaction> {
    const txController = this.sdk.getTransactionController();
    const walletController = this.sdk.getWalletController();
    const { privateKey, issuer, assetSymbol, amount, destination, memo, fee } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol: Protocol.RIPPLE,
      privateKey,
    });
    return txController.createRippleTransferTransaction({
      wallet,
      assetSymbol,
      issuer,
      amount,
      destination,
      memo,
      fee,
    } as RippleTransferTransactionInput);
  }
  async createCeloTransferTransaction(input: CreateCeloTransferTransactionDto): Promise<SignedTransaction> {
    const txController = this.sdk.getTransactionController();
    const walletController = this.sdk.getWalletController();
    const { privateKey, tokenSymbol, contractAddress, amount, destination, feeCurrency, fee } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol: Protocol.CELO,
      privateKey,
    });
    return txController.createCeloTransferTransaction({
      wallet,
      tokenSymbol,
      contractAddress,
      amount,
      destination,
      feeCurrency,
      fee,
    } as CeloTransferTransactionInput);
  }
  async createEthereumTransferTransaction(input: CreateEthereumTransferTransactionDto): Promise<SignedTransaction> {
    const txController = this.sdk.getTransactionController();
    const walletController = this.sdk.getWalletController();
    const { privateKey, tokenSymbol, contractAddress, amount, destination, fee } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol: Protocol.ETHEREUM,
      privateKey,
    });
    return txController.createEthereumTransferTransaction({
      wallet,
      tokenSymbol,
      contractAddress,
      amount,
      destination,
      fee,
    } as EthereumTransferTransactionInput);
  }
  async createBscTransferTransaction(input: CreateEthereumTransferTransactionDto): Promise<SignedTransaction> {
    const txController = this.sdk.getTransactionController();
    const walletController = this.sdk.getWalletController();
    const { privateKey, tokenSymbol, contractAddress, amount, destination, fee } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol: Protocol.BSC,
      privateKey,
    });
    return txController.createBscTransferTransaction({
      wallet,
      tokenSymbol,
      contractAddress,
      amount,
      destination,
      fee,
    } as EthereumTransferTransactionInput);
  }
  async createBitcoinTransferTransaction(input: CreateBitcoinTransferTransactionDto): Promise<SignedTransaction> {
    const txController = this.sdk.getTransactionController();
    const walletController = this.sdk.getWalletController();
    const { privateKey, inputs, outputs } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol: Protocol.BITCOIN,
      privateKey,
    });
    return txController.createBitcoinTransferTransaction({
      wallet,
      inputs,
      outputs,
    } as BitcoinTransferTransactionInput);
  }
  async createHathorTransferTransaction(input: CreateHathorTransferTransactionDto): Promise<SignedTransaction> {
    const txController = this.sdk.getTransactionController();
    const { privateKey, inputs, outputs } = input;

    if (privateKey) {
      const walletController = this.sdk.getWalletController();
      const wallet = await walletController.generateWalletFromPrivateKey({
        protocol: Protocol.HATHOR,
        privateKey,
      });
      return txController.createHathorTransferTransactionFromWallet({
        wallet,
        outputs,
      } as HathorTransferTransactionInput);
    } else if (inputs) {
      return txController.createHathorTransferTransactionFromUTXO({
        inputs,
        outputs,
      } as HathorTransferTransactionInput);
    } else {
      throw new BadRequestException('Missing private key or inputs');
    }
  }
  async createCardanoTransferTransaction(input: CreateCardanoTransferTransactionDto): Promise<SignedTransaction> {
    const txController = this.sdk.getTransactionController();
    const { privateKey, inputs, outputs } = input;

    if (privateKey) {
      const walletController = this.sdk.getWalletController();
      const wallet = await walletController.generateWalletFromPrivateKey({
        protocol: Protocol.CARDANO,
        privateKey,
      } as any);
      return txController.createCardanoTransferTransactionFromWallet({
        wallet,
        outputs,
      } as any);
    } else if (inputs) {
      return txController.createCardanoTransferTransactionFromUTXO({
        inputs,
        outputs,
      } as any);
    } else {
      throw new BadRequestException('Missing private key or inputs');
    }
  }
  async createSolanaTransferTransaction(input: CreateSolanaTransferTransactionDto): Promise<SignedTransaction> {
    const txController = this.sdk.getTransactionController();
    const walletController = this.sdk.getWalletController();
    const { privateKey, token, amount, destination } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol: Protocol.SOLANA,
      privateKey,
    });
    wallet.publicKey = wallet.address
    return txController.createSolanaTransferTransaction({
      wallet,
      token,
      amount,
      destination,
    } as SolanaTransferTransactionInput);
  }
  async callSmartContractMethod(input: CallSmartContractDto): Promise<CallSmartContractResponse> {
    const { from, protocol, contractAbi, method, params, contractAddress } = input;
    const contractController = this.sdk.getContractController()
    return contractController.callMethod({
      from,
      contractAbi,
      method,
      params,
      contractAddress,
      protocol,
    });
  }
  async createSmartContractCallTransaction(input: CreateSmartContractCallTransactionDto): Promise<SignedTransaction> {
    const scController = this.sdk.getContractController();
    const walletController = this.sdk.getWalletController();
    const { protocol, privateKey, contractAddress, contractAbi, method, params, fee, feeCurrency } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol,
      privateKey,
    });
    return scController.buildMethodTransaction({
      protocol,
      wallet,
      contractAbi,
      method,
      params,
      contractAddress,
      fee,
      feeCurrency,
    });
  }
  async createSmartContractDeployTransaction(
    input: CreateSmartContractDeployTransactionDto,
  ): Promise<SignedTransaction> {
    const scController = this.sdk.getContractController();
    const walletController = this.sdk.getWalletController();
    const { protocol, privateKey, contractName, source, params, fee, feeCurrency } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol,
      privateKey,
    });
    return scController.buildDeployTransaction({
      protocol,
      wallet,
      contractName,
      source,
      params,
      fee,
      feeCurrency,
    } as SmartContractDeployTransactionInput);
  }
  async createEthTokenDeployTransaction(input: CreateEthTokenDeployTransactionDto): Promise<SignedTransaction> {
    const scController = this.sdk.getContractController();
    const walletController = this.sdk.getWalletController();
    const { protocol, privateKey, tokenType, params, fee, feeCurrency } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol,
      privateKey,
    });
    return scController.buildDeployTokenTransaction({
      protocol,
      wallet,
      tokenType,
      params,
      fee,
      feeCurrency,
    });
  }
  async createHathorTokenDeployTransaction(input: CreateHathorTokenDeployTransaction): Promise<SignedTransaction> {
    const txController = this.sdk.getTransactionController();
    const walletController = this.sdk.getWalletController();
    const { privateKey, tokenName, tokenSymbol, address, amount, mintAuthorityAddress, meltAuthorityAddress } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol: Protocol.HATHOR,
      privateKey,
    });
    return txController.createHathorTokenTransactionFromWallet({
      wallet,
      tokenName,
      tokenSymbol,
      amount,
      type: 'HATHOR_TOKEN_CREATION',
      mintAuthorityAddress,
      meltAuthorityAddress,
      address,
    });
  }
  async createHathorMintTokenTransaction(input: CreateHathorMintTokenTransaction): Promise<SignedTransaction> {
    const txController = this.sdk.getTransactionController();
    const walletController = this.sdk.getWalletController();
    const { privateKey, tokenUid, amount, mintAuthorityAddress, changeAddress, address } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol: Protocol.HATHOR,
      privateKey,
    });
    return txController.createHathorTokenTransactionFromWallet({
      wallet,
      tokenUid,
      amount,
      address,
      changeAddress,
      type: 'HATHOR_TOKEN_MINT',
      mintAuthorityAddress,
    });
  }
  async createHathorMeltTokenTransaction(input: CreateHathorMeltTokenTransaction): Promise<SignedTransaction> {
    const txController = this.sdk.getTransactionController();
    const walletController = this.sdk.getWalletController();
    const { privateKey, tokenUid, amount, changeAddress, address, meltAuthorityAddress } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol: Protocol.HATHOR,
      privateKey,
    });
    return txController.createHathorTokenTransactionFromWallet({
      wallet,
      tokenUid,
      amount,
      address,
      changeAddress,
      type: 'HATHOR_TOKEN_MELT',
      meltAuthorityAddress,
    });
  }
  async createSolanaTokenDeployTransaction(input: CreateSolanaTokenDeployTransaction): Promise<{
    mint: string,
    metadata: any,
    transaction: SignedTransaction
  }> {
    const txController = this.sdk.getTransactionController();
    const walletController = this.sdk.getWalletController();
    const { privateKey, tokenName, tokenSymbol, amount, fixedSupply, decimals } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol: Protocol.SOLANA,
      privateKey,
    });
    return txController.createSolanaTokenDeployTransaction({
      wallet,
      name: tokenName,
      symbol: tokenSymbol,
      amount,
      fixedSupply,
      decimals,
    });
  }
  async createSolanaTokenMintTransaction(input: CreateSolanaTokenMintTransaction): Promise<SignedTransaction> {
    const txController = this.sdk.getTransactionController();
    const walletController = this.sdk.getWalletController();
    const { privateKey, destination, token, amount } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol: Protocol.SOLANA,
      privateKey,
    });
    return txController.createSolanaTokenMintTransaction({
      wallet,
      destination,
      token,
      amount,
    });
  }
  async createSolanaTokenBurnTransaction(input: CreateSolanaTokenBurnTransaction): Promise<SignedTransaction> {
    const txController = this.sdk.getTransactionController();
    const walletController = this.sdk.getWalletController();
    const { privateKey, token, amount } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol: Protocol.SOLANA,
      privateKey,
    });
    return txController.createSolanaTokenBurnTransaction({
      wallet,
      token,
      amount,
    });
  }
}
