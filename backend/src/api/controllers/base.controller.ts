import BaseService from "@services/base.service";

import { Prisma } from ".prisma/client";

String.prototype.toFirstLetterLowercase = function () {
  return (this.charAt(0).toLowerCase() +
    this.slice(1)) as FirstLetterLowercase<string>;
};

interface IBaseController {
  getAll: IController;
  getById: IController;
  create: IController;
  update: IController;
  delete: IController;
  softDelete: IController;
  restore: IController;
}

export default class BaseController<T> implements IBaseController {
  service: BaseService<T>;
  table?: Prisma.ModelName;
  schema?: Zod.ZodSchema;

  constructor(table: Prisma.ModelName);
  constructor(service: BaseService<T>);

  constructor(
    tableOrService: Prisma.ModelName | BaseService<T>,
    schema?: Zod.ZodSchema
  ) {
    this.schema = schema;

    if (typeof tableOrService === "string") {
      this.table = tableOrService;

      this.service = new BaseService(tableOrService.toFirstLetterLowercase());
    } else {
      this.service = tableOrService;
    }
  }

  private parseOrDont(data: any): { data: any; error: Zod.ZodError | null } {
    if (!this.schema) return { data, error: null };

    const parsed = this.schema.safeParse(data);
    if (parsed.success) return { data: parsed.data, error: null };

    return { data: null, error: parsed.error };
  }

  getAll: IController = async (req, res) => {
    const { query } = req;

    const { data, error } = this.parseOrDont(query);

    if (error) {
      res.status(400).json({ error: error.errors });
      return;
    }

    const response = await this.service.getAll(data);

    res.status(response.status).json(response.data);
  };

  getById: IController = async (req, res) => {
    const { id } = req.params;

    const response = await this.service.getById(Number(id));

    res.status(response.status).json(response.data);
  };

  create: IController = async (req, res) => {
    const { body } = req;

    const { data, error } = this.parseOrDont(body);

    if (error) {
      res.status(400).json({ error: error.errors });
      return;
    }

    const response = await this.service.create(data);

    res.status(response.status).json(response.data);
  };

  update: IController = async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    const { data, error } = this.parseOrDont(body);

    if (error) {
      res.status(400).json({ error: error.errors });
      return;
    }

    const response = await this.service.update(Number(id), data);

    res.status(response.status).json(response.data);
  };

  delete: IController = async (req, res) => {
    const { id } = req.params;

    const response = await this.service.delete(Number(id));

    res.status(response.status).json(response.data);
  };

  softDelete: IController = async (req, res) => {
    const { id } = req.params;

    const response = await this.service.softDelete(Number(id));

    res.status(response.status).json(response.data);
  };

  restore: IController = async (req, res) => {
    const { id } = req.params;

    const response = await this.service.restore(Number(id));

    res.status(response.status).json(response.data);
  };
}
