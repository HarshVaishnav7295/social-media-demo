export const host = `http://localhost:8000`;
// APIs for User
export const RegisterAPI = `${host}/api/auth/signup`;
export const LoginAPI = `${host}/api/auth/login`;
export const UpdateUserApi = `${host}/api/user/updateUser`;
export const GetFollowingApi = `${host}/api/user/myFollowings`;
export const GetFollowerApi = `${host}/api/user/myFollowers`;
export const UpdateUserPasswordApi = `${host}/api/user/changePassword`;
export const setAllUserApi = `${host}/api/user/getAllUser`;

// APIs for Posts
export const UploadPost = `${host}/api/post`;
export const GetMyPost = `${host}/api/post/getMyPosts`;
export const LikeUnLikeApi = `${host}/api/post/likeUnlike/`;
export const GetUserPostApi = `${host}/api/post/getUserPost`;
export const GetFeedApi = `${host}/api/post/getFeed`;

// APIs for Chats

export const UploadMessage = `${host}/api/chat/sendMessage`;

export const GetAllChatApi = `${host}/api/chat/getChatWith`;

export const FollowUnFollowApi = `${host}/api/user/followUnfollow`;

export const FindUserByIdApi = `${host}/api/user/findById`;
