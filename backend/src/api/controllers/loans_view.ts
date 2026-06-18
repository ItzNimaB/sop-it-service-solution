import { performance } from "perf_hooks";

import * as loansViewService from "@services/loans_view";

function createRequestId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function GetAll(): IController {
  return async (req, res) => {
    const startedAt = performance.now();
    const requestId = createRequestId();
    const { moderatorLevel, username } = req.user || {};
    let user_id = req.query.user_id;

    const response = await loansViewService.getAll(
      moderatorLevel,
      username,
      user_id ? Number(user_id) : undefined,
      requestId
    );

    const serviceDoneMs = Number((performance.now() - startedAt).toFixed(2));

    res.status(response.status).json(response.data);

    console.info(
      `Controller: GET /api/loans_view | Request: ${requestId} | Status: ${
        response.status
      } | Service: ${serviceDoneMs} ms | Total: ${Number(
        (performance.now() - startedAt).toFixed(2)
      )} ms`
    );
  };
}
