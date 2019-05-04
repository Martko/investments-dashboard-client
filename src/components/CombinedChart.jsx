import React, { PureComponent } from "react";
import {
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  Legend
} from "recharts";
import { getSourceColor } from "../utils";

export default class CombinedChart extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" aspect={4.0 / 1.34}>
        <ComposedChart
          data={this.props.data}
          margin={{
            top: 0,
            right: 0,
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
          {this.props.barDataKey !== undefined ? (
            <Bar
              dataKey="total"
              barSize={30}
              fill="#cccccc"
              fillOpacity={0.2}
            />
          ) : null}
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
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}
