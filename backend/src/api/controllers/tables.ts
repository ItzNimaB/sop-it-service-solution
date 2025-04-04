import { Prisma } from "@prisma/client";
import * as tablesService from "@services/tables";

export function GetAll(): IController {
  return async (req, res) => {
    const table = req.params.table as Prisma.ModelName;
    let filter = req.query as any;

    if (filter.UUID) filter.UUID = Number(filter.UUID);

    const response = await tablesService.getAll(table, filter);

    res.status(response.status).json(response.data);
  };
}

interface GetOneParams {
  table: Prisma.ModelName;
  UUID: string;
}

export function GetOne(): IController {
  return async (req, res) => {
    const { table, UUID } = req.params as unknown as GetOneParams;

    const include = {} as any;

    let includeStringList = req.query.include?.toString().split(",");

    includeStringList?.map((table) => (include[table] = true));

    let filter = req.query;
    delete filter.include;

    const response = await tablesService.getOne(table, UUID, filter, include);

    res.status(response.status).json(response.data);
  };
}

export function CreateOne(): IController {
  return async (req, res) => {
    const table = req.params.table as Prisma.ModelName;
    const values = req.body.data;

    const response = await tablesService.createOne(table, values);

    res.status(response.status).json(response.data);
  };
}

export function UpdateOne(): IController {
  return async (req, res) => {
    const { table, UUID } = req.params as unknown as GetOneParams;
    const values = req.body.data;

    const response = await tablesService.updateOne(table, UUID, values);

    res.status(response.status).json(response.data);
  };
}

export function DeleteOne(): IController {
  return async (req, res) => {
    const { table, UUID } = req.params as unknown as GetOneParams;

    const response = await tablesService.deleteOne(table, UUID);

    res.status(response.status).json(response.data);
  };
}
