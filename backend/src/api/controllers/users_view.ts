import * as usersViewService from "@services/users_view";

import { Controller, Get, Route, Tags, Security, Response } from "tsoa";

@Route("users-view")
@Tags("Users")
export class UsersViewController extends Controller {
  @Get("/")
  @Security("bearerAuth")
  @Response<null>(401, "Unauthorized")
  public async getAllUsers(): Promise<any[]> {
    const response = await usersViewService.getAll();
    return response.data;
  }
}
