package com.reddate.tradetrust.framework.v3;

import com.github.wnameless.json.flattener.FlattenMode;
import com.github.wnameless.json.flattener.JsonFlattener;
import com.reddate.tradetrust.verify.common.VerifierErrorException;
import com.reddate.tradetrust.verify.enums.EthereumTokenRegistryStatusCode;
import org.json.JSONArray;
import org.json.JSONObject;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

public class Salt {

    public static final int ENTROPY_IN_BYTES = 32;

    public static List<Map<String, String>> decodeSalt(String salts) {
        JSONArray decoded = new JSONArray(new String(Base64.getDecoder().decode(salts), StandardCharsets.UTF_8));
        List<Map<String, String>> decodedList = decoded.toList().stream()
                .map(salt -> (HashMap<String, String>)salt)
                .collect(Collectors.toList());
        decodedList.forEach(salt -> {
            if (salt.get("value").length() != ENTROPY_IN_BYTES * 2) {
                throw new VerifierErrorException(
                        "Salt must be "+ENTROPY_IN_BYTES+" bytes",
                        EthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT.getCode(),
                        EthereumTokenRegistryStatusCode.UNRECOGNIZED_DOCUMENT.getCodeString()
                );
            }
        });
        return decodedList;
    }

    public static List<Map<String, Object>> salt(JSONObject documentWithoutProof) {
        Map<String, Object> flattenedData = JsonFlattener.flattenAsMap(documentWithoutProof.toString());
        List<Map<String, Object>> visibleSalts = flattenedData.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("path", entry.getKey());
                    map.put("value", entry.getValue());
                    return map;
                }).collect(Collectors.toList());
        return visibleSalts;
    }
}
