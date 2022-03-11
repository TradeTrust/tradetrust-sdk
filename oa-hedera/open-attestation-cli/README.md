# 一、可验证文档

## 1.创建Hedera钱包

按照Hedera官网地址（https://portal.hedera.com/register）创建一个钱包wallet.json。

例如：

```json
{
    "operator":{
        "accountId":"0.0.30796303",
        "publicKey":"302a300506032b6570032100ec8b2e4d421bb0569a14cb22f784f11a543b2c4cf350046a7a03f9d25f0a0031",
        "privateKey":"302e020100300506032b657004220420efbe86cf4545011e0b9cbee7872d852d3b9701d12efc5dd235dd580001b04aa5"
    }
}
```



## 2.部署可验证文档智能合约

-   命令：

`ts-node src/index.ts deploy document-store "My first document store" --network testnet --encrypted-wallet-path wallet.json`

--path 创建的hedera钱包路径

## 3.可验证文档身份DNS

### 3.1可验证文档临时身份DNS

-   命令：

`ts-node src/index.ts dns txt-record create --address 0.0.30802793 --network-id 3`

--address 可验证文档智能合约部署地址

### 3.2 查询DNS-TXT记录

-   命令：

`ts-node src/index.ts dns txt-record get --location temporary-copper-primate.sandbox.openattestation.com`

--location 临时DNS返回的DNS TXT记录

## 4.创建原始文档

按照OA官网地址（https://www.openattestation.com/docs/integrator-section/verifiable-document/ethereum/raw-document）的原始文档模板，需要修改documentStore、location 的值。

--documentStore 可验证文档智能合约部署地址

--location 临时DNS返回的DNS TXT记录

创建一个名为raw-documents的文件夹，在该文件夹中创建一个名为certificate-1.json的文件，并粘贴原始文档。

原始文档模板：

```json
{
    "$template":{
        "name":"main",
        "type":"EMBEDDED_RENDERER",
        "url":"https://tutorial-renderer.openattestation.com"
    },
    "recipient":{
        "name":"John Doe"
    },
    "issuers":[
        {
            "name":"Demo Issuer",
            "documentStore":"0xBBb55Bd1D709955241CAaCb327A765e2b6D69c8b",
            "identityProof":{
                "type":"DNS-TXT",
                "location":"few-green-cat.sandbox.openattestation.com"
            }
        }
    ]
}
```



## 5.包装文档

读取文件raw-documents夹中的所有文件，将它们打包，然后将文件输出到另一个目录wrapped-documents中。

-   命令：

`ts-node src/index.ts wrap raw-documents --output-dir wrapped-documents`

## 6.修改智能合约的所有者

-   命令：

`ts-node src/index.ts document-store transfer-ownership --address 0.0.30818507 --new-owner 0.0.30796303 --network testnet --encrypted-wallet-path wallet.json`

--address 可验证文档智能合约部署地址

--new-owner 新所有者的账户地址

--path 智能合约owner的钱包路径

## 7.签发文档

-   命令：

`ts-node src/index.ts document-store issue --address 0.0.30802793 --hash 0x7abe502c13cd247c30ebd4960fcfbd0cdbdc14047013ed128c52b0b973c27f6f --network testnet --encrypted-wallet-path wallet.json`

--address 可验证文档智能合约部署地址

--hash 包装文档返回的merkleRoot

--path 当前智能合约所有者的钱包路径

## 8.验证文档

-   命令：

`ts-node src/index.ts verify --document ./wrapped-documents/certificate-1.json --network testnet --v true`

--document 文档包装后保存的路径

## 9.撤销文档

-   命令：

`ts-node src/index.ts document-store revoke --address 0.0.30802793 --hash 0xb7a241a26ae60b339dac055f5835f021780682ecc1295e57513c63d82531b097 --network testnet --encrypted-wallet-path wallet.json`

--address 可验证文档智能合约部署地址

--hash 包装文档返回的merkleRoot

--path 当前智能合约所有者的钱包路径

# 二、可流转文档

## **1.部署注册合约**

-   命令：

`ts-node src/index.ts deploy token-registry "My Token Registry" MTR -n testnet --encrypted-wallet-path wallet.json`

## 2.可流转文档身份DNS

### 2.1可流转文档身份临时DNS

-   命令：

`ts-node src/index.ts dns txt-record create --address 0.0.30802795 --network-id 3`

--address 可流转文档注册合约部署地址

### 2.2查询临时DNS

-   命令：

`ts-node src/index.ts dns txt-record get --location continuing-ivory-lobster.sandbox.openattestation.com`

--location 临时DNS返回的DNS TXT记录

## 3.包装可流转文档

### 3.1创建原始文档

按照OA官网地址（https://www.openattestation.com/docs/integrator-section/transferable-record/preparing-transferable-record）的原始文档模板，需要修改tokenRegistry、location的值。

--tokenRegistry 注册合约部署地址

--location 临时DNS返回的DNS TXT记录

创建一个名为raw-documents-token的文件夹，在该文件夹中创建一个名为sample.json的文件，并粘贴原始文档。

原始文档模板：

