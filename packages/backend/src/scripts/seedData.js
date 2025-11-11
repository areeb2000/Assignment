require('dotenv').config();
const UserModel = require('../models/User');
const DepartmentModel = require('../models/Department');
const EmployeeModel = require('../models/Employee');
const JobRoleModel = require('../models/JobRole');
const ApplicationModel = require('../models/Application');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create users
    console.log('👤 Creating users...');
    const superAdmin = await UserModel.create({
      username: 'admin',
      email: 'admin@company.com',
      password: 'admin123',
      role: 'super_admin'
    });

    const hrUser = await UserModel.create({
      username: 'hr_manager',
      email: 'hr@company.com',
      password: 'hr123',
      role: 'hr_user'
    });

    console.log('✅ Users created successfully');

    // Create departments
    console.log('🏢 Creating departments...');
    const departments = [
      {
        name: 'Engineering',
        description: 'Software development and technical operations'
      },
      {
        name: 'Human Resources',
        description: 'Employee management and recruitment'
      },
      {
        name: 'Marketing',
        description: 'Marketing and business development'
      },
      {
        name: 'Quality Assurance',
        description: 'Software testing and quality control'
      },
      {
        name: 'Business Analysis',
        description: 'Business requirements and process analysis'
      }
    ];

    const createdDepartments = [];
    for (const dept of departments) {
      const department = await DepartmentModel.create(dept);
      createdDepartments.push(department);
    }

    console.log('✅ Departments created successfully');

    // Create job roles
    console.log('💼 Creating job roles...');
    const jobRoles = [
      {
        title: 'Frontend Developer',
        department_id: createdDepartments[0].id,
        description: 'Develop user interfaces using modern web technologies',
        requirements: 'React, Angular, Vue.js experience required'
      },
      {
        title: 'Backend Developer',
        department_id: createdDepartments[0].id,
        description: 'Develop server-side applications and APIs',
        requirements: 'Node.js, Python, or Java experience required'
      },
      {
        title: 'Quality Assurance Tester',
        department_id: createdDepartments[3].id,
        description: 'Test software applications for bugs and issues',
        requirements: 'Manual and automated testing experience'
      },
      {
        title: 'Business Analyst',
        department_id: createdDepartments[4].id,
        description: 'Analyze business requirements and processes',
        requirements: 'Business analysis and documentation skills'
      },
      {
        title: 'HR Specialist',
        department_id: createdDepartments[1].id,
        description: 'Manage employee relations and recruitment',
        requirements: 'HR management experience required'
      }
    ];

    const createdJobRoles = [];
    for (const role of jobRoles) {
      const jobRole = await JobRoleModel.create(role);
      createdJobRoles.push(jobRole);
    }

    console.log('✅ Job roles created successfully');

    // Create sample employees
    console.log('👥 Creating sample employees...');
    const employees = [
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1234567890',
        role: 'Senior Frontend Developer',
        department_id: createdDepartments[0].id,
        joining_date: '2023-01-15',
        status: 'active',
        salary: 75000,
        address: '123 Main St, City, State',
        emergency_contact: 'Jane Doe',
        emergency_phone: '+1234567891'
      },
      {
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@company.com',
        phone: '+1234567892',
        role: 'Backend Developer',
        department_id: createdDepartments[0].id,
        joining_date: '2023-02-01',
        status: 'active',
        salary: 70000,
        address: '456 Oak Ave, City, State',
        emergency_contact: 'Mike Johnson',
        emergency_phone: '+1234567893'
      },
      {
        first_name: 'Mike',
        last_name: 'Wilson',
        email: 'mike.wilson@company.com',
        phone: '+1234567894',
        role: 'QA Lead',
        department_id: createdDepartments[3].id,
        joining_date: '2023-03-10',
        status: 'active',
        salary: 65000,
        address: '789 Pine St, City, State',
        emergency_contact: 'Lisa Wilson',
        emergency_phone: '+1234567895'
      },
      {
        first_name: 'Emily',
        last_name: 'Brown',
        email: 'emily.brown@company.com',
        phone: '+1234567896',
        role: 'Senior Business Analyst',
        department_id: createdDepartments[4].id,
        joining_date: '2023-04-05',
        status: 'active',
        salary: 68000,
        address: '321 Elm St, City, State',
        emergency_contact: 'David Brown',
        emergency_phone: '+1234567897'
      },
      {
        first_name: 'Alex',
        last_name: 'Chen',
        email: 'alex.chen@company.com',
        phone: '+1234567898',
        role: 'HR Manager',
        department_id: createdDepartments[1].id,
        joining_date: '2023-05-20',
        status: 'active',
        salary: 72000,
        address: '654 Maple Ave, City, State',
        emergency_contact: 'Lisa Chen',
        emergency_phone: '+1234567899'
      }
    ];

    const createdEmployees = [];
    for (const emp of employees) {
      const employee_id = await EmployeeModel.generateEmployeeId();
      const employee = await EmployeeModel.create({
        ...emp,
        employee_id
      });
      createdEmployees.push(employee);
    }

    console.log('✅ Sample employees created successfully');

    // Create sample applications
    console.log('📋 Creating sample applications...');
    const applications = [
      {
        first_name: 'Alice',
        last_name: 'Smith',
        email: 'alice.smith@email.com',
        phone: '+1555000001',
        job_role_id: createdJobRoles[0].id, // Frontend Developer
        experience_years: 3,
        status: 'new',
        applied_date: '2024-01-15',
        cover_letter: 'I am excited to apply for the Frontend Developer position...'
      },
      {
        first_name: 'Bob',
        last_name: 'Taylor',
        email: 'bob.taylor@email.com',
        phone: '+1555000002',
        job_role_id: createdJobRoles[1].id, // Backend Developer
        experience_years: 5,
        status: 'shortlisted',
        applied_date: '2024-01-20',
        cover_letter: 'With 5 years of backend development experience...'
      },
      {
        first_name: 'Carol',
        last_name: 'Davis',
        email: 'carol.davis@email.com',
        phone: '+1555000003',
        job_role_id: createdJobRoles[2].id, // QA Tester
        experience_years: 2,
        status: 'interview_scheduled',
        applied_date: '2024-01-25',
        interview_date: '2024-02-05 10:00:00',
        cover_letter: 'I have extensive experience in manual and automated testing...'
      },
      {
        first_name: 'David',
        last_name: 'Miller',
        email: 'david.miller@email.com',
        phone: '+1555000004',
        job_role_id: createdJobRoles[3].id, // Business Analyst
        experience_years: 4,
        status: 'new',
        applied_date: '2024-01-30',
        cover_letter: 'My business analysis skills include...'
      },
      {
        first_name: 'Eva',
        last_name: 'Garcia',
        email: 'eva.garcia@email.com',
        phone: '+1555000005',
        job_role_id: createdJobRoles[0].id, // Frontend Developer
        experience_years: 1,
        status: 'rejected',
        applied_date: '2024-02-01',
        cover_letter: 'As a junior developer, I am eager to learn...'
      },
      {
        first_name: 'Frank',
        last_name: 'Rodriguez',
        email: 'frank.rodriguez@email.com',
        phone: '+1555000006',
        job_role_id: createdJobRoles[1].id, // Backend Developer
        experience_years: 7,
        status: 'hired',
        applied_date: '2024-01-10',
        cover_letter: 'Senior backend developer with expertise in...'
      }
    ];

    for (const app of applications) {
      const application_id = await ApplicationModel.generateApplicationId();
      await ApplicationModel.create({
        ...app,
        application_id
      });
    }

    console.log('✅ Sample applications created successfully');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - ${departments.length} departments created`);
    console.log(`   - ${jobRoles.length} job roles created`);
    console.log(`   - ${employees.length} employees created`);
    console.log(`   - ${applications.length} applications created`);
    console.log(`   - 2 users created (admin & hr_manager)`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Super Admin: admin@company.com / admin123');
    console.log('   HR User: hr@company.com / hr123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed data if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;