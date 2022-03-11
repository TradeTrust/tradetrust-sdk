package com.reddate.tradetrust.verify.verifiers.documentstatus;

import com.reddate.tradetrust.blockchain.contract.TradeTrustERC721;
import com.reddate.tradetrust.blockchain.provider.Addresses;
import com.reddate.tradetrust.blockchain.provider.EthereumNetwork;
import com.reddate.tradetrust.blockchain.provider.Web3jProvider;
import com.reddate.tradetrust.framework.v3.SchemaV3;
import com.reddate.tradetrust.verify.common.VerifierErrorException;
import com.reddate.tradetrust.verify.common.VerificationFragment;
import com.reddate.tradetrust.framework.Verifier;
import com.reddate.tradetrust.verify.common.VerificationReason;
import com.reddate.tradetrust.verify.common.VerifierOptions;
import com.reddate.tradetrust.verify.enums.EthereumTokenRegistryStatusCode;
import com.reddate.tradetrust.verify.enums.VerificationFragmentStatus;
import com.reddate.tradetrust.verify.enums.VerificationFragmentType;
import com.reddate.tradetrust.verify.util.DocumentUtil;
import org.json.JSONArray;
import org.json.JSONObject;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

/**
 * 以太坊Token注册状态验证者
 * @author SunKangJian
 */
public class EthereumTokenRegistryStatus implements Verifier {

    private final String name = "EthereumTokenRegistryStatus";
    private final VerificationFragmentType type = VerificationFragmentType.DOCUMENT_STATUS;

    @Override
    public VerificationFragment skip(JSONObject document, VerifierOptions options) {
        return new VerificationFragment.Builder()
                .status(VerificationFragmentStatus.SKIPPED)
                .name(name)
                .type(type)
                .reason(new VerificationReason(
                        "Document issuers doesn't have \"tokenRegistry\" property or TOKEN_REGISTRY method",
                        EthereumTokenRegistryStatusCode.SKIPPED.getCode(),
                        EthereumTokenRegistryStatusCode.SKIPPED.getCodeString()
                ))
                .build();
    }

    @Override
    public boolean test(JSONObject document, VerifierOptions options) {
        if (DocumentUtil.isWrappedV2Document(document)) {
            JSONObject documentData = DocumentUtil.getData(document);
            JSONArray documentIssuers = documentData.getJSONArray("issuers");
            return documentIssuers.toList().stream()
                    .map(issuer -> (Map)issuer)
                    .anyMatch(issuer -> issuer.containsKey("tokenRegistry"));

        } else if(DocumentUtil.isWrappedV3Document(document)) {
            return SchemaV3.Method.TokenRegistry.toString().equals(document.optQuery("/openAttestationMetadata/proof/method"));
        }
        return false;
    }

    @Override
    public VerificationFragment verify(JSONObject document, VerifierOptions options) {
        if (!DocumentUtil.isWrappedV3Document(document) && !DocumentUtil.isWrappedV2Document(document)) {
            throw new VerifierErrorException(
                    "Document does not match either v2 or v3 formats.",
                    EthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT.getCode(),
                    EthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT.getCodeString()
            );
        }

        String tokenRegistry = this.getTokenRegistry(document);
        String merkleRoot = this.getMerkleRoot(document);
        JSONObject mintStatus = this.isTokenMintedOnRegistry(tokenRegistry, merkleRoot, options.getProvider());

        boolean minted = mintStatus.optBoolean("minted");
        if (minted) {
            Map<String, Object> data = new HashMap<>(2);
            data.put("mintedOnAll", true);
            if (DocumentUtil.isWrappedV3Document(document)) {
                data.put("details", new JSONArray().put(mintStatus));
            } else {
                data.put("details", mintStatus);
            }
            return new VerificationFragment.Builder()
                    .status(VerificationFragmentStatus.VALID)
                    .name(name)
                    .type(type)
                    .data(data)
                    .build();
        } else {
            VerificationReason reason = (VerificationReason)mintStatus.opt("reason");
            Map<String, Object> data = new HashMap<>(2);
            data.put("mintedOnAll", false);
            if (DocumentUtil.isWrappedV3Document(document)) {
                data.put("details", new JSONArray().put(mintStatus));
            } else {
                data.put("details", mintStatus);
            }
            return new VerificationFragment.Builder()
                    .status(VerificationFragmentStatus.INVALID)
                    .name(name)
                    .type(type)
                    .data(data)
                    .reason(reason)
                    .build();
        }
    }

