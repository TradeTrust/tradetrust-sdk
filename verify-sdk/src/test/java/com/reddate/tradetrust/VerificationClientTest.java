package com.reddate.tradetrust;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.reddate.tradetrust.blockchain.provider.Web3jProvider;
import com.reddate.tradetrust.framework.Verifier;
import com.reddate.tradetrust.verify.common.VerificationFragment;
import com.reddate.tradetrust.verify.common.VerifierOptions;
import com.reddate.tradetrust.verify.enums.VerificationFragmentStatus;
import com.reddate.tradetrust.verify.util.DocumentUtil;
import com.reddate.tradetrust.verify.VerificationClient;
import com.reddate.tradetrust.verify.verifiers.documentintegrity.TradeTrustHash;
import com.reddate.tradetrust.verify.verifiers.documentstatus.EthereumTokenRegistryStatus;
import com.reddate.tradetrust.verify.verifiers.issueridentity.DnsDidProof;
import com.reddate.tradetrust.verify.verifiers.issueridentity.DnsTxtProof;
import org.json.JSONObject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

class VerificationClientTest {

    static Logger logger = LoggerFactory.getLogger(VerificationClientTest.class);

    static Verifier[] verifiers;


    static {
        verifiers = new Verifier[]{
                new TradeTrustHash(),
                new EthereumTokenRegistryStatus(),
                new DnsTxtProof()
        };
    }

    @Test
    void verifyV2TokenRegistryValid() {
        JSONObject document = null;
        String filePath = "/fixtures/v2/sample.json";
        try (InputStream inputStream = DocumentUtil.class.getResourceAsStream(filePath)) {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int length;
            while ((length = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, length);
            }
            document = new JSONObject(outputStream.toString("UTF-8"));
        } catch (Exception e) {
            logger.warn("v2document not found {}", e.getMessage());
        }
        VerificationClient verificationClient = new VerificationClient.Builder()
                .setVerifiers(verifiers)
                .build();
        VerifierOptions verifierOptions = new VerifierOptions.Builder()
                .provider(Web3jProvider.getDefaultProvider())
                .build();
        List<VerificationFragment> fragments = verificationClient.verify(document, verifierOptions);
        logger.info("fragments = {}", JSON.toJSONString(fragments, SerializerFeature.PrettyFormat));

        boolean result = verificationClient.isValid(fragments);
        if (result) {
            System.out.println("document is valid!");
        }

    }

    @Test
    void verifyV3() {
        JSONObject document = null;
        try (InputStream inputStream = DocumentUtil.class.getResourceAsStream("/fixtures/v3/tokenRegistry-issued.json")) {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int length;
            while ((length = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, length);
            }
            document = new JSONObject(outputStream.toString("UTF-8"));
        } catch (Exception e) {
            logger.warn("v3document not found {}", e.getMessage());
        }
        VerificationClient verificationClient = new VerificationClient.Builder()
                .setVerifiers(verifiers)
                .build();
        VerifierOptions verifierOptions = new VerifierOptions.Builder()
                .provider(Web3jProvider.getDefaultProvider())
                .build();
        List<VerificationFragment> fragments = verificationClient.verify(document, verifierOptions);
        logger.info("fragments = {}", JSON.toJSONString(fragments));

        boolean result = verificationClient.isValid(fragments);
        if (result) {
            System.out.println("document is valid!");
        }

    }
}