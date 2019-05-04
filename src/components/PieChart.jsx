import React, { PureComponent } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { getSourceColor, formatCurrency } from "../utils";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = props => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;

  const radius = innerRadius + (outerRadius - innerRadius) * 1.24;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={getSourceColor(name)}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(2)}%`}
    </text>
  );
};

export default class InvestmentsPieChart extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" aspect={4.0 / 3}>
        <PieChart>
          <Pie
            data={this.props.data}
            label={renderCustomizedLabel}
            fill="#8884d8"
            dataKey="value"
          >
            {this.props.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getSourceColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip formatter={value => formatCurrency(value)} />
          {this.props.showLegend ? (
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="circle"
            />
          ) : null}
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
