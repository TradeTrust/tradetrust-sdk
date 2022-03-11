package com.reddate.tradetrust.verify;

import com.reddate.tradetrust.framework.Verifier;
import com.reddate.tradetrust.verify.common.VerificationFragment;
import com.reddate.tradetrust.verify.common.VerifierErrorException;
import com.reddate.tradetrust.verify.common.VerifierOptions;
import com.reddate.tradetrust.verify.enums.TradeTrustDidCode;
import com.reddate.tradetrust.verify.enums.TradeTrustDnsDidCode;
import com.reddate.tradetrust.verify.enums.VerificationFragmentStatus;
import com.reddate.tradetrust.verify.enums.VerificationFragmentType;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author SunKangJian
 */
public class VerificationClient {

    private static final Logger logger = LoggerFactory.getLogger(VerificationClient.class);

    private final List<Verifier> verifiers;

    VerificationClient(Builder builder) {
        verifiers = Arrays.asList(builder.verifiers);
    }

    public static final class Builder {

        Verifier[] verifiers;

        public Builder() {
            verifiers = new Verifier[0];
        }

        public Builder setVerifiers(Verifier... verifiers) {
            try {
                this.verifiers = verifiers;
            } catch (Exception e) {
                logger.info("setVerifiers failed, {}", e.getMessage());
            }
            return this;
        }

        public VerificationClient build() {
            return new VerificationClient(this);
        }
    }

    /**
     * 遍历验证者，验证文档
     * @param document 文档
     * @return 验证片段的集合
     */
    public List<VerificationFragment> verify(JSONObject document, VerifierOptions options) {
        return verifiers.stream().map(verifier -> {
            if (verifier.test(document, options)) {
                return verifier.verify(document, options);
            }
            return verifier.skip(document, options);
        }).collect(Collectors.toList());
    }

    /**
     * 检查验证片段，使用默认验证类型集合
     * @param verificationFragments
     * @return
     */
    public boolean isValid(List<VerificationFragment> verificationFragments) {
        List<VerificationFragmentType> types = new ArrayList<>();
        types.add(VerificationFragmentType.DOCUMENT_INTEGRITY);
        types.add(VerificationFragmentType.DOCUMENT_STATUS);
        types.add(VerificationFragmentType.ISSUER_IDENTITY);
        return isValid(verificationFragments, types);
    }
    /**
     * 检查验证片段
     * @param verificationFragments
     * @param types
     * @return true:有效, false:无效
     */
    public boolean isValid(List<VerificationFragment> verificationFragments, List<VerificationFragmentType> types) {
        if (verificationFragments.size() < 1) {
            throw new VerifierErrorException(
                    "Please provide at least one verification fragment to check",
                    TradeTrustDnsDidCode.UNEXPECTED_ERROR.getCode(),
                    TradeTrustDidCode.UNEXPECTED_ERROR.getCodeString()
            );
        }
        if (types.size() < 1) {
            throw new VerifierErrorException(
                    "Please provide at least one type to check",
                    TradeTrustDnsDidCode.UNEXPECTED_ERROR.getCode(),
                    TradeTrustDidCode.UNEXPECTED_ERROR.getCodeString()
            );
        }
        return types.stream().allMatch(type -> {
            List<VerificationFragment> verificationFragmentsForType = verificationFragments.stream()
                    .filter(fragment -> fragment.getType() == type)
                    .collect(Collectors.toList());
            // 只要有1个片段的状态为VALID，则返回true
            // 所有片段状态为VALID或SKIPPED
            return verificationFragmentsForType.stream().anyMatch(fragment -> fragment.getStatus() == VerificationFragmentStatus.VALID) &&
                    verificationFragmentsForType.stream().allMatch(fragment -> fragment.getStatus() == VerificationFragmentStatus.VALID || fragment.getStatus() == VerificationFragmentStatus.SKIPPED);
        });
    }
}
