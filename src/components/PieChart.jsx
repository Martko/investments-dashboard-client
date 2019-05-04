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
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${formatCurrency(
          payload[0].value
        )}`}</p>
      </div>
    );
  }

  return null;
};

export default class InvestmentsPieChart extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" aspect={4.0 / 3}>
        <PieChart>
          <Pie
            data={this.props.data}
            labelLine={false}
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
