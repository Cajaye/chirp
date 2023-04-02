import type { User } from "@clerk/nextjs/dist/api";

const filterUserForClient = (users: User) => {
  return {
    id: users.id,
    username: users.username,
    profileImageUrl: users.profileImageUrl,
  };
};

export default filterUserForClient;
