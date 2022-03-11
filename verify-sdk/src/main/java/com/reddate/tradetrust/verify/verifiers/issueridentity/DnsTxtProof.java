package com.reddate.tradetrust.verify.verifiers.issueridentity;

import com.alibaba.fastjson.JSON;
import com.reddate.tradetrust.blockchain.provider.EthereumNetwork;
import com.reddate.tradetrust.framework.v3.SchemaV3;
import com.reddate.tradetrust.verify.common.VerificationFragment;
import com.reddate.tradetrust.framework.Verifier;
import com.reddate.tradetrust.verify.common.VerificationReason;
import com.reddate.tradetrust.verify.common.VerifierErrorException;
import com.reddate.tradetrust.verify.common.VerifierOptions;
import com.reddate.tradetrust.verify.enums.*;
import com.reddate.tradetrust.verify.type.DnsTxtVerificationStatus;
import com.reddate.tradetrust.verify.type.TradeTrustDnsTextRecord;
import com.reddate.tradetrust.verify.util.DnsProve;
import com.reddate.tradetrust.verify.util.DocumentUtil;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.*;

/**
 * 域名记录身份证明验证者
 * @author SunKangJian
 */
public class DnsTxtProof implements Verifier {

    private final String name = "DnsTxtIdentityProof";
    private final VerificationFragmentType type = VerificationFragmentType.ISSUER_IDENTITY;

    @Override
    public VerificationFragment skip(JSONObject document, VerifierOptions options) {
        return new VerificationFragment.Builder()
                .status(VerificationFragmentStatus.SKIPPED)
                .name(name)
                .type(type)
                .reason(new VerificationReason(
                        "Document issuers doesn't have \"documentStore\" / \"tokenRegistry\" property or doesn't use "+ IdentityProofType.DNSTxt +" type",
                        TradeTrustDnsTxtCode.SKIPPED.getCode(),
                        TradeTrustDnsTxtCode.SKIPPED.getCodeString()
                ))
                .build();
    }

    @Override
    public boolean test(JSONObject document, VerifierOptions options) {
        if (DocumentUtil.isWrappedV2Document(document)) {
            JSONObject documentData = DocumentUtil.getData(document);
            JSONArray documentIssuers = documentData.getJSONArray("issuers");
            for (int i = 0; i < documentIssuers.length(); i++) {
                if (IdentityProofType.DNSTxt.toString().equals(documentIssuers.getJSONObject(i).optQuery("/identityProof/type"))) {
                    return true;
                }
            }
        } else if(DocumentUtil.isWrappedV3Document(document)) {
            return IdentityProofType.DNSTxt.toString().equals(document.optQuery("/openAttestationMetadata/identityProof/type"));
        }
        return false;
    }

    @Override
    public VerificationFragment verify(JSONObject document, VerifierOptions options) {
        if (DocumentUtil.isWrappedV2Document(document)) {
            return verifyV2(document, options);
        } else if (DocumentUtil.isWrappedV3Document(document)) {
            return verifyV3(document, options);
        }
        throw new VerifierErrorException(
                "Document does not match either v2 or v3 formats.",
                TradeTrustDnsTxtCode.UNRECOGNIZED_DOCUMENT.getCode(),
                TradeTrustDnsTxtCode.UNRECOGNIZED_DOCUMENT.getCodeString()
        );
    }

