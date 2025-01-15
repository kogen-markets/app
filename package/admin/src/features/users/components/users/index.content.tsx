"use client";
import { UserModel } from "@/features/auth/types";
import {
  Badge,
  Box,
  Button,
  IconButton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";

import { COLORS } from "@/utils/colors";

import { useSnackbar } from "@/contexts/snackbarContext";

import {
  removeUser,
  updateUserActivateStatus,
} from "@/features/users/api/users";

type UserListComponentProps = {
  data: Array<UserModel>;
  count: number;
  page: number;
  perPage: number;
  trigger: any;
  onChangeSearchKeyword: (_q: string) => void;
  onChangePagination: (_page: number) => void;
  onChangePerPage: (_perPage: number) => void;
};

export const UserContentComponent = ({
  data,
  count,
  page,
  trigger,
  onChangePagination,
}: UserListComponentProps) => {
  const showSnackbar = useSnackbar();

  const _delete = (item: UserModel) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await removeUser(item._id);
          trigger();
          Swal.fire("Deleted!", "This User has been deleted.", "success");
        } catch (e) {
          Swal.fire("Oops...", "Something went wrong", "error");
        } finally {
        }
      }
    });
  };

  const _updateActivateStatus = async (item: UserModel, activated: boolean) => {
    try {
      await updateUserActivateStatus(item._id, !activated);
      showSnackbar({
        newMessage: "User status is updated successfully.",
        newSeverity: "success",
      });
      trigger();
    } catch (e: any) {
      console.log("user activate status update error");
      showSnackbar({
        newMessage: "User status is not updated.",
        newSeverity: "error",
      });
    }
  };
  return (
    <>
      <div className="overflow-x-auto p-5">
        <h2 className="my-2">Users</h2>
        {/* <div className="my-5">
          <input
            className="border border-slate-200 py-3 px-2 w-full"
            placeholder="search"
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.code == "Enter") {
                onChangeSearchKeyword(e.currentTarget.value);
              }
            }}
          ></input>
        </div> */}
        <TableContainer sx={{ maxHeight: 650 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Activate</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, i) => (
                <TableRow hover={true} key={item._id}>
                  <TableCell> {(page - 1) * 10 + (i + 1)}</TableCell>
                  <TableCell>{item.fullName}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <Box ml={4}>
                      <Button
                        sx={{ textTransform: "capitalize" }}
                        onClick={() => {
                          _updateActivateStatus(item, item.is_actived);
                        }}
                      >
                        {item.is_actived ? (
                          <Badge
                            color="primary"
                            badgeContent={"activate"}
                          ></Badge>
                        ) : (
                          <Badge
                            color="secondary"
                            badgeContent={"inactivate"}
                          ></Badge>
                        )}
                      </Button>
                    </Box>
                  </TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="delete"
                      sx={{ color: COLORS.red }}
                      size="small"
                      onClick={() => {
                        _delete(item);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
          <Pagination
            color={"primary"}
            count={count}
            page={page}
            variant="outlined"
            shape="rounded"
            sx={{ my: 2 }}
            onChange={(_, page) => onChangePagination(page)}
          />
        </Box>
      </div>
    </>
  );
};
