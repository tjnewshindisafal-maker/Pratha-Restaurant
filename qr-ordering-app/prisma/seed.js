const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const MENU_SEED = [
  { name: 'Paneer Tikka', description: 'Char-grilled cottage cheese with smoky spices.', price: 260, category: 'Starters', isVeg: true },
  { name: 'Chicken Seekh Kebab', description: 'Minced chicken skewers grilled in the tandoor.', price: 300, category: 'Starters', isVeg: false },
  { name: 'Veg Samosa (2 pc)', description: 'Crispy pastry filled with spiced potatoes and peas.', price: 90, category: 'Starters', isVeg: true },
  { name: 'Butter Chicken', description: 'Tandoori chicken in creamy tomato-butter gravy.', price: 320, category: 'Main Course', isVeg: false },
  { name: 'Dal Makhani', description: 'Slow-cooked black lentils with cream and butter.', price: 220, category: 'Main Course', isVeg: true },
  { name: 'Kadhai Paneer', description: 'Cottage cheese tossed with bell peppers in spiced masala.', price: 280, category: 'Main Course', isVeg: true },
  { name: 'Mutton Rogan Josh', description: 'Slow-braised mutton in a rich Kashmiri red gravy.', price: 380, category: 'Main Course', isVeg: false },
  { name: 'Aloo Paratha', description: 'Whole-wheat flatbread stuffed with spiced potatoes.', price: 120, category: 'Breads', isVeg: true },
  { name: 'Butter Naan', description: 'Soft leavened bread brushed with butter.', price: 70, category: 'Breads', isVeg: true },
  { name: 'Hyderabadi Biryani', description: 'Fragrant basmati rice layered with spiced meat.', price: 290, category: 'Rice', isVeg: false },
  { name: 'Jeera Rice', description: 'Basmati rice tempered with cumin seeds.', price: 150, category: 'Rice', isVeg: true },
  { name: 'Gulab Jamun (2 pc)', description: 'Soft milk dumplings soaked in cardamom syrup.', price: 100, category: 'Desserts', isVeg: true },
  { name: 'Gajar Ka Halwa', description: 'Warm carrot pudding slow-cooked with milk and ghee.', price: 140, category: 'Desserts', isVeg: true },
  { name: 'Masala Chai', description: 'Spiced Indian tea brewed with milk.', price: 50, category: 'Beverages', isVeg: true },
  { name: 'Mango Lassi', description: 'Chilled yogurt smoothie blended with mango pulp.', price: 110, category: 'Beverages', isVeg: true },
];

async function main() {
  const restaurant = await prisma.restaurant.upsert({
    where: { id: 'pratha-main' },
    update: {},
    create: {
      id: 'pratha-main',
      name: process.env.RESTAURANT_NAME || 'Pratha Restaurant',
      address: '123 Spice Street, Food District, New Delhi',
      lat: parseFloat(process.env.RESTAURANT_LAT || '28.6139'),
      lng: parseFloat(process.env.RESTAURANT_LNG || '77.2090'),
      deliveryRadiusKm: parseFloat(process.env.RESTAURANT_DELIVERY_RADIUS_KM || '6'),
      isOpen: true,
      whatsappNumber: process.env.RESTAURANT_WHATSAPP_NUMBER || '+919876543210',
    },
  });

  for (const item of MENU_SEED) {
    const existing = await prisma.menuItem.findFirst({
      where: { restaurantId: restaurant.id, name: item.name },
    });
    if (!existing) {
      await prisma.menuItem.create({
        data: { ...item, restaurantId: restaurant.id },
      });
    }
  }

  const ownerEmail = 'owner@pratharestaurant.com';
  const existingOwner = await prisma.staffUser.findUnique({ where: { email: ownerEmail } });
  if (!existingOwner) {
    const passwordHash = await bcrypt.hash('pratha123', 10);
    await prisma.staffUser.create({
      data: {
        restaurantId: restaurant.id,
        name: 'Restaurant Owner',
        email: ownerEmail,
        passwordHash,
        role: 'owner',
      },
    });
    console.log(`Seeded staff login -> email: ${ownerEmail} / password: pratha123 (change this after first login)`);
  }

  console.log('Seed complete. Restaurant ID:', restaurant.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
