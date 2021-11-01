import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptumSdk from 'cryptum-sdk';
import { Block, GetBlockDto } from '../block/dto/get-block.dto';
import { Prices } from '../prices/dto/get-prices.dto';
import { GetTransactionByHashDto } from '../transaction/dto/get-transaction.dto';
import { GetUtxosDto } from '../transaction/dto/get-utxo.dto';
import { SendTransactionDto } from '../transaction/dto/send-transaction.dto';
import { Transaction, TransactionResponse, UTXO } from '../transaction/dto/transaction.dto';
import { GetWalletInfoDto } from '../wallet/dto/get-wallet-info.dto';
import { WalletInfo } from '../wallet/dto/wallet-info.dto';
import { Wallet } from '../wallet/dto/wallet.dto';
import { GenerateWalletDto } from '../wallet/dto/generate-wallet.dto';
import {
  CreateBitcoinTransferTransactionDto,
  CreateCeloTransferTransactionDto,
  CreateEthereumTransferTransactionDto,
  CreateHathorTransferTransactionDto,
  CreateRippleTransferTransactionDto,
  CreateStellarTransferTransactionDto,
  CreateTrustlineTransactionDto,
} from '../transaction/dto/create-transaction.dto';
import { Protocol, TrustlineProtocol } from './interfaces/protocols.interface';
import {
  CallSmartContractDto,
  CallSmartContractResponse,
  CreateSmartContractCallTransactionDto,
  CreateSmartContractDeployTransactionDto,
} from 'src/transaction/dto/smartcontract-transaction.dto';
import {
  CreateEthTokenDeployTransactionDto,
  CreateHathorMeltTokenTransaction,
  CreateHathorMintTokenTransaction,
  CreateHathorTokenDeployTransaction,
} from 'src/transaction/dto/token-transaction.dto';

@Injectable()
export class CryptumService {
  private sdk: CryptumSdk;

  constructor(private configService: ConfigService) {
    this.sdk = new CryptumSdk(this.configService.get<any>('cryptumConfig'));
  }
  generateRandomMnemonic(strength?: number): string {
    return this.sdk.getWalletController().generateRandomMnemonic(strength);
  }
  async generateWallet(input: GenerateWalletDto): Promise<Wallet> {
    return this.sdk.getWalletController().generateWallet(input);
  }
  async getWalletInfo(input: GetWalletInfoDto): Promise<WalletInfo> {
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
  async createTrustlineTransaction(input: CreateTrustlineTransactionDto): Promise<TransactionResponse> {
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
    };
    switch (protocol) {
      case TrustlineProtocol.STELLAR:
        return txController.createStellarTrustlineTransaction(transaction);
      case TrustlineProtocol.RIPPLE:
        return txController.createRippleTrustlineTransaction(transaction);
      default:
        throw new BadRequestException('Unsupported protocol');
    }
  }
  async createStellarTransferTransaction(input: CreateStellarTransferTransactionDto): Promise<TransactionResponse> {
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
    });
  }
  async createRippleTransferTransaction(input: CreateRippleTransferTransactionDto): Promise<TransactionResponse> {
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
    });
  }
  async createCeloTransferTransaction(input: CreateCeloTransferTransactionDto): Promise<TransactionResponse> {
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
    });
  }
  async createEthereumTransferTransaction(input: CreateEthereumTransferTransactionDto): Promise<TransactionResponse> {
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
    });
  }
  async createBscTransferTransaction(input: CreateEthereumTransferTransactionDto): Promise<TransactionResponse> {
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
    });
  }
  async createBitcoinTransferTransaction(input: CreateBitcoinTransferTransactionDto): Promise<TransactionResponse> {
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
    });
  }
  async createHathorTransferTransaction(input: CreateHathorTransferTransactionDto): Promise<TransactionResponse> {
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
      });
    } else if (inputs) {
      return txController.createHathorTransferTransactionFromUTXO({
        inputs,
        outputs,
      });
    } else {
      throw new BadRequestException('Missing private key or inputs');
    }
  }
  async callSmartContractMethod(input: CallSmartContractDto): Promise<CallSmartContractResponse> {
    const { from, protocol, contractAbi, method, params, contractAddress } = input;
    const txController = this.sdk.getTransactionController();
    return txController.callSmartContractMethod({
      from,
      contractAbi,
      method,
      params,
      contractAddress,
      protocol,
    });
  }
  async createSmartContractCallTransaction(input: CreateSmartContractCallTransactionDto): Promise<TransactionResponse> {
    const txController = this.sdk.getTransactionController();
    const walletController = this.sdk.getWalletController();
    const { protocol, privateKey, contractAddress, contractAbi, method, params, fee } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol,
      privateKey,
    });
    return txController.createSmartContractTransaction({
      protocol,
      wallet,
      contractAbi,
      method,
      params,
      contractAddress,
      fee,
    });
  }
  async createSmartContractDeployTransaction(
    input: CreateSmartContractDeployTransactionDto,
  ): Promise<TransactionResponse> {
    const txController = this.sdk.getTransactionController();
    const walletController = this.sdk.getWalletController();
    const { protocol, privateKey, contractName, source, params, fee, feeCurrency } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol,
      privateKey,
    });
    return txController.createSmartContractDeployTransaction({
      protocol,
      wallet,
      contractName,
      source,
      params,
      fee,
      feeCurrency,
    });
  }
  async createEthTokenDeployTransaction(input: CreateEthTokenDeployTransactionDto): Promise<TransactionResponse> {
    const txController = this.sdk.getTransactionController();
    const walletController = this.sdk.getWalletController();
    const { protocol, privateKey, tokenType, params, fee, feeCurrency } = input;
    const wallet = await walletController.generateWalletFromPrivateKey({
      protocol,
      privateKey,
    });
    return txController.createTokenDeployTransaction({
      protocol,
      wallet,
      tokenType,
      params,
      fee,
      feeCurrency,
    });
  }
  async createHathorTokenDeployTransaction(input: CreateHathorTokenDeployTransaction): Promise<TransactionResponse> {
    const txController = this.sdk.getTransactionController();
    const walletController = this.sdk.getWalletController();
    const { privateKey, tokenName, tokenSymbol, amount, mintAuthorityAddress, meltAuthorityAddress } = input;
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
    });
  }
  async createHathorMintTokenTransaction(input: CreateHathorMintTokenTransaction): Promise<TransactionResponse> {
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
  async createHathorMeltTokenTransaction(input: CreateHathorMeltTokenTransaction): Promise<TransactionResponse> {
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
}
