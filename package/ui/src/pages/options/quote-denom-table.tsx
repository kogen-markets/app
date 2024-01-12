import { Fragment } from "react";
import { useParams } from "react-router-dom";

export default function QuoteDenomTable() {
  const { quoteDenom } = useParams();
  return <Fragment>List of options {quoteDenom}</Fragment>;
}
