# SalonBook Database ERD & Relational Integrity

```mermaid
erDiagram
    USERS ||--o{ APPOINTMENTS : books
    SERVICES ||--o{ APPOINTMENTS : scheduled_for
    APPOINTMENTS ||--o{ TRANSACTIONS : settles
    USERS {
        ObjectId _id
        string name
        string email
        string role
        boolean isBlocked
    }
    SERVICES {
        ObjectId _id
        string name
        number price
        number duration
        boolean isActive
    }
    APPOINTMENTS {
        ObjectId _id
        ObjectId customerId
        ObjectId serviceId
        string appointmentDate
        string timeSlot
        string status
        string paymentStatus
    }
    TRANSACTIONS {
        ObjectId _id
        ObjectId appointmentId
        string stripePaymentIntentId
        number amount
        string status
    }
```
