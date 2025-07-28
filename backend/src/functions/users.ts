import { getUsers } from ".";

export async function addFullname(
  loans: { Navn: string; [usernameKey: string]: string | any }[],
  usernameKey: string
) {
  const users = await getUsers();

  for (let loan of loans) {
    let user = users.find(({ username }) => username == loan[usernameKey]);

    loan.Navn = user?.fullName || "";
  }
}
