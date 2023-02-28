import User from '../../database/models/UserModel';

const loginMock = {
  "email": "joao@email.com",
  "password": "senhateste"
} as unknown as User;

const noEmailLoginMock = {
  "password": "senhateste"
}

const noPassLoginMock = {
  "email": "joao@email.com"
}

const failLoginMessageMock = {
  "message": "All fields must be filled"
}

export {
  loginMock,
  noEmailLoginMock,
  noPassLoginMock,
  failLoginMessageMock
}
