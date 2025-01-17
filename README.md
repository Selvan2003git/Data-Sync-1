
# Data Sync
This repository contains the source code for the Data Sync Application with a React + TypeScript + Vite front end and a Spring Boot back end.




##  Requirements

### Front-End Requirements

 - [Node.js](https://nodejs.org/) (for the React app)


### Back-End Requirements

- [Java JDK 23](https://adoptopenjdk.net/) (for the Spring Boot app)

- Maven (included with the project)
## Build Instructions

### Front-End Setup

1. Navigate to the frontend/ directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```
The application will be available at http://localhost:5173.

4. Build for production:

```bash
npm run build
```

The production-ready files will be in the **dist/** directory. Copy the contents of the **dist**/ directory and place them in the **static/** folder of the backend application.

In the backend project, ensure the **static/** folder is located under **src/main/resources/** so that the files can be served by the Spring Boot application.

### Back-End Setup

1. Navigate to the backend/ directory:

```bash
cd backend
```

2. Build the Spring Boot application:
#### On Linux/macOS:
```bash
./mvnw install:install-file \
  -Dfile=lib/AnalyticsClient-2.6.0.jar \
  -DgroupId=com.example \
  -DartifactId=analytics-client \
  -Dversion=2.6.0 \
  -Dpackaging=jar
```

#### On Windows:
```bash
mvnw.cmd install:install-file ^
  -Dfile=lib/AnalyticsClient-2.6.0.jar ^
  -DgroupId=com.example ^
  -DartifactId=analytics-client ^
  -Dversion=2.6.0 ^
  -Dpackaging=jar

```




3. Build the Spring Boot application:
#### On Linux/macOS:
```bash
./mvnw clean install
```

#### On Windows:
```bash
mvnw.cmd clean install
```

4. Run the Application:

#### On Linux/macOS:
```bash
java -jar target/<your-backend-application>.jar
```

#### On Windows:
```bash
java -jar target\<your-backend-application>.jar
```
The application will be available at http://localhost:8086.
