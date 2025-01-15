"use client";

import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { fetcherWithTotal } from "@/libs/axios";
import {  UsersResponseModel } from "@/features/auth/types";
import { UserContentComponent } from "@/features/users/components/users/index.content";

export const Users = () => {
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [searchKeyword, setSearchkeyword] = useState<string>("");

  const { data: u, error } = useSWR<UsersResponseModel>(
    `/users?page=${page}&pagination[per_page]=${perPage}&filters[search]=${searchKeyword}`,
    fetcherWithTotal
  );
  
  const { trigger } = useSWRMutation(`/users?page=${page}&pagination[per_page]=${perPage}&filters[search]=${searchKeyword}`,
    fetcherWithTotal);
  if (error) return <div>Error fetching data</div>;
  if (!u) return <div>Loading...</div>;

  return (
    <>
      <UserContentComponent
        data={u.users}
        page={page}
        perPage={perPage}
        trigger={trigger}
        count={Math.ceil(u.pagination.total / perPage)}
        onChangeSearchKeyword={(q: string) => setSearchkeyword(q)}
        onChangePagination={(page: number) => setPage(page)}
        onChangePerPage={(perPage: number) => setPerPage(perPage)}
      />
    </>
  );
};