```json
{
    "$template":{
        "name":"main",
        "type":"EMBEDDED_RENDERER",
        "url":"https://tutorial-renderer.openattestation.com"
    },
    "recipient":{
        "name":"John Doe"
    },
    "issuers":[
        {
            "name":"Demo Issuer",
            "tokenRegistry":"0x8431012Bc040942B59e3C5bf428221eab0b2f723",
            "identityProof":{
                "type":"DNS-TXT",
                "location":"automatic-orange-grouse.sandbox.openattestation.com"
            }
        }
    ]
}
```

### 3.2包装可流转文档

读取文件raw-documents-token夹中的所有文件，将它们打包，然后将文件输出到另一个目录wrapped-documents-token中。

-   命令：

`ts-node src/index.ts wrap raw-documents-token --output-dir wrapped-documents-token`

## 4.部署托管合约

-   命令：

`ts-node src/index.ts deploy title-escrow -b 0.0.30796303 -h 0.0.30796303 -r 0.0.30802795 -n testnet --encrypted-wallet-path wallet.json`

--b 可流转文档的owner（账户地址）

--h 可流转文档的holder（账户地址）

--r 可流转文档注册合约部署地址

--path 可流转文档托管合约owner的钱包路径

## 5.签发可流转文档

-   命令：

`ts-node src/index.ts token-registry issue -a 0.0.30802795 --tokenId 0x25d401c47134ffd46f86cbdf082aacf8bc42069d73dcb4a894c47cf15afbd794 --to 0.0.30802874 -n testnet --encrypted-wallet-path wallet.json`

--a 可流转文档注册合约部署地址

--tokenId 包装可流转文档返回的merkleRoot

--to 可流转文档托管合约部署地址

--path 可流转文档注册合约owner的钱包路径

## 6.验证可流转文档

-   命令：

`ts-node src/index.ts verify --document ./wrapped-documents-token/sample.json --network testnet --v true`

## 7.变更持有者

-   命令：

`ts-node src/index.ts title-escrow change-holder --token-registry 0.0.30802795 --tokenId 0x25d401c47134ffd46f86cbdf082aacf8bc42069d73dcb4a894c47cf15afbd794 --to 0.0.29650047 -n testnet --encrypted-wallet-path wallet.json`

--registry 可流转文档注册合约部署地址

--tokenId 包装可流转文档返回的merkleRoot

--to new Holder的账户地址

--path holder的钱包路径

## 8.提名转让

-   命令：

`ts-node src/index.ts title-escrow nominate-change-owner --token-registry 0.0.30802795 --tokenId 0x25d401c47134ffd46f86cbdf082aacf8bc42069d73dcb4a894c47cf15afbd794 --newOwner 0.0.29650047 -n testnet --encrypted-wallet-path wallet.json`

--registry 可流转文档注册合约部署地址

--tokenId 包装可流转文档返回的merkleRoot

--to new owner的账户地址

--path owner的钱包路径

## 9.批准转让

-   命令：

`ts-node src/index.ts title-escrow endorse-transfer-owner --token-registry 0.0.30802795 --tokenId 0x25d401c47134ffd46f86cbdf082aacf8bc42069d73dcb4a894c47cf15afbd794 -n testnet`
--encrypted-wallet-path wallet.json

--registry 可流转文档注册合约部署地址

--tokenId 包装可流转文档返回的merkelRoot

--path holder的钱包路径

## 10.变更所有者和持有者

-   命令：

`ts-node src/index.ts title-escrow endorse-change-owner --token-registry 0.0.30802795 --tokenId 0x25d401c47134ffd46f86cbdf082aacf8bc42069d73dcb4a894c47cf15afbd794 --newOwner 0.0.30796303 --newHolder 0.0.30796303 -n testnet --encrypted-wallet-path wallet.json`

--registry 可流转文档注册合约部署地址

--tokenId 包装可流转文档返回的merkleRoot

--newOwner new owner的账户地址

--newHolder new holder的账户地址

--path owner/holder共同的钱包路径

## 11.申请电放提单

-   命令：

`ts-node src/index.ts title-escrow surrender --token-registry 0.0.30802795 --tokenId 0x25d401c47134ffd46f86cbdf082aacf8bc42069d73dcb4a894c47cf15afbd794 -n testnet --encrypted-wallet-path wallet.json`

--registry 可流转文档注册合约部署地址

--tokenId 包装可流转文档返回的merkleRoot

--path owner的钱包路径

## 12.拒绝电放提单

-   命令：

`ts-node src/index.ts title-escrow reject-surrendered --token-registry 0.0.30802795 --tokenId 0x25d401c47134ffd46f86cbdf082aacf8bc42069d73dcb4a894c47cf15afbd794 -n testnet --encrypted-wallet-path wallet.json`

--registry 可流转文档注册合约部署地址

--tokenId 包装可流转文档返回的merkleRoot

--path可流转文档注册合约owner的钱包路径

## 13.接受电放提单

-   命令：

`ts-node src/index.ts title-escrow accept-surrendered --token-registry 0.0.30802795 --tokenId 0x25d401c47134ffd46f86cbdf082aacf8bc42069d73dcb4a894c47cf15afbd794 -n testnet --encrypted-wallet-path wallet.json`

--registry 可流转文档注册合约部署地址

--tokenId 包装可流转文档返回的merkleRoot

--path 可流转文档注册合约owner的钱包路径
