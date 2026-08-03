import { performance } from "perf_hooks";

import prisma from "@/configs/prisma.config";
import { addFullname } from "@/functions";

const logPerformance = process.env.LOG_PERFORMANCE === "true";

type PerfStep = {
  label: string;
  ms?: number;
  atMs?: number;
  meta?: Record<string, unknown>;
};

function formatMeta(meta?: Record<string, unknown>) {
  if (!meta) return "";

  return Object.entries(meta)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join(", ");
}

function pad(value: unknown, width: number) {
  const text = String(value ?? "");

  return text.length >= width
    ? text.slice(0, width - 1) + "."
    : text.padEnd(width);
}

function createPerfTracker(route: string, requestId?: string) {
  const startedAt = performance.now();
  const steps: PerfStep[] = [];

  return {
    mark(label: string, meta?: Record<string, unknown>) {
      steps.push({
        label,
        atMs: Number((performance.now() - startedAt).toFixed(2)),
        meta,
      });
    },

    async time<T>(label: string, fn: () => T | Promise<T>): Promise<T> {
      const stepStartedAt = performance.now();

      try {
        return await fn();
      } finally {
        steps.push({
          label,
          ms: Number((performance.now() - stepStartedAt).toFixed(2)),
        });
      }
    },

    log(status: number, meta?: Record<string, unknown>) {
      if (!logPerformance) return;

      console.info(
        JSON.stringify({
          type: "performance",
          route,
          requestId,
          status,
          totalMs: Number((performance.now() - startedAt).toFixed(2)),
          steps,
          meta,
        })
      );
    },

    prettyLog(status: number, meta?: Record<string, unknown>) {
      if (!logPerformance) return;

      const totalMs = Number((performance.now() - startedAt).toFixed(2));
      const summary = formatMeta(meta);

      console.info("");
      console.info(`Performance: ${route}`);
      console.info(
        `Request: ${requestId || "N/A"} | Status: ${status} | Total: ${totalMs} ms${
          summary ? ` | ${summary} | ${new Date().toISOString()}` : ""
        }`
      );
      console.info(
        "Step | Label                          | Duration   | At         | Meta"
      );
      console.info(
        "-----|--------------------------------|------------|------------|----------------"
      );

      for (const [index, step] of steps.entries()) {
        console.info(
          `${pad(index + 1, 4)} | ${pad(step.label, 30)} | ${pad(
            step.ms !== undefined ? `${step.ms} ms` : "",
            10
          )} | ${pad(step.atMs !== undefined ? `${step.atMs} ms` : "", 10)} | ${formatMeta(
            step.meta
          )}`
        );
      }
    },
  };
}

export async function getAll(
  moderatorLevel?: number,
  username?: string,
  user_id?: number,
  requestId?: string
): Promise<IResponse> {
  const perf = createPerfTracker("loans_view.getAll", requestId);

  let user = await perf.time("prisma.users.findFirst", () =>
    prisma.users.findFirst({ where: { username } })
  );

  perf.mark("userLookup.result", {
    found: Boolean(user),
    moderatorLevel,
    requestedUserId: user_id,
  });

  if (!user && !moderatorLevel) {
    perf.log(401);

    return { status: 401, data: "User not found" };
  }

  user_id = moderatorLevel ? user_id : user?.UUID;

  perf.mark("resolvedUserId", { user_id });

  let loans = await perf.time("prisma.loans.findMany.ids", () =>
    prisma.loans.findMany({ where: { user_id }, select: { UUID: true } })
  );

  const loanIds = loans.map((loan) => loan.UUID);

  perf.mark("loanIds.loaded", { loanCount: loanIds.length });

  const loansView = await perf.time("prisma.loans_view.findMany", () =>
    prisma.loans_view.findMany({ where: { UUID: { in: loanIds } } })
  );

  perf.mark("loansView.loaded", { rowCount: loansView.length });

  await perf.time("addFullname.total", () =>
    addFullname(loansView, "Laaner", perf)
  );

  let headers = await perf.time("headers.fromPrismaFields", () =>
    Object.keys(prisma.loans_view.fields)
  );

  perf.prettyLog(200, {
    headerCount: headers.length,
    rowCount: loansView.length,
  });

  return { status: 200, data: { headers, data: loansView } };
}
