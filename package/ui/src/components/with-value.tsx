import { Fragment } from "react";

export default function WithValue({
  children,
  value,
}: {
  children?: React.ReactNode;
  value: unknown;
}) {
  if (!value) {
    return <Fragment />;
  } else {
    return <Fragment>{children}</Fragment>;
  }
}