    /**
     * 获取TokenRegistry合约地址
     * @param document
     * @return
     */
    private String getTokenRegistry(JSONObject document) {
        if (DocumentUtil.isWrappedV2Document(document)) {
            JSONArray documentIssuers = DocumentUtil.getData(document).getJSONArray("issuers");
            if (documentIssuers.length() != 1) {
                throw new VerifierErrorException(
                        "Only one issuer is allowed for tokens",
                        EthereumTokenRegistryStatusCode.INVALID_ISSUERS.getCode(),
                        EthereumTokenRegistryStatusCode.INVALID_ISSUERS.getCodeString()
                );
            }
            String tokenRegistry = documentIssuers.getJSONObject(0).optString("tokenRegistry");
            if (tokenRegistry == null) {
                throw new VerifierErrorException(
                        "Token registry is undefined",
                        EthereumTokenRegistryStatusCode.UNDEFINED_TOKEN_REGISTRY.getCode(),
                        EthereumTokenRegistryStatusCode.UNDEFINED_TOKEN_REGISTRY.getCodeString()
                );
            }
            return tokenRegistry;
        } else if (DocumentUtil.isWrappedV3Document(document)) {
            Object value = document.optQuery("/openAttestationMetadata/proof/value");
            if (value == null) {
                throw new VerifierErrorException(
                        "Token registry is undefined",
                        EthereumTokenRegistryStatusCode.UNDEFINED_TOKEN_REGISTRY.getCode(),
                        EthereumTokenRegistryStatusCode.UNDEFINED_TOKEN_REGISTRY.getCodeString()
                );
            }
            return value.toString();
        }

        throw new VerifierErrorException(
                "Document does not match either v2 or v3 formats.",
                EthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT.getCode(),
                EthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT.getCodeString()
        );
    }

    private String getMerkleRoot(JSONObject document) {
        if (DocumentUtil.isWrappedV2Document(document)) {
            return "0x"+document.optQuery("/signature/merkleRoot");
        } else if (DocumentUtil.isWrappedV3Document(document)) {
            return "0x"+document.optQuery("/proof/merkleRoot");
        }
        throw new VerifierErrorException(
                "Document does not match either v2 or v3 formats.",
                EthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT.getCode(),
                EthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT.getCodeString()
        );
    }

    private JSONObject isTokenMintedOnRegistry(String tokenRegistry, String merkleRoot, Web3jProvider provider) {
        JSONObject result = new JSONObject();
        result.put("minted", false);
        result.put("address", tokenRegistry);

        Web3j web3j = null;
        try {
            web3j = Web3j.build(new HttpService(provider.getEthereumNetwork().getRpcUrl()));
            TradeTrustERC721 tradeTrustERC721 = TradeTrustERC721.load(tokenRegistry, web3j, provider.getCredentials(), provider.getContractGasProvider());
            String owner = tradeTrustERC721.ownerOf(new BigInteger(merkleRoot.replace("0x",""), 16)).send();
            if (owner == null || owner.equals(Addresses.ADDRESS_ZERO)) {
                result.put("reason", new VerificationReason.Builder()
                        .message("Document "+merkleRoot+" has not been issued under contract "+tokenRegistry)
                        .code(EthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED.getCode())
                        .codeString(EthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED.getCodeString())
                        .build()
                );
            } else {
                result.put("minted", true);
            }
        } catch (Exception e) {
            // TODO decodeError
            result.put("reason", new VerificationReason.Builder()
                    .message("TODO decodeError(e), "+e.getMessage())
                    .code(EthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED.getCode())
                    .codeString(EthereumTokenRegistryStatusCode.DOCUMENT_NOT_MINTED.getCodeString())
                    .build()
            );
            // e.printStackTrace();
            /*throw new VerifierErrorException(
                    "call ownerOf error, " + e.getMessage(),
                    EthereumTokenRegistryStatusCode.UNEXPECTED_ERROR.getCode(),
                    EthereumTokenRegistryStatusCode.UNEXPECTED_ERROR.getCodeString()
            );*/
        } finally {
            if (web3j != null) {
                web3j.shutdown();
            }
        }
        return result;
    }
}
