import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
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
      <ResponsiveContainer width="100%" aspect={4.0 / 1.34}>
        <LineChart
          data={this.props.data}
          margin={{
            top: 15,
            right: 15,
            left: 0,
            bottom: 0
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
      </ResponsiveContainer>
    );
  }
}
