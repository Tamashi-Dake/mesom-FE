export interface IUser {
  _id: string;
  displayName?: string;
  username: string;
  following: string[];
  followers: string[];
  verified: boolean;
  status: string;
  createdAt: string;
  updatedAt?: string;
  profile: IUserProfile;
  bookmarks: IUserBookmark[];
}

export interface IUserProfile {
  bio: string;
  avatarImg: string;
  coverImg: string;
  location: string;
  website: string;
}
export interface IUserBookmark {
  post: string;
  bookmarkedAt: string;
}
