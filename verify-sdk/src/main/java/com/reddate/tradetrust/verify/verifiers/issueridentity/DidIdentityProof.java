package com.reddate.tradetrust.verify.verifiers.issueridentity;

import com.reddate.tradetrust.framework.Verifier;
import com.reddate.tradetrust.verify.common.VerificationFragment;
import com.reddate.tradetrust.verify.common.VerificationReason;
import com.reddate.tradetrust.verify.common.VerifierErrorException;
import com.reddate.tradetrust.verify.common.VerifierOptions;
import com.reddate.tradetrust.verify.enums.*;
import com.reddate.tradetrust.verify.util.DocumentUtil;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.List;
import java.util.Map;

/**
 * DID身份证明验证者
 * @author SunKangJian
 */
public class DidIdentityProof implements Verifier {

    private final String name = "DidIdentityProof";
    private final VerificationFragmentType type = VerificationFragmentType.ISSUER_IDENTITY;

    @Override
    public VerificationFragment skip(JSONObject document, VerifierOptions options) {
        return new VerificationFragment.Builder()
                .status(VerificationFragmentStatus.SKIPPED)
                .name(name)
                .type(type)
                .reason(new VerificationReason(
                        "Document is not using DID as top level identifier or has not been wrapped",
                        TradeTrustHashCode.SKIPPED.getCode(),
                        TradeTrustHashCode.SKIPPED.getCodeString()
                ))
                .build();
    }

    @Override
    public boolean test(JSONObject document, VerifierOptions options) {
        if (DocumentUtil.isWrappedV2Document(document)) {
            JSONObject documentData = DocumentUtil.getData(document);
            JSONArray documentIssuers = documentData.getJSONArray("issuers");
            for (int i = 0; i < documentIssuers.length(); i++) {
                if (IdentityProofType.Did.getCodeString().equals(documentIssuers.getJSONObject(i).optQuery("/identityProof/type"))) {
                    return true;
                }
            }
        } else if(DocumentUtil.isWrappedV3Document(document)) {
            return IdentityProofType.Did.getCodeString().equals(document.optQuery("/openAttestationMetadata/identityProof/type"));
        }
        return false;
    }

    @Override
    public VerificationFragment verify(JSONObject document, VerifierOptions options) {
        return verifyV2(document, options);
    }

    public VerificationFragment verifyV2(JSONObject document, VerifierOptions options) {
        if (!DocumentUtil.isWrappedV2Document(document)) {
            throw new VerifierErrorException(
                    "Document is not signed",
                    TradeTrustDidCode.UNSIGNED.getCode(),
                    TradeTrustDidCode.UNSIGNED.getCodeString()
            );
        }
        JSONObject documentData = DocumentUtil.getData(document);
        String merkleRoot = "0x"+document.optQuery("/signature/merkleRoot");
        //List<Object> signatureVerificationDeferred =
        // TODO 待开发功能
        return null;
    }

}
