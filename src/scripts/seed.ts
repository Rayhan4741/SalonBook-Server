import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "../config/env";
import { Service } from "../models/Service";
import { User } from "../models/User";

const initialServices = [
  {
    serviceName: "Signature Botanical Haircut & Styling",
    category: "Haircut & Styling",
    description: "Personalized hair consultation, deeply relaxing botanical scalp massage, precision scissor styling, and professional blowout finish.",
    price: 65,
    duration: 60,
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80",
    status: "active",
  },
  {
    serviceName: "Sun-Kissed Balayage & Gloss Finish",
    category: "Hair Coloring",
    description: "Hand-painted dimensional balayage highlights customized to your complexion, followed by an acidic gloss toner for luminous radiance.",
    price: 180,
    duration: 150,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
    status: "active",
  },
  {
    serviceName: "Deep Keratin Renewal & Anti-Frizz Therapy",
    category: "Hair Treatment",
    description: "Intensive keratin-infused smoothing treatment that reconstructs damaged hair fiber, eliminates frizz, and seals brilliant shine for months.",
    price: 140,
    duration: 90,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
    status: "active",
  },
  {
    serviceName: "Hydra-Luxe Glow Facial & Microdermabrasion",
    category: "Facial & Skincare",
    description: "Gentle diamond microdermabrasion exfoliation, ultrasonic nutrient infusion, collagen masking, and cooling jade stone drainage.",
    price: 110,
    duration: 75,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
    status: "active",
  },
  {
    serviceName: "Bridal & Red-Carpet Glamour Makeup",
    category: "Makeup",
    description: "Flawless HD makeup artistry with precision contouring, custom individual lash application, and 16-hour transfer-proof airbrush setting.",
    price: 125,
    duration: 75,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
    status: "active",
  },
  {
    serviceName: "Organic Rose Petal Spa Gel Pedicure",
    category: "Manicure & Pedicure",
    description: "Warm milk and fresh rose petal foot soak, sugar exfoliation scrub, hot towel compress, cuticle care, and long-lasting gel polish.",
    price: 75,
    duration: 60,
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1200&q=80",
    status: "active",
  },
  {
    serviceName: "Aromatherapy Deep Tissue Sanctuary Massage",
    category: "Spa & Massage",
    description: "Full-body customized tension release using warm organic lavender and cedarwood essential oils, heated basalt stones, and acupressure.",
    price: 130,
    duration: 90,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    status: "active",
  },
  {
    serviceName: "Japanese Scalp Detox & Head Spa Ritual",
    category: "Hair Treatment",
    description: "Microscopic scalp diagnostic, bubbling organic scalp detox scrub, cascading warm water halo ring therapy, and neck tension relief.",
    price: 95,
    duration: 60,
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1200&q=80",
    status: "active",
  },
];

export const seedDatabase = async () => {
  try {
    console.log("🌱 Connecting to MongoDB for seeding...");
    await mongoose.connect(config.mongodbUri);
    console.log("Connected to MongoDB.");

    // 1. Seed or Verify Admin User
    const existingAdmin = await User.findOne({ email: config.adminEmail.toLowerCase() });
    if (!existingAdmin) {
      console.log(`Creating initial admin user: ${config.adminEmail}`);
      const adminUser = await User.create({
        name: "SalonBook Administrator",
        email: config.adminEmail.toLowerCase(),
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        role: "admin",
        isBlocked: false,
        phone: "+1 (555) 019-2834",
      });

      // Also ensure password in Better Auth 'account' collection if native mongo client used
      const db = mongoose.connection.db;
      if (db) {
        const hashedPassword = await bcrypt.hash(config.adminPassword, 10);
        await db.collection("account").updateOne(
          { userId: adminUser._id.toString() },
          {
            $set: {
              userId: adminUser._id.toString(),
              accountId: adminUser._id.toString(),
              providerId: "credential",
              password: hashedPassword,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        );
      }
      console.log(`✅ Admin user seeded securely with email: ${config.adminEmail}`);
    } else {
      console.log(`ℹ️ Admin user already exists: ${existingAdmin.email}`);
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await existingAdmin.save();
        console.log("Updated existing user to admin role.");
      }
    }

    // 2. Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log("Seeding initial salon services...");
      await Service.insertMany(initialServices);
      console.log(`✅ Successfully seeded ${initialServices.length} salon services.`);
    } else {
      console.log(`ℹ️ Database already contains ${serviceCount} services. Preserving existing records.`);
    }

    console.log("✨ Seeding completed successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}
