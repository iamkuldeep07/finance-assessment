import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


import User from './src/models/User.js';
import FinancialRecord from './src/models/FinancialRecord.js';

const seedDatabase = async () => {
  try {
    console.log('⏳ Connecting to Database...');
    const uri = process.env.MONGODB_URI;
    
    if (!uri) throw new Error("MONGODB_URI is missing from .env");
    
    await mongoose.connect(uri);
    console.log(`Connected to MongoDB Database: ${mongoose.connection.name}`);

    console.log('Clearing old data...');
    await FinancialRecord.deleteMany({});
    await User.deleteMany({});
    console.log('👥 Creating Test Users (Admin, Analyst, Viewer)...');
    
    const users = await User.create([
      {
        name: 'System Admin',
        email: 'admin@finance.com',
        password: 'Password123', 
        role: 'admin',
        isVerified: true,
        isActive: true
      },
      {
        name: 'Data Analyst',
        email: 'analyst@finance.com',
        password: 'Password123',
        role: 'analyst',
        isVerified: true,
        isActive: true
      },
      {
        name: 'Basic Viewer',
        email: 'viewer@finance.com',
        password: 'Password123',
        role: 'viewer',
        isVerified: true,
        isActive: true
      }
    ]);

    const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Dividends'];
    const expenseCategories = ['Rent', 'Groceries', 'Utilities', 'Entertainment', 'Transport', 'Healthcare'];

    const getRandomDate = () => {
      const today = new Date();
      const pastDate = new Date(today.setMonth(today.getMonth() - Math.floor(Math.random() * 6)));
      pastDate.setDate(Math.floor(Math.random() * 28) + 1); 
      return pastDate;
    };

    console.log('📈 Generating 100 financial records...');
    const records = [];

    for (let i = 0; i < 100; i++) {
      const isIncome = Math.random() > 0.6; 
      
      const randomUser = users[Math.floor(Math.random() * users.length)];

      records.push({
        amount: isIncome 
          ? Math.floor(Math.random() * 5000) + 1000 
          : Math.floor(Math.random() * 500) + 20,   
        type: isIncome ? 'income' : 'expense',
        category: isIncome 
          ? incomeCategories[Math.floor(Math.random() * incomeCategories.length)]
          : expenseCategories[Math.floor(Math.random() * expenseCategories.length)],
        date: getRandomDate(),
        createdBy: randomUser._id,
        isDeleted: false
      });
    }

    await FinancialRecord.insertMany(records);
    console.log('Successfully seeded 100 records into the database!');

    console.log('\n=========================================');
    console.log('SEEDING COMPLETE!');
    console.log('Here are your test accounts (Password for all is: Password123)\n');
    console.log('ADMIN:    admin@finance.com   (Full Access)');
    console.log('ANALYST:  analyst@finance.com (Can view Dashboards)');
    console.log('VIEWER:   viewer@finance.com  (Read-only restricted)');
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();