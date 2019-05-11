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
  Legend,
  Brush
} from "recharts";
import { getSourceColor, formatCurrency } from "../utils";

export default class CombinedChart extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" minHeight={200}>
        <ComposedChart
          data={this.props.data}
          width={500}
          height={400}
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
          <Tooltip formatter={value => formatCurrency(value)} />
          <Legend />
          {this.props.showNavigator ? (
            <Brush dataKey="name" height={25} stroke="#999" />
          ) : null}
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
