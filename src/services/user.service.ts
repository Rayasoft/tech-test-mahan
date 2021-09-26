// hardcoded valid users
import { VALID_USERS } from "../mock/userLogins";
import { User } from "../models/user.model";

export const userService = {
  getByCredentials,
};

async function getByCredentials(
  username: string,
  password: string
): Promise<User | null> {
  const user = VALID_USERS.users.find(
    (u) => u.userLogin === username && u.password === password
  );
  return !!user ? new User(user.userLogin, password) : null;
}
