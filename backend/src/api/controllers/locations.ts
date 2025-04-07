import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
} from "tsoa";

import * as locationsService from "@services/locations";

@Route("locations")
export class LocationsController extends Controller {
  @SuccessResponse("200", "Success")
  @Get("{UUID}")
  public async getLocation(
    @Path() UUID?: number,
    @Query() name?: string
  ): Promise<any> {
    console.log("UUID", UUID);
    console.log("name", name);
    return new locationsService.LocationsService().get();
  }
}

export function GetAll(): IController {
  return async (req, res) => {
    const response = await locationsService.getAll();

    res.status(response.status).json(response.data);
  };
}
