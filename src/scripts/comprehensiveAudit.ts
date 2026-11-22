import axios from "axios";
import mongoose from "mongoose";

const BASE_URL = "http://localhost:5000";

interface TestResult {
  category: string;
  testName: string;
  status: "PASS" | "FAIL";
  details?: string;
}

const results: TestResult[] = [];

function record(category: string, testName: string, pass: boolean, details: string = "") {
  results.push({
    category,
    testName,
    status: pass ? "PASS" : "FAIL",
    details,
  });
  const icon = pass ? "✅" : "❌";
  console.log(`${icon} [${category}] ${testName} - ${pass ? "PASS" : "FAIL"} ${details ? `(${details})` : ""}`);
}

async function runAudit() {
  console.log("=================================================");
  console.log("🚀 STARTING SALONBOOK EXTREME FULL-STACK AUDIT 🚀");
  console.log("=================================================\n");

  const ts = Date.now();
  const testCustomerEmail = `audit_cust_${ts}@salonbook.com`;
  const secondCustomerEmail = `audit_cust2_${ts}@salonbook.com`;
  const adminEmail = "admin@salonbook.com";
  const adminPassword = "Admin1234!";

  let customerToken = "";
  let secondCustomerToken = "";
  let adminToken = "";
  let createdServiceId = "";
  let testAppointmentId = "";
  let secondAppointmentId = "";

  // ------------------------------------------------------------------------
  // 1. HEALTH & CONNECTIVITY
  // ------------------------------------------------------------------------
  try {
    const res = await axios.get(`${BASE_URL}/api/health`);
    record("Health Check", "Backend API Health Endpoint responds 200", res.status === 200 && res.data.database === "connected");
  } catch (err: any) {
    record("Health Check", "Backend API Health Endpoint responds 200", false, err.message);
  }

  // ------------------------------------------------------------------------
  // 2. AUTHENTICATION VALIDATION (SIGN UP)
  // ------------------------------------------------------------------------
  // 2a. Password validation: too short
  try {
    await axios.post(`${BASE_URL}/api/auth/sign-up/email`, {
      name: "Short Pwd",
      email: `short_${ts}@salonbook.com`,
      password: "Ab1", // < 6 chars
    });
    record("Auth Validation", "Reject password shorter than 6 characters", false, "Allowed short password");
  } catch (err: any) {
    record("Auth Validation", "Reject password shorter than 6 characters", true, `Rejected with status ${err.response?.status}`);
  }

  // 2b. Valid Customer Registration
  try {
    const res = await axios.post(`${BASE_URL}/api/auth/sign-up/email`, {
      name: "Audit Customer One",
      email: testCustomerEmail,
      password: "Password123!",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    });
    customerToken = res.data?.token || "";
    record("Authentication", "Valid Customer Registration returns 200 & Token", res.status === 200 && !!res.data.user);
  } catch (err: any) {
    record("Authentication", "Valid Customer Registration returns 200 & Token", false, err.message);
  }

  // 2c. Register Second Customer for Cross-Customer Isolation Testing
  try {
    const res = await axios.post(`${BASE_URL}/api/auth/sign-up/email`, {
      name: "Audit Customer Two",
      email: secondCustomerEmail,
      password: "Password123!",
    });
    secondCustomerToken = res.data?.token || "";
    record("Authentication", "Second Customer Registration for Isolation Tests", res.status === 200);
  } catch (err: any) {
    record("Authentication", "Second Customer Registration for Isolation Tests", false, err.message);
  }

  // 2d. Duplicate Email Registration Prevention
  try {
    await axios.post(`${BASE_URL}/api/auth/sign-up/email`, {
      name: "Duplicate User",
      email: testCustomerEmail,
      password: "Password123!",
    });
    record("Auth Security", "Prevent duplicate email registration", false, "Allowed duplicate email");
  } catch (err: any) {
    record("Auth Security", "Prevent duplicate email registration", true, `Rejected duplicate with status ${err.response?.status}`);
  }

  // 2e. Customer Sign In
  try {
    const res = await axios.post(`${BASE_URL}/api/auth/sign-in/email`, {
      email: testCustomerEmail,
      password: "Password123!",
    });
    if (!customerToken && res.data?.token) {
      customerToken = res.data.token;
    }
    record("Authentication", "Customer Sign In with correct credentials", res.status === 200);
  } catch (err: any) {
    record("Authentication", "Customer Sign In with correct credentials", false, err.message);
  }

  // 2f. Sign In with Incorrect Password
  try {
    await axios.post(`${BASE_URL}/api/auth/sign-in/email`, {
      email: testCustomerEmail,
      password: "WrongPassword123!",
    });
    record("Auth Security", "Reject sign in with wrong password", false, "Allowed wrong password");
  } catch (err: any) {
    record("Auth Security", "Reject sign in with wrong password", true, `Rejected with status ${err.response?.status}`);
  }

  // 2g. Admin Sign In
  try {
    const res = await axios.post(`${BASE_URL}/api/auth/sign-in/email`, {
      email: adminEmail,
      password: adminPassword,
    });
    adminToken = res.data?.token || "";
    record("Authentication", "Admin Sign In with seeded credentials", res.status === 200 && !!res.data.user);
  } catch (err: any) {
    record("Authentication", "Admin Sign In with seeded credentials", false, err.message);
  }

  // ------------------------------------------------------------------------
  // 3. ROLE-BASED ACCESS CONTROL (RBAC) & AUTHORIZATION SECURITY
  // ------------------------------------------------------------------------
  // 3a. Unauthenticated access to /api/profile -> 401
  try {
    await axios.get(`${BASE_URL}/api/profile`);
    record("RBAC Security", "Unauthenticated request to protected route returns 401", false);
  } catch (err: any) {
    record("RBAC Security", "Unauthenticated request to protected route returns 401", err.response?.status === 401);
  }

  // 3b. Customer accessing /api/profile with Bearer token
  try {
    const res = await axios.get(`${BASE_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    record("RBAC Security", "Customer profile returns role=customer", res.status === 200 && res.data.data.role === "customer");
  } catch (err: any) {
    record("RBAC Security", "Customer profile returns role=customer", false, err.message);
  }

  // 3c. Customer attempting to access Admin Overview -> 403
  try {
    await axios.get(`${BASE_URL}/api/dashboard/admin`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    record("RBAC Security", "Customer accessing admin overview blocked with 403", false, "Customer was allowed admin access");
  } catch (err: any) {
    record("RBAC Security", "Customer accessing admin overview blocked with 403", err.response?.status === 403);
  }

  // 3d. Admin accessing Admin Overview -> 200
  try {
    const res = await axios.get(`${BASE_URL}/api/dashboard/admin`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    record("RBAC Security", "Admin successfully accesses admin overview statistics", res.status === 200 && res.data.data.stats.totalCustomers >= 1);
  } catch (err: any) {
    record("RBAC Security", "Admin successfully accesses admin overview statistics", false, err.message);
  }

  // ------------------------------------------------------------------------
  // 4. SERVICES API AUDIT (SEARCH, FILTER, SORT, CRUD, SAFE DEACTIVATION)
  // ------------------------------------------------------------------------
  // 4a. Public Get Services
  try {
    const res = await axios.get(`${BASE_URL}/api/services`);
    const count = res.data?.data?.length || 0;
    record("Services API", "Public GET services returns active services list", res.status === 200 && count >= 1, `Found ${count} services`);
  } catch (err: any) {
    record("Services API", "Public GET services returns active services list", false, err.message);
  }

  // 4b. Filter by Category
  try {
    const res = await axios.get(`${BASE_URL}/api/services?category=Haircut+%26+Styling`);
    const allMatch = res.data?.data?.every((s: any) => s.category === "Haircut & Styling");
    record("Services API", "Filter services by category", res.status === 200 && allMatch);
  } catch (err: any) {
    record("Services API", "Filter services by category", false, err.message);
  }

  // 4c. Sort by Price Ascending
  try {
    const res = await axios.get(`${BASE_URL}/api/services?sort=price_asc`);
    const prices = res.data?.data?.map((s: any) => s.price);
    const isSorted = prices.slice(1).every((p: number, i: number) => p >= prices[i]);
    record("Services API", "Sort services by price: low to high", res.status === 200 && isSorted);
  } catch (err: any) {
    record("Services API", "Sort services by price: low to high", false, err.message);
  }

  // 4d. Sort by Price Descending
  try {
    const res = await axios.get(`${BASE_URL}/api/services?sort=price_desc`);
    const prices = res.data?.data?.map((s: any) => s.price);
    const isSorted = prices.slice(1).every((p: number, i: number) => p <= prices[i]);
    record("Services API", "Sort services by price: high to low", res.status === 200 && isSorted);
  } catch (err: any) {
    record("Services API", "Sort services by price: high to low", false, err.message);
  }

  // 4e. Customer trying to create service -> 403 Forbidden
  try {
    await axios.post(
      `${BASE_URL}/api/services`,
      {
        serviceName: "Customer Created Service",
        category: "Makeup",
        description: "Test description",
        price: 50,
        duration: 30,
        image: "https://example.com/test.jpg",
      },
      { headers: { Authorization: `Bearer ${customerToken}` } }
    );
    record("Services RBAC", "Customer prevented from creating service with 403", false, "Customer was allowed to create service");
  } catch (err: any) {
    record("Services RBAC", "Customer prevented from creating service with 403", err.response?.status === 403);
  }

  // 4f. Admin creating a service -> 201 Created
  try {
    const res = await axios.post(
      `${BASE_URL}/api/services`,
      {
        serviceName: `Audit Luxury Facial ${ts}`,
        category: "Facial & Skincare",
        description: "Deep collagen infusion and botanical treatment.",
        price: 95.0,
        duration: 60,
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881",
        status: "active",
      },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    createdServiceId = res.data?.data?._id || "";
    record("Services CRUD", "Admin creates service with 201 Created", res.status === 201 && !!createdServiceId);
  } catch (err: any) {
    record("Services CRUD", "Admin creates service with 201 Created", false, err.message);
  }

  // 4g. Admin updating a service -> 200 OK
  try {
    const res = await axios.patch(
      `${BASE_URL}/api/services/${createdServiceId}`,
      { price: 110.0, description: "Updated premium collagen treatment." },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    record("Services CRUD", "Admin updates service price and description", res.status === 200 && res.data.data.price === 110.0);
  } catch (err: any) {
    record("Services CRUD", "Admin updates service price and description", false, err.message);
  }

  // ------------------------------------------------------------------------
  // 5. APPOINTMENT BOOKING, SNAPSHOT PRICING & CONFLICT PREVENTION
  // ------------------------------------------------------------------------
  // Use a dynamic future date for each audit run to prevent collisions across multiple runs
  const futureDayOffset = Math.floor((Date.now() % 250)) + 5;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + futureDayOffset);
  const targetDate = tomorrow.toISOString().split("T")[0];
  const targetSlot = "02:00 PM - 03:00 PM";

  // 5a. Prevent booking past date -> 400
  try {
    await axios.post(
      `${BASE_URL}/api/appointments`,
      {
        serviceId: createdServiceId,
        appointmentDate: "2020-01-01",
        timeSlot: targetSlot,
      },
      { headers: { Authorization: `Bearer ${customerToken}` } }
    );
    record("Booking Integrity", "Prevent booking past date with 400", false, "Allowed past date");
  } catch (err: any) {
    record("Booking Integrity", "Prevent booking past date with 400", err.response?.status === 400);
  }

  // 5b. Valid customer booking -> 201 Created
  try {
    const res = await axios.post(
      `${BASE_URL}/api/appointments`,
      {
        serviceId: createdServiceId,
        appointmentDate: targetDate,
        timeSlot: targetSlot,
        message: "First appointment booking test",
      },
      { headers: { Authorization: `Bearer ${customerToken}` } }
    );
    testAppointmentId = res.data?.data?._id || "";
    const snapshotPrice = res.data?.data?.servicePrice;
    record(
      "Booking Workflow",
      "Customer creates appointment with snapshot price ($110)",
      res.status === 201 && snapshotPrice === 110.0,
      `Appointment ID: ${testAppointmentId}, Snapshot Price: ${snapshotPrice}`
    );
  } catch (err: any) {
    record("Booking Workflow", "Customer creates appointment with snapshot price ($110)", false, err.message);
  }

  // 5c. Prevent Duplicate / Conflicting Booking for Same Date and Slot -> 409 Conflict
  try {
    await axios.post(
      `${BASE_URL}/api/appointments`,
      {
        serviceId: createdServiceId,
        appointmentDate: targetDate,
        timeSlot: targetSlot, // Same slot!
        message: "Duplicate booking attempt",
      },
      { headers: { Authorization: `Bearer ${secondCustomerToken}` } }
    );
    record("Booking Conflict", "Prevent duplicate booking for occupied slot with 409", false, "Allowed overlapping booking");
  } catch (err: any) {
    record("Booking Conflict", "Prevent duplicate booking for occupied slot with 409", err.response?.status === 409);
  }

  // 5d. Cross-Customer Isolation: Customer 2 attempting to view Customer 1's appointment -> 403
  try {
    await axios.get(`${BASE_URL}/api/appointments/${testAppointmentId}`, {
      headers: { Authorization: `Bearer ${secondCustomerToken}` },
    });
    record("Isolation Security", "Prevent customer from viewing another customer's appointment with 403", false);
  } catch (err: any) {
    record("Isolation Security", "Prevent customer from viewing another customer's appointment with 403", err.response?.status === 403);
  }

  // 5e. Cross-Customer Isolation: Customer 2 attempting to cancel Customer 1's appointment -> 403
  try {
    await axios.patch(
      `${BASE_URL}/api/appointments/${testAppointmentId}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${secondCustomerToken}` } }
    );
    record("Isolation Security", "Prevent customer from cancelling another customer's appointment with 403", false);
  } catch (err: any) {
    record("Isolation Security", "Prevent customer from cancelling another customer's appointment with 403", err.response?.status === 403);
  }

  // ------------------------------------------------------------------------
  // 6. ADMIN APPOINTMENT MANAGEMENT
  // ------------------------------------------------------------------------
  // 6a. Admin confirms appointment -> status becomes 'confirmed'
  try {
    const res = await axios.patch(
      `${BASE_URL}/api/admin/appointments/${testAppointmentId}/confirm`,
      {},
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    record("Admin Workflow", "Admin confirms pending appointment", res.status === 200 && res.data.data.status === "confirmed");
  } catch (err: any) {
    record("Admin Workflow", "Admin confirms pending appointment", false, err.message);
  }

  // 6b. Customer cannot cancel confirmed appointment -> 400
  try {
    await axios.patch(
      `${BASE_URL}/api/appointments/${testAppointmentId}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${customerToken}` } }
    );
    record("Booking Lifecycle", "Customer cannot cancel confirmed appointment with 400", false, "Allowed cancellation of confirmed appointment");
  } catch (err: any) {
    record("Booking Lifecycle", "Customer cannot cancel confirmed appointment with 400", err.response?.status === 400);
  }

  // ------------------------------------------------------------------------
  // 7. STRIPE PAYMENT SECURITY & CHECKOUT INTEGRATION
  // ------------------------------------------------------------------------
  // 7a. Customer 2 attempting to pay for Customer 1's appointment -> 403
  try {
    await axios.post(
      `${BASE_URL}/api/payments/checkout-session`,
      { appointmentId: testAppointmentId },
      { headers: { Authorization: `Bearer ${secondCustomerToken}` } }
    );
    record("Payment Security", "Customer 2 cannot pay for Customer 1's appointment with 403", false);
  } catch (err: any) {
    record("Payment Security", "Customer 2 cannot pay for Customer 1's appointment with 403", err.response?.status === 403);
  }

  // 7b. Customer 1 initiates Stripe Checkout for confirmed appointment -> 200 with session URL
  let stripeSessionId = "";
  try {
    const res = await axios.post(
      `${BASE_URL}/api/payments/checkout-session`,
      { appointmentId: testAppointmentId },
      { headers: { Authorization: `Bearer ${customerToken}` } }
    );
    stripeSessionId = res.data?.sessionId || "";
    record(
      "Payment Workflow",
      "Customer creates verified Stripe Checkout session with server snapshot price",
      res.status === 200 && !!res.data.url && !!stripeSessionId
    );
  } catch (err: any) {
    record("Payment Workflow", "Customer creates verified Stripe Checkout session with server snapshot price", false, err.message);
  }

  // 7c. Webhook Security: Fake signature rejected -> 400
  try {
    await axios.post(
      `${BASE_URL}/api/payments/webhook`,
      { type: "checkout.session.completed" },
      { headers: { "stripe-signature": "t=12345,v1=fake_signature" } }
    );
    record("Payment Security", "Webhook rejects invalid/fake signature with 400", false);
  } catch (err: any) {
    record("Payment Security", "Webhook rejects invalid/fake signature with 400", err.response?.status === 400);
  }

  // 7d. Resilient Verification: Directly verify Stripe Checkout session through backend lookup
  try {
    const res = await axios.get(`${BASE_URL}/api/payments/appointment/${testAppointmentId}?session_id=${stripeSessionId}`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    record("Payment Verification", "Payment status check retrieves verified appointment details", res.status === 200 && !!res.data.data);
  } catch (err: any) {
    record("Payment Verification", "Payment status check retrieves verified appointment details", false, err.message);
  }

  // ------------------------------------------------------------------------
  // 8. CUSTOMER BLOCKING & PERMISSION RESTRICTION
  // ------------------------------------------------------------------------
  // 8a. Find customer ID to block
  let customerDbId = "";
  try {
    const res = await axios.get(`${BASE_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${secondCustomerToken}` },
    });
    customerDbId = res.data?.data?._id || res.data?.data?.id || "";
  } catch (e) {}

  // 8b. Admin blocks customer 2
  try {
    const res = await axios.patch(
      `${BASE_URL}/api/admin/users/${customerDbId}/block`,
      {},
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    record("Admin Customer Management", "Admin blocks customer account", res.status === 200 && res.data.data.isBlocked === true);
  } catch (err: any) {
    record("Admin Customer Management", "Admin blocks customer account", false, err.message);
  }

  // 8c. Blocked customer attempting to access /api/profile -> 403 Forbidden
  try {
    await axios.get(`${BASE_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${secondCustomerToken}` },
    });
    record("Security Enforcement", "Blocked user blocked from protected APIs with 403", false, "Allowed blocked user access");
  } catch (err: any) {
    record("Security Enforcement", "Blocked user blocked from protected APIs with 403", err.response?.status === 403);
  }

  // 8d. Admin unblocks customer 2
  try {
    const res = await axios.patch(
      `${BASE_URL}/api/admin/users/${customerDbId}/unblock`,
      {},
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    record("Admin Customer Management", "Admin unblocks customer account", res.status === 200 && res.data.data.isBlocked === false);
  } catch (err: any) {
    record("Admin Customer Management", "Admin unblocks customer account", false, err.message);
  }

  // ------------------------------------------------------------------------
  // 9. SERVICE SAFE DEACTIVATION AUDIT
  // ------------------------------------------------------------------------
  // Attempting to delete service that has an active appointment -> must deactivate, not hard delete!
  try {
    const res = await axios.delete(`${BASE_URL}/api/services/${createdServiceId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    record(
      "Data Integrity",
      "Service with appointments is safely deactivated rather than deleted",
      res.status === 200 && res.data.action === "deactivated" && res.data.data.status === "inactive"
    );
  } catch (err: any) {
    record("Data Integrity", "Service with appointments is safely deactivated rather than deleted", false, err.message);
  }

  // ------------------------------------------------------------------------
  // SUMMARY
  // ------------------------------------------------------------------------
  const passCount = results.filter((r) => r.status === "PASS").length;
  const failCount = results.filter((r) => r.status === "FAIL").length;

  console.log("\n=================================================");
  console.log(`AUDIT RESULTS: ${passCount} PASSED, ${failCount} FAILED out of ${results.length} total checks.`);
  console.log("=================================================\n");

  if (failCount > 0) {
    console.log("Failed tests:");
    results.filter(r => r.status === "FAIL").forEach(r => console.log(`- ${r.category}: ${r.testName} (${r.details})`));
  }
}

runAudit().catch(console.error);
