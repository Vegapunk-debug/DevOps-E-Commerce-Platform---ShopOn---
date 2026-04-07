const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting to seed database...");

  await prisma.product.deleteMany();


  const shoes = [
    { name: 'Air Max Glide', price: 120, image: 'shoe-1.jpg' },
    { name: 'Retro High', price: 180, image: 'shoe-2.webp' },
    { name: 'Cloud Runner', price: 140, image: 'shoe-3.webp' },
    { name: 'Classic Canvas', price: 65, image: 'shoe-4.webp' },
    { name: 'Air Max Glide', price: 120, image: 'shoe-5.avif' },
    { name: 'Retro High', price: 180, image: 'shoe-6.avif' },
    { name: 'Cloud Runner', price: 140, image: 'shoe-7.avif' },
    { name: 'Classic Canvas', price: 65, image: 'shoe-8.avif' },
    { name: 'Air Max Glide', price: 120, image: 'shoe-9.avif' },
    { name: 'Retro High', price: 180, image: 'shoe-10.avif' },
    { name: 'Cloud Runner', price: 140, image: 'shoe-11.avif' },
    { name: 'Classic Canvas', price: 65, image: 'shoe-12.avif' },
    { name: 'Air Max Glide', price: 120, image: 'shoe-13.avif' },
    { name: 'Retro High', price: 180, image: 'shoe-14.avif' },
    { name: 'Cloud Runner', price: 140, image: 'shoe-15.avif' }
  ];

  for (const shoe of shoes) {
    const product = await prisma.product.create({
      data: shoe,
    });
    console.log(`Added shoe: ${product.name}`);
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });