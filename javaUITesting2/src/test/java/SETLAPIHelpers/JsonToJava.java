package SETLAPIHelpers;


import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;


  public class JsonToJava {

    public static <T> T convert(String json,Class<T> clazz) throws IOException {

        Gson gson = new GsonBuilder().create();
        return gson.fromJson(json, clazz);


  }
}
