import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateTransferError {
  export class UserNotFound extends AppError {
    constructor() {
      super("User not found", 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super("Insufficient funds", 400);
    }
  }

  export class SameAccount extends AppError {
    constructor() {
      super("It is not possible to transfer to the same original account", 400);
    }
  }
}