    public VerificationFragment verifyV2(JSONObject document, VerifierOptions options) {
        JSONObject documentData = DocumentUtil.getData(document);
        JSONArray documentIssuers = documentData.getJSONArray("issuers");
        List<DnsTxtVerificationStatus> identities = new ArrayList<>();
        for (int i = 0; i < documentIssuers.length(); i++) {
            JSONObject issuer = documentIssuers.getJSONObject(i);
            if (IdentityProofType.DNSTxt.toString().equals(issuer.optQuery("/identityProof/type"))) {
                String smartContractAddress = "";
                if (! "".equals(issuer.optString("documentStore"))) {
                    smartContractAddress = issuer.optString("documentStore");
                }
                if (! "".equals(issuer.optString("tokenRegistry"))) {
                    smartContractAddress = issuer.optString("tokenRegistry");
                }
                if (! "".equals(issuer.optString("certificateStore"))) {
                    smartContractAddress = issuer.optString("certificateStore");
                }
                String location = issuer.getJSONObject("identityProof").optString("location");
                if ("".equals(location)) {
                    throw new VerifierErrorException(
                            "Location not found in identity proof",
                            TradeTrustDnsTxtCode.INVALID_ISSUERS.getCode(),
                            TradeTrustDnsTxtCode.INVALID_ISSUERS.getCodeString()
                    );
                }
                if ("".equals(smartContractAddress)) {
                    throw new VerifierErrorException(
                            "Smart contract address not found in identity proof",
                            TradeTrustDnsTxtCode.INVALID_ISSUERS.getCode(),
                            TradeTrustDnsTxtCode.INVALID_ISSUERS.getCodeString()
                    );
                }
                identities.add(resolveIssuerIdentity(location, smartContractAddress, options));
            }
        }

        if (identities.stream().anyMatch(record -> "VALID".equals(record.getStatus()))) {
            return new VerificationFragment.Builder()
                    .status(VerificationFragmentStatus.VALID)
                    .name(name)
                    .type(type)
                    .data(identities)
                    .build();
        }
        Optional<DnsTxtVerificationStatus> invalidIdentity = identities.stream().filter(record -> "INVALID".equals(record.getStatus())).findFirst();
        if (invalidIdentity.isPresent()) {
            return new VerificationFragment.Builder()
                    .status(VerificationFragmentStatus.INVALID)
                    .name(name)
                    .type(type)
                    .data(identities)
                    .reason(invalidIdentity.get().getReason())
                    .build();
        }

        throw new VerifierErrorException(
                "Unable to retrieve the reason of the failure",
                TradeTrustDnsTxtCode.UNEXPECTED_ERROR.getCode(),
                TradeTrustDnsTxtCode.UNEXPECTED_ERROR.getCodeString()
        );
    }

    public DnsTxtVerificationStatus resolveIssuerIdentity(String location, String smartContractAddress, VerifierOptions options) {
        String chainId = options.getProvider().getEthereumNetwork().getChainId().toString();
        List<TradeTrustDnsTextRecord> tradeTrustDnsTextRecords = new DnsProve()
                .getDocumentStoreRecords(location);
        boolean matchingRecord = tradeTrustDnsTextRecords.stream().anyMatch(record -> smartContractAddress.equalsIgnoreCase(record.getAddr()) &&
                chainId.equals(record.getNetId()) &&
                "openatts".equals(record.getType()) &&
                "ethereum".equals(record.getNet()));
        if (matchingRecord) {
            return new DnsTxtVerificationStatus.Builder()
                    .status("VALID")
                    .location(location)
                    .value(smartContractAddress)
                    .build();
        } else {
            return new DnsTxtVerificationStatus.Builder()
                    .status("INVALID")
                    .location(location)
                    .value(smartContractAddress)
                    .reason(new VerificationReason.Builder()
                            .message("Matching DNS record not found for "+smartContractAddress)
                            .code(TradeTrustDnsTxtCode.MATCHING_RECORD_NOT_FOUND.getCode())
                            .codeString(TradeTrustDnsTxtCode.MATCHING_RECORD_NOT_FOUND.getCodeString())
                            .build())
                    .build();
        }
    }

    public VerificationFragment verifyV3(JSONObject document, VerifierOptions options) {
        Object method = document.optQuery("/openAttestationMetadata/proof/method");
        if (!SchemaV3.Method.DocumentStore.toString().equals(method) && !SchemaV3.Method.TokenRegistry.toString().equals(method)) {
            throw new VerifierErrorException(
                    "DNS-TXT is only supported with documents issued using document store or token registry",
                    TradeTrustDnsTxtCode.UNSUPPORTED.getCode(),
                    TradeTrustDnsTxtCode.UNSUPPORTED.getCodeString()
            );
        }
        String identifier = document.query("/openAttestationMetadata/identityProof/identifier").toString();
        String smartContractAddress = document.query("/openAttestationMetadata/proof/value").toString();
        DnsTxtVerificationStatus issuerIdentity = resolveIssuerIdentity(identifier, smartContractAddress, options);

        Map<String, Object> fragmentData = new HashMap<>();
        fragmentData.put("identifier", issuerIdentity.getLocation());
        fragmentData.put("value", issuerIdentity.getValue());
        if ("VALID".equals(issuerIdentity.getStatus())) {
            return new VerificationFragment.Builder()
                    .status(VerificationFragmentStatus.VALID)
                    .name(name)
                    .type(type)
                    .data(fragmentData)
                    .build();
        }
        return new VerificationFragment.Builder()
                .status(VerificationFragmentStatus.INVALID)
                .name(name)
                .type(type)
                .data(fragmentData)
                .reason(issuerIdentity.getReason())
                .build();
    }

}
