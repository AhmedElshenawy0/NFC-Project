import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authSlice = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["clients"],

  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),
    signIn: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // ✅ تحديث كاش getClientInfo مباشرة بعد تسجيل الدخول
          dispatch(
            authSlice.util.updateQueryData(
              "getClientInfo",
              undefined,
              () => data
            )
          );
        } catch (err) {
          console.error("signIn error:", err);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    getUserInfo: builder.query({
      query: () => ({
        url: "/user-info",
      }),
      transformResponse: (response: any) => response,
    }),
    getSingleUser: builder.query({
      query: () => ({
        url: `/get-user`,
      }),
      transformResponse: (response: any) => response,
    }),
    checkUserSoldService: builder.mutation({
      query: (email) => ({
        url: "/check-user",
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: { email },
      }),
      transformResponse: (response: any) => response,
    }),
    getAllClients: builder.query({
      query: () => "/get-all-user",
      providesTags: ["clients"],
    }),
    getClientInfo: builder.query({
      query: () => ({ url: "/user-info", credentials: "include" }),
    }),
    updateClient: builder.mutation({
      query: ({ data, email }) => ({
        url: `/update-client/${email}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["clients"],
    }),
    deleteClient: builder.mutation({
      query: (email) => ({
        url: `/delete-client/${email}`,
        method: "DELETE",
      }),
      invalidatesTags: ["clients"],
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useGetUserInfoQuery,
  useCheckUserSoldServiceMutation,
  useGetSingleUserQuery,
  useLogoutMutation,
  useGetAllClientsQuery,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetClientInfoQuery,
} = authSlice;
