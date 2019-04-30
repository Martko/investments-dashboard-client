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

export default class SimpleLineChart extends PureComponent {
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
        <CartesianGrid
          strokeDasharray="2 2"
          verticalFill={["#f3f3f3"]}
          fillOpacity={0.3}
        />
        <XAxis dataKey={this.props.dataKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {this.props.lineKeys.map((entry, index) => {
          return (
            <Line
              key={index}
              type="monotone"
              dataKey={entry}
              stroke={getSourceColor(entry)}
            />
          );
        })}
      </LineChart>
    );
  }
}
