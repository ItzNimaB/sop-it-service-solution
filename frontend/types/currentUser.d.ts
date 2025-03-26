interface currentUser {
  date_created: string;
  distiguishedName: string;
  exp: number;
  firstName: string;
  fullName: string;
  iat: number;
  lastName: string;
  mail: string;
  moderatorLevel: boolean;
  username: string;
  UUID: number;
}

type userState = currentUser | null | undefined;

interface CurrentUserContextType {
  currentUser: userState;
  setCurrentUser: React.Dispatch<React.SetStateAction<userState>>;
}
