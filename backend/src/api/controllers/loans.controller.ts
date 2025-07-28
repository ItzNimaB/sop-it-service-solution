import * as loansService from "@services/loans";

export function CreateOne(): IController {
  return async (req, res) => {
    const response = await loansService.createOne(req.body as ILoanCreateInput);

    res.status(response.status).json(response.data);
  };
}

export function ReturnLoan(): IController {
  return async (req, res) => {
    const response = await loansService.returnLoan(
      req.body.ItemsInLoanToReturn
    );

    res.status(response.status).json(response.data);
  };
}

export function GetPdf(): IController {
  return async (req, res) => {
    const response = await loansService.getPdf(req.params.id);

    res.send(response.data);
  };
}
