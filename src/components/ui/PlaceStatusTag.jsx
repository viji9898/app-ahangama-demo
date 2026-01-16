import React from "react";
import { Tag } from "antd";
import {
  PLACE_STATUS,
  PLACE_STATUS_LABELS,
  PLACE_STATUS_COLORS,
} from "../../data/placeStatus";

export default function PlaceStatusTag({ place, showAll = false }) {
  const status = place?.status || PLACE_STATUS.ACTIVE;

  // Only show status tag if it's not active (unless showAll is true)
  if (!showAll && status === PLACE_STATUS.ACTIVE) {
    return null;
  }

  return (
    <Tag
      color={PLACE_STATUS_COLORS[status]}
      style={{
        fontSize: "11px",
        lineHeight: "16px",
        marginLeft: 4,
      }}
    >
      {PLACE_STATUS_LABELS[status]}
    </Tag>
  );
}
