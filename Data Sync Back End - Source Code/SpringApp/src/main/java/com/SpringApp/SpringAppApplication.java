package com.SpringApp;



import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.io.IOException;
import java.net.ServerSocket;

@SpringBootApplication
public class SpringAppApplication {

    public static void main(String[] args) {
     
        try {
            int availablePort = findAvailablePort(8000, 9000);
            availablePort = 8086;
            

            
            System.setProperty("server.port", String.valueOf(availablePort));

 
            SpringApplication.run(SpringAppApplication.class, args);
            System.out.println("Application is running on port: http://localhost:" + availablePort);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Method to find an available port within the given range
    public static int findAvailablePort(int startPort, int endPort) throws IOException {
        for (int port = startPort; port <= endPort; port++) {
            if (isPortAvailable(port)) {
                return port;
            }
        }
        throw new IOException("No available port found in the range.");
    }

    // Check if a port is available
    public static boolean isPortAvailable(int port) {
        try (ServerSocket socket = new ServerSocket(port)) {
            socket.setReuseAddress(true);
            return true;
        } catch (IOException e) {
            return false;
        }
    }
}
