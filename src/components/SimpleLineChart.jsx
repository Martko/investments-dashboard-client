import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { getSourceColor } from "../utils";

export default class Example extends PureComponent {
  render() {
    return (
      <LineChart
        width={1000}
        height={300}
        data={this.props.data}
        margin={{
          top: 15,
          right: 15,
          left: 15,
          bottom: 15
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* {this.props.data.map((entry, index) => (
          <Line
            type="monotone"
            dataKey={entry.name}
            stroke={getSourceColor(entry.name)}
          />
        ))} */}
        <Line
          type="monotone"
          dataKey="mintos"
          stroke={getSourceColor("mintos")}
        />
        <Line
          type="monotone"
          dataKey="omaraha"
          stroke={getSourceColor("omaraha")}
        />
      </LineChart>
    );
  }
}
