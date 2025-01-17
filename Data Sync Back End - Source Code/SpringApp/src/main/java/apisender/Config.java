package apisender;

import java.util.List;

public class Config {
    public List<ServerDetails> servers;
    public List<Query> queries;
    public Target target;

    public Config() {
    }

  
    @Override
    public String toString() {
        return "Config{servers=" + servers + ", queries=" + queries + ", target=" + target + "}";
    }
}
