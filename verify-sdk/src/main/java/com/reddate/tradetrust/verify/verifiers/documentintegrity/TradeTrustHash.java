package com.reddate.tradetrust.verify.verifiers.documentintegrity;

import com.reddate.tradetrust.framework.Verifier;
import com.reddate.tradetrust.framework.v2.VerifyV2;
import com.reddate.tradetrust.framework.v3.VerifyV3;
import com.reddate.tradetrust.verify.common.VerifierErrorException;
import com.reddate.tradetrust.verify.common.VerificationFragment;
import com.reddate.tradetrust.verify.common.VerificationReason;
import com.reddate.tradetrust.verify.common.VerifierOptions;
import com.reddate.tradetrust.verify.enums.TradeTrustHashCode;
import com.reddate.tradetrust.verify.enums.VerificationFragmentStatus;
import com.reddate.tradetrust.verify.enums.VerificationFragmentType;
import com.reddate.tradetrust.verify.util.DocumentUtil;
import org.json.JSONObject;

/**
 * Hash验证者，通过Hash验证文档完整性
 * @author SunKangJian
 */
public class TradeTrustHash implements Verifier {

    private final String name = "TradeTrustHash";
    private final VerificationFragmentType type = VerificationFragmentType.DOCUMENT_INTEGRITY;

    @Override
    public VerificationFragment skip(JSONObject document, VerifierOptions options) {
        return new VerificationFragment.Builder()
                .status(VerificationFragmentStatus.SKIPPED)
                .name(name)
                .type(type)
                .reason(new VerificationReason(
                        "Document does not have merkle root, target hash or data.",
                        TradeTrustHashCode.SKIPPED.getCode(),
                        TradeTrustHashCode.SKIPPED.getCodeString()
                ))
                .build();
    }

    @Override
    public boolean test(JSONObject document, VerifierOptions options) {
        return DocumentUtil.isWrappedV3Document(document) || DocumentUtil.isWrappedV2Document(document);
    }

    private boolean verifySignature(JSONObject document) {
        return DocumentUtil.isWrappedV3Document(document) ? new VerifyV3().verify(document) : new VerifyV2().verify(document);
    }

    @Override
    public VerificationFragment verify(JSONObject document, VerifierOptions options) {
        try {
            boolean hash = this.verifySignature(document);
            if (!hash) {
                return new VerificationFragment.Builder()
                        .status(VerificationFragmentStatus.INVALID)
                        .name(name)
                        .type(type)
                        .data(false)
                        .reason(new VerificationReason(
                                "Document has been tampered with",
                                TradeTrustHashCode.DOCUMENT_TAMPERED.getCode(),
                                TradeTrustHashCode.DOCUMENT_TAMPERED.getCodeString()
                        ))
                        .build();
            }
            return new VerificationFragment.Builder()
                    .status(VerificationFragmentStatus.VALID)
                    .name(name)
                    .type(type)
                    .data(true)
                    .build();
        } catch (VerifierErrorException e) {
            return new VerificationFragment.Builder()
                    .status(VerificationFragmentStatus.ERROR)
                    .name(name)
                    .type(type)
                    .data(e)
                    .reason(new VerificationReason(
                            e.getMessage(),
                            e.getCode(),
                            e.getCodeString()
                    ))
                    .build();
        } catch (Exception e) {
            return new VerificationFragment.Builder()
                    .status(VerificationFragmentStatus.ERROR)
                    .name(name)
                    .type(type)
                    .data(e)
                    .reason(new VerificationReason(
                            e.getMessage(),
                            TradeTrustHashCode.UNEXPECTED_ERROR.getCode(),
                            TradeTrustHashCode.UNEXPECTED_ERROR.getCodeString()
                    ))
                    .build();
        }
    }
}
