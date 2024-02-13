import { Fragment } from "react";
import { useParams } from "react-router-dom";
import useKogenFactoryQueryClient from "../../hooks/use-kogen-factory-query-client";
import { useKogenFactoryDeployedOptionsQuery } from "../../codegen/KogenFactory.react-query";
import { Typography } from "@mui/material";

export default function QuoteDenomTable() {
  const client = useKogenFactoryQueryClient();
  const options = useKogenFactoryDeployedOptionsQuery({
    client,
    args: {
      afterDateInSeconds: 0,
    },
    options: {
      suspense: true,
    },
  });

  const { quoteDenom } = useParams();
  return (
    <Fragment>
      <Typography variant="caption">List of options {quoteDenom}</Typography>
      <br />
      <pre>{JSON.stringify(options.data)}</pre>
    </Fragment>
  );
}
