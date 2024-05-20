import { Prisma, PrismaClient } from "@prisma/client";
import { isDev } from "../app/libs/bool.utils";
import { Log } from "../app/libs/log.utils";

export const prismaInit = (useSoftDeletes = false): PrismaClient => {
  const db = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
      {
        emit: "stdout",
        level: "error",
      },
      {
        emit: "stdout",
        level: "info",
      },
      {
        emit: "stdout",
        level: "warn",
      },
    ],
  });

  db.$on("query", (e) => {
    if (isDev())
      Log.info([e.query, e.params], {
        title: `${e.target} queries [${e.duration}ms]`,
      });
  });

  db.$use(async (params, next) => {
    const date = new Date().toISOString();
    const { model } = params;

    // property keys
    const deletedAt = "deletedAt";
    const deletedBy = "deletedById";
    const createdBy = "createdById";
    const updatedBy = "updatedById";

    // get model properties
    const fields =
      Prisma.dmmf.datamodel.models.find((e) => e.name == model)?.fields ?? [];

    // flag: property exists
    const deleteFields = fields.some((e) => [deletedAt].includes(e.name));
    const deleteByFields = fields.some((e) => [deletedBy].includes(e.name));
    const createFields = fields.some((e) => [createdBy].includes(e.name));
    const updateFields = fields.some((e) => [updatedBy].includes(e.name));

    // when -> create cases
    if (["create", "createMany"].includes(params.action)) {
      if (Array.isArray(params.args["data"]))
        params.args["data"].forEach((_, i) => {
          if (deleteFields && !params.args["data"][i][deletedAt])
            params.args["data"][i][deletedAt] = null;
          if (deleteByFields && !params.args["data"][i][deletedBy])
            params.args["data"][i][deletedBy] = null;
        });
      else
        params.args["data"] = {
          ...params.args["data"],
          ...(deleteFields && !params.args["data"][deletedAt]
            ? { [deletedAt]: null }
            : {}),
          ...(deleteByFields && !params.args["data"][deletedBy]
            ? { [deletedBy]: null }
            : {}),
        };
    }

    // when -> softdeletes imple
    if (useSoftDeletes && deleteFields) {
      if (
        [
          "findFirst",
          "update",
          "updateMany",
          "findMany",
          "findFirstOrThrow",
          "findUnique",
          "findUniqueOrThrow",
        ].includes(params.action)
      ) {
        if (!params.args) params.args = {};

        const cond1 = (params.args["where"] ?? {})[deletedAt] != null;
        const cond2 = ((params.args["where"] ?? {})["OR"] ?? []).some(
          (e: Record<string, any>) =>
            Object.keys(e).includes(deletedAt) ||
            (Object.keys(e).includes("AND") &&
              Object.keys(e["AND"] ?? {}).includes(deletedAt))
        );
        const cond3 = ((params.args["where"] ?? {})["AND"] ?? []).some(
          (e: Record<string, any>) =>
            Object.keys(e).includes(deletedAt) ||
            (Object.keys(e).includes("OR") &&
              Object.keys(e["OR"] ?? {}).includes(deletedAt))
        );
        const cond4 = ((params.args["where"] ?? {})["NOT"] ?? []).some(
          (e: Record<string, any>) =>
            Object.keys(e).includes(deletedAt) ||
            (Object.keys(e).some((z) => ["OR", "AND"].includes(z)) &&
              ["OR", "AND"].some((keyFlag) =>
                Object.keys(e[keyFlag] ?? {}).includes(deletedAt)
              ))
        );

        const whereDt = params.args["where"] ?? {};
        const softDeleteFlags = {
          OR: [{ [deletedAt]: null }, { deletedAt: { isSet: false } }],
        };

        params.args["where"] = {
          ...(cond1 || cond2 || cond3 || cond4
            ? whereDt
            : Object.keys(whereDt).some((key) =>
                ["AND", "OR", "NOT"].includes(key)
              )
            ? Object.keys(whereDt).reduce((prev, key) => {
                let value = whereDt[key];
                let keyChanges = key;
                const currData = Array.isArray(value) ? value : [];

                const andData = whereDt["AND"] ?? [];

                if (key == "AND") {
                  value = [...currData, softDeleteFlags];
                } else if (key == "OR") {
                  keyChanges = "AND";
                  value = [...andData, { OR: currData }, softDeleteFlags];
                } else if (key == "NOT") {
                  keyChanges = "AND";
                  value = [...andData, { NOT: currData }, softDeleteFlags];
                }
                return { ...prev, [keyChanges]: value };
              }, {})
            : { ...(params.args["where"] ?? {}), ...softDeleteFlags }),
        };
      }
    }

    return next(params);
  });

  return db;
};
