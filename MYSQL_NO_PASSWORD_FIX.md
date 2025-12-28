# Quick Fix: MySQL No Password

## Problem
Teman Anda MySQL-nya tidak pakai password (default installation).

## Solution

Di file `application.properties`, **kosongkan password**:

```properties
spring.datasource.password=
```

**BUKAN** ini:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
```

## Full Example

File: `backend/src/main/resources/application.properties`

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/hotel_booking
spring.datasource.username=root
spring.datasource.password=

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL57Dialect

# Server Configuration
server.port=8081
```

Setelah itu run backend:
```bash
cd backend
./mvnw spring-boot:run
```

Tables akan otomatis terbuat! ✅
