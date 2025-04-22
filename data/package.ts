export const packageMockData = [
    {
      userId: "507f1f77bcf86cd799439011", // Sample ObjectId
      packageName: "Premium Business Package",
      packagePrice: {
        usd: 299,
        etb: 15000,
      },
      packageDuration: 365, // 1 year in days
      packageType: "premium",
      packageDescription: "Our top-tier package with unlimited properties and premium support",
      imageUrl: "https://example.com/images/premium-package.jpg",
      numberOfProperties: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userId: "507f1f77bcf86cd799439012",
      packageName: "Standard Business Package",
      packagePrice: {
        usd: 149,
        etb: 7500,
      },
      packageDuration: 180, // 6 months in days
      packageType: "standard",
      packageDescription: "Great value package for growing businesses",
      imageUrl: "https://example.com/images/standard-package.jpg",
      numberOfProperties: 20,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userId: "507f1f77bcf86cd799439013",
      packageName: "Premium Starter Package",
      packagePrice: {
        usd: 99,
        etb: 5000,
      },
      packageDuration: 90, // 3 months in days
      packageType: "premium",
      packageDescription: "Perfect for new businesses getting started",
      imageUrl: "https://example.com/images/starter-package.jpg",
      numberOfProperties: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userId: "507f1f77bcf86cd799439014",
      packageName: "Standard Basic Package",
      packagePrice: {
        usd: 49,
        etb: 2500,
      },
      packageDuration: 30, // 1 month in days
      packageType: "standard",
      packageDescription: "Basic package for small businesses",
      imageUrl: "https://example.com/images/basic-package.jpg",
      numberOfProperties: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  export default packageMockData;