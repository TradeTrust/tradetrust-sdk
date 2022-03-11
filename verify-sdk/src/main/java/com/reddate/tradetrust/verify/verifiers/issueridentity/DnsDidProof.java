package com.reddate.tradetrust.verify.verifiers.issueridentity;

import com.reddate.tradetrust.framework.Verifier;
import com.reddate.tradetrust.verify.common.VerificationFragment;
import com.reddate.tradetrust.verify.common.VerificationReason;
import com.reddate.tradetrust.verify.common.VerifierErrorException;
import com.reddate.tradetrust.verify.common.VerifierOptions;
import com.reddate.tradetrust.verify.enums.*;
import com.reddate.tradetrust.verify.type.DnsDidVerificationStatus;
import com.reddate.tradetrust.verify.type.DnsTxtVerificationStatus;
import com.reddate.tradetrust.verify.type.TradeTrustDnsDidRecord;
import com.reddate.tradetrust.verify.type.TradeTrustDnsTextRecord;
import com.reddate.tradetrust.verify.util.DnsProve;
import com.reddate.tradetrust.verify.util.DocumentUtil;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * 域名记录DID身份证明验证者
 * @author SunKangJian
 */
public class DnsDidProof implements Verifier {

    private final String name = "OpenAttestationDnsDidIdentityProof";
    private final VerificationFragmentType type = VerificationFragmentType.ISSUER_IDENTITY;

    @Override
    public VerificationFragment skip(JSONObject document, VerifierOptions options) {
        return new VerificationFragment.Builder()
                .status(VerificationFragmentStatus.SKIPPED)
                .name(name)
                .type(type)
                .reason(new VerificationReason(
                        "Document was not issued using DNS-DID",
                        TradeTrustDnsDidCode.SKIPPED.getCode(),
                        TradeTrustDnsDidCode.SKIPPED.getCodeString()
                ))
                .build();
    }

    @Override
    public boolean test(JSONObject document, VerifierOptions options) {
        if (DocumentUtil.isWrappedV2Document(document)) {
            JSONObject documentData = DocumentUtil.getData(document);
            JSONArray documentIssuers = documentData.getJSONArray("issuers");
            for (int i = 0; i < documentIssuers.length(); i++) {
                if (IdentityProofType.DNSDid.toString().equals(documentIssuers.getJSONObject(i).optQuery("/identityProof/type"))) {
                    return true;
                }
            }
        } else if(DocumentUtil.isWrappedV3Document(document)) {
            return IdentityProofType.DNSDid.toString().equals(document.optQuery("/openAttestationMetadata/identityProof/type"));
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
                TradeTrustDnsDidCode.UNRECOGNIZED_DOCUMENT.getCode(),
                TradeTrustDnsDidCode.UNRECOGNIZED_DOCUMENT.getCodeString()
        );
    }

    public VerificationFragment verifyV2(JSONObject document, VerifierOptions options) {
        JSONObject documentData = DocumentUtil.getData(document);
        JSONArray documentIssuers = documentData.getJSONArray("issuers");
        List<DnsDidVerificationStatus> verificationStatus = new ArrayList<>();
        for (int i = 0; i < documentIssuers.length(); i++) {
            JSONObject issuer = documentIssuers.getJSONObject(i);
            JSONObject identityProof = issuer.optJSONObject("identityProof");
            if (identityProof == null) {
                throw new VerifierErrorException(
                        "Identity proof missing",
                        TradeTrustDnsDidCode.MALFORMED_IDENTITY_PROOF.getCode(),
                        TradeTrustDnsDidCode.MALFORMED_IDENTITY_PROOF.getCodeString()
                );
            }
            String type = identityProof.optString("type");
            String location = identityProof.optString("location");
            String key = identityProof.optString("key");
            if (! IdentityProofType.DNSDid.toString().equals(type)) {
                throw new VerifierErrorException(
                        "Issuer is not using DID-DNS identityProof type",
                        TradeTrustDnsDidCode.INVALID_ISSUERS.getCode(),
                        TradeTrustDnsDidCode.INVALID_ISSUERS.getCodeString()
                );
            }
            if (location == null) {
                throw new VerifierErrorException(
                        "location is not present in identity proof",
                        TradeTrustDnsDidCode.MALFORMED_IDENTITY_PROOF.getCode(),
                        TradeTrustDnsDidCode.MALFORMED_IDENTITY_PROOF.getCodeString()
                );
            }
            if (key == null) {
                throw new VerifierErrorException(
                        "key is not present in identity proof",
                        TradeTrustDnsDidCode.MALFORMED_IDENTITY_PROOF.getCode(),
                        TradeTrustDnsDidCode.MALFORMED_IDENTITY_PROOF.getCodeString()
                );
            }
            verificationStatus.add(verifyIssuerDnsDid(key, location));
        }

        if (verificationStatus.stream().anyMatch(record -> "VALID".equals(record.getStatus()))) {
            return new VerificationFragment.Builder()
                    .status(VerificationFragmentStatus.VALID)
                    .name(name)
                    .type(type)
                    .data(verificationStatus)
                    .build();
        }
        return new VerificationFragment.Builder()
                .status(VerificationFragmentStatus.INVALID)
                .name(name)
                .type(type)
                .data(verificationStatus)
                .reason(new VerificationReason.Builder()
                        .message("Could not find identity at location")
                        .code(TradeTrustDnsDidCode.INVALID_IDENTITY.getCode())
                        .codeString(TradeTrustDnsDidCode.INVALID_IDENTITY.getCodeString())
                        .build())
                .build();
    }

    public DnsDidVerificationStatus verifyIssuerDnsDid(String key, String location) {
        List<TradeTrustDnsDidRecord> records = new DnsProve()
                .getDnsDidRecords(location);
        String status = records.stream()
                .anyMatch(record -> key.equalsIgnoreCase(record.getPublicKey())) ? "VALID" : "INVALID";
        return new DnsDidVerificationStatus.Builder()
                .status(status)
                .location(location)
                .key(key)
                .build();
    }

    public VerificationFragment verifyV3(JSONObject document, VerifierOptions options) {
        // TODO 待开发功能
        return null;
    }
}
