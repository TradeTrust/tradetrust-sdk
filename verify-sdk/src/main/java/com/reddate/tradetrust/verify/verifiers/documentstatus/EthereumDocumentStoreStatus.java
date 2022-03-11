package com.reddate.tradetrust.verify.verifiers.documentstatus;

import com.reddate.tradetrust.framework.Verifier;
import com.reddate.tradetrust.framework.v3.SchemaV3;
import com.reddate.tradetrust.verify.common.VerificationFragment;
import com.reddate.tradetrust.verify.common.VerificationReason;
import com.reddate.tradetrust.verify.common.VerifierErrorException;
import com.reddate.tradetrust.verify.common.VerifierOptions;
import com.reddate.tradetrust.verify.enums.*;
import com.reddate.tradetrust.verify.util.DocumentUtil;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 以太坊文档存储状态验证者
 * @author SunKangJian
 */
public class EthereumDocumentStoreStatus implements Verifier {

    private final String name = "EthereumDocumentStoreStatus";
    private final VerificationFragmentType type = VerificationFragmentType.DOCUMENT_STATUS;

    @Override
    public VerificationFragment skip(JSONObject document, VerifierOptions options) {
        return new VerificationFragment.Builder()
                .status(VerificationFragmentStatus.SKIPPED)
                .name(name)
                .type(type)
                .reason(new VerificationReason(
                        "Document issuers doesn't have \"documentStore\" or \"certificateStore\" property or DOCUMENT_STORE method",
                        EthereumDocumentStoreStatusCode.SKIPPED.getCode(),
                        EthereumDocumentStoreStatusCode.SKIPPED.getCodeString()
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
                    .anyMatch(issuer -> issuer.containsKey("documentStore") || issuer.containsKey("certificateStore"));

        } else if(DocumentUtil.isWrappedV3Document(document)) {
            return SchemaV3.Method.DocumentStore.toString().equals(document.optQuery("/openAttestationMetadata/proof/method"));
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
                EthereumDocumentStoreStatusCode.UNRECOGNIZED_DOCUMENT.getCode(),
                EthereumDocumentStoreStatusCode.UNRECOGNIZED_DOCUMENT.getCodeString()
        );
    }

    public VerificationFragment verifyV2(JSONObject document, VerifierOptions options) {
        List<String> documentStores = getIssuersDocumentStores(document);
        String merkleRoot = "0x"+document.optQuery("/signature/merkleRoot");
        String targetHash = "0x"+document.optQuery("/signature/targetHash");
        // TODO 待开发功能
        return null;
    }

    public VerificationFragment verifyV3(JSONObject document, VerifierOptions options) {
        return null;
    }

    /**
     * 获取DocumentStore合约地址
     * @param document
     * @return
     */
    private List<String> getIssuersDocumentStores(JSONObject document) {
        List<String> documentStores = new ArrayList<>();
        JSONArray documentIssuers = DocumentUtil.getData(document).getJSONArray("issuers");
        for (int i = 0; i < documentIssuers.length(); i++) {
            JSONObject issuer = documentIssuers.getJSONObject(i);
            String documentStore = issuer.optString("documentStore");
            String certificateStore = issuer.optString("certificateStore");
            String documentStoreAddress = null == documentStore ? certificateStore : documentStore;
            if ( null == documentStoreAddress) {
                throw new VerifierErrorException(
                        "Document store address not found in issuer " + issuer.optString("name"),
                        EthereumDocumentStoreStatusCode.INVALID_ISSUERS.getCode(),
                        EthereumDocumentStoreStatusCode.INVALID_ISSUERS.getCodeString()
                );
            }
            documentStores.add(documentStore);
        }
        return documentStores;
    }

    /**
     * 是否签发到文档存储合约
     * @param document
     * @return
     */
    private String isIssuedOnDocumentStore(JSONObject document) {
        return null;
    }

}
