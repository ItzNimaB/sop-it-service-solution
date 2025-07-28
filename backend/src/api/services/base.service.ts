import prisma from "@/config/prisma";

import { Prisma } from ".prisma/client";

export interface PrismaFindManyArgs {
  where?: any;
  orderBy?: any;
  skip?: number;
  take?: number;
  cursor?: any;
  distinct?: any;
}

interface IBaseService<T> {
  getAll: IService<T[]>;
  getById: IService<T>;
  create: IService<T>;
  update: IService<T>;
  delete: IService<T>;
  softDelete: IService<T>;
  restore: IService<T>;
}

export default class BaseService<T> implements IBaseService<T> {
  prismaModel?: any;

  constructor(table: FirstLetterLowercase<Prisma.ModelName>) {
    const model = prisma[table];

    if (!model) {
      throw new Error(`Model ${table} not found in Prisma client`);
    }

    this.prismaModel = model;
  }

  getAll = async (findManyArgs: PrismaFindManyArgs = {}) => {
    const response = (await this.prismaModel.findMany(findManyArgs)) as T[];

    return { status: 200, data: response };
  };

  getById = async (id: number) => {
    const response = (await this.prismaModel.findUnique({
      where: { id },
    })) as T;

    if (!response) return { status: 404 };

    return { status: 200, data: response };
  };

  create = async (data: any) => {
    const response = (await this.prismaModel.create({ data })) as T;

    return { status: 201, data: response };
  };

  update = async (id: number, data: any): Promise<IResponse> => {
    const response = (await this.prismaModel.update({
      where: { id },
      data,
    })) as T;

    return { status: 200, data: response };
  };

  delete = async (id: number): Promise<IResponse> => {
    const response = (await this.prismaModel.delete({ where: { id } })) as T;

    return { status: 200, data: response };
  };

  softDelete = async (id: number): Promise<IResponse> => {
    const response = (await this.prismaModel.update({
      where: { id },
      data: { deletedAt: new Date() },
    })) as T;

    return { status: 200, data: response };
  };

  restore = async (id: number): Promise<IResponse> => {
    const response = (await this.prismaModel.update({
      where: { id },
      data: { deletedAt: null },
    })) as T;

    return { status: 200, data: response };
  };
}
