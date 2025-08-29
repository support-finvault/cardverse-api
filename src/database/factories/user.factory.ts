// import { EmployeeEntity } from '../../employees';
// import { define } from 'typeorm-seeding';
// import * as Faker from 'faker';
// import * as bcrypt from 'bcryptjs';

// define(EmployeeEntity, (faker: typeof Faker) => {
//   const first_name = faker.name.firstName();
//   const last_name = faker.name.lastName();

//   const user = new EmployeeEntity();
//   user.username = `${first_name}-${last_name}-${faker.random.number()}`;
//   user.first_name = first_name;
//   user.last_name = last_name;
//   user.email = faker.internet.email();
//   user.salt = bcrypt.genSaltSync();
//   user.password = bcrypt.hashSync('vault@123', user.salt);
//   user.phone_number = faker.phone.phoneNumberFormat();
//   return user;
// });
