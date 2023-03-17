import User from '../../database/models/UserModel';

const loginMock = {
  "email": "admin@admin.com",
  "password": "secret_admin"
} as unknown as User;

const noEmailLoginMock = {
  "password": "senhateste"
};

const noPassLoginMock = {
  "email": "joao@email.com"
};

const failLoginMessageMock = {
  "message": "All fields must be filled"
};

const payloadMock = {

};

const failAuthMessageMock = {
  "message": "Token not found"
};

export {
  loginMock,
  noEmailLoginMock,
  noPassLoginMock,
  failLoginMessageMock,
  failAuthMessageMock
}
