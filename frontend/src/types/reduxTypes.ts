export interface IFollow {
  _id: string;
}
export interface IUser {
  _id: string;
  name: string;
  email: string;
  dob: string;
  gender: string;
  bio?: string;
  avatar?: string;
  followers: IFollow[];
  followings: IFollow[];
  token: string;
}

export interface IPost {
  _id: string;
  description: string;
  image: string;
  createdBy: string;
  likedBy: IFollow[];
  likes: number;
}

export interface IChat {
  text: string;
  sender: string;
  receiver: string;
  isRead: boolean;
  createdAt: string;
}

export interface IInitialUserState {
  user: IUser | undefined;
  isUserAuthenticated: boolean;
  isProfileOpen: boolean;
  follower: IUser[];
  following: IUser[];
  displayedUser: IUser | undefined;
  allUser: IUser[];
  followerOfDisp: IUser[];
  followingOfDisp: IUser[];
}

export interface IInitialPostState {
  personalPosts: IPost[];
  allPosts: IPost[];
}

export interface IInitialChatState {
  chat: IChat[];
  isFollowerShowing: boolean;
  roomId: string;
  notificationCount: number;
}
