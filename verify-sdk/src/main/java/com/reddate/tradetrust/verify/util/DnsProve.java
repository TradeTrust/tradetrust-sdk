package com.reddate.tradetrust.verify.util;

import com.alibaba.fastjson.JSONObject;
import com.reddate.tradetrust.verify.type.DnsDidVerificationStatus;
import com.reddate.tradetrust.verify.type.TradeTrustDnsDidRecord;
import com.reddate.tradetrust.verify.type.TradeTrustDnsTextRecord;
import org.xbill.DNS.*;
import org.xbill.DNS.lookup.LookupResult;
import org.xbill.DNS.lookup.LookupSession;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

/**
 * @author SunKangJian
 */
public class DnsProve {

    public List<TradeTrustDnsTextRecord> getDocumentStoreRecords(String domain) {
        LookupResult lookupResult = queryDns(domain);
        return lookupResult.getRecords().stream().map(record -> {
                    String r = record.rdataToString();
                    return r.startsWith("\"") ? r.substring(1, r.length()-1) : r;
                })
                .filter(record -> record.startsWith("openatts"))
                .map(this::parseOpenAttestationRecord)
                .map(record -> record.toJavaObject(TradeTrustDnsTextRecord.class))
                .collect(Collectors.toList());
    }

    public List<TradeTrustDnsDidRecord> getDnsDidRecords(String domain) {
        LookupResult lookupResult = queryDns(domain);
        return lookupResult.getRecords().stream().map(record -> {
                    String r = record.rdataToString();
                    return r.startsWith("\"") ? r.substring(1, r.length()-1) : r;
                })
                .filter(record -> record.startsWith("openatts"))
                .map(this::parseOpenAttestationRecord)
                .peek(record -> {
                    record.put("algorithm", record.getString("a"));
                    record.put("publicKey", record.getString("p"));
                    record.put("version", record.getString("v"));
                })
                .map(record -> record.toJavaObject(TradeTrustDnsDidRecord.class))
                .collect(Collectors.toList());
    }


    public JSONObject parseOpenAttestationRecord(String recordData) {
        String type = "openatts";
        List<String> keyValuePairs = Arrays.asList(recordData.trim().substring(type.length()+1).split(" "));
        JSONObject jsonRecord = keyValuePairs.stream()
                .map(keyValue -> {
                    String[] keyValuePair = keyValue.split("=");
                    JSONObject obj = new JSONObject();
                    obj.put(keyValuePair[0].trim(), trimValue(keyValuePair[1]));
                    return obj;
                }).reduce(this::addKeyValuePairToObject).get();
        jsonRecord.put("type", type);
        return jsonRecord;
    }

    private JSONObject addKeyValuePairToObject(JSONObject prev, JSONObject next) {
        JSONObject obj = new JSONObject();
        obj.putAll(prev);
        obj.putAll(next);
        return obj;
    }

    public String trimValue(String str) {
        return str.endsWith(";") ? str.substring(0, str.length() - 1).trim() : str.trim();
    }


    public LookupResult queryDns(String domain) {
        try {
            LookupSession s = LookupSession.defaultBuilder().build();
            Name name = Name.fromString(domain);
            return s.lookupAsync(name, Type.TXT)
                    .whenComplete((answer, ex) -> {

                    }).toCompletableFuture()
                    .get();
        } catch (TextParseException | ExecutionException | InterruptedException e) {
            // e.printStackTrace();
        }
        return null;
    }

}
