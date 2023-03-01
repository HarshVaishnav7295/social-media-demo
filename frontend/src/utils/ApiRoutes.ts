// Host
export const host: string = `http://localhost:8000`;
// APIs for User
export const RegisterAPI = `${host}/api/auth/signup`;
export const LoginAPI = `${host}/api/auth/login`;
export const UpdateUserApi = `${host}/api/user/updateUser`;
export const GetFollowingApi = `${host}/api/user/myFollowings`;
export const GetFollowerApi = `${host}/api/user/myFollowers`;
export const UpdateUserPasswordApi = `${host}/api/user/changePassword`;
export const setAllUserApi = `${host}/api/user/getAllUser`;
export const FollowUnFollowApi = `${host}/api/user/followUnfollow`;
export const FindUserByIdApi = `${host}/api/user/findById`;

// APIs for Posts
export const UploadPost = `${host}/api/post`;
export const GetMyPost = `${host}/api/post/getMyPosts`;
export const LikeUnLikeApi = `${host}/api/post/likeUnlike/`;
export const GetUserPostApi = `${host}/api/post/getUserPost`;
export const GetFeedApi = `${host}/api/post/getFeed`;

// APIs for Chats
export const AccessChatApi = `${host}/api/chat/accessChat`;
export const MarkAsReadApi = `${host}/api/chat/markRead`;
