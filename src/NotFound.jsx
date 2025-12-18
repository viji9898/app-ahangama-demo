import React from "react";
import { Result, Button } from "antd";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
    >
      <Result
        status="404"
        title="Not found"
        subTitle="That page doesn’t exist."
        extra={
          <Button type="primary" href="/">
            Go home
          </Button>
        }
      />
    </div>
  );
}
