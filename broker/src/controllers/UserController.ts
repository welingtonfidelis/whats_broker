import { UserService } from '../services';

const userService = new UserService();

class UserController {
  login(email: string, password: string) {
    return userService.login(email, password);
  }
}

export { UserController };
