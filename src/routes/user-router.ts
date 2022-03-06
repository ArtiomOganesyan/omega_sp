import StatusCodes from "http-status-codes";
import { Request, Response, Router } from "express";

import userService from "../services/user-service";
import { ParamMissingError, UsersNotFoundError } from "../shared/errors";
import { IUser } from "../models/user-model";

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
  get: "/all",
  add: "/add",
  update: "/update",
  delete: "/delete/:id",
} as const;

/**
 * Get all users.
 */
// #rule Express handler return void, if we are using the no-misused-promises
// we can not return Promise<void>. That is why instead of async/await
// then/catch is used
router.get(p.get, (_: Request, res: Response) => {
  userService
    .getAll()
    .then((users) => res.status(OK).json({ users }))
    .catch((err) => {
      throw new UsersNotFoundError();
    });
});

/**
 * Add one user.
 */
router.post(p.add, (req: Request, res: Response) => {
  const { user }: { user: Partial<IUser> } = req.body;
  if (!user) {
    throw new ParamMissingError();
  }
  user.name = createUserName();
  // Fetch data
  userService.addOne(user).then(() => res.status(CREATED).end());
});

/**
 * Update one user.
 */
router.put(p.update, async (req: Request, res: Response) => {
  const { user } = req.body;
  // Check param
  if (!user) {
    throw new ParamMissingError();
  }
  // Fetch data
  await userService.updateOne(user);
  return res.status(OK).end();
});

/**
 * Delete one user.
 */
router.delete(p.delete, async (req: Request, res: Response) => {
  const { id } = req.params;
  // Check param
  if (!id) {
    throw new ParamMissingError();
  }
  // Fetch data
  await userService.delete(Number(id));
  return res.status(OK).end();
});

// Export default
export default router;
