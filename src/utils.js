import * as _ from "lodash";

const currency = new Intl.NumberFormat("et-EE", {
  style: "currency",
  currency: "EUR"
});

export const formatCurrency = value => {
  return currency.format(_.round(value, 2));
};

export function getSourceColor(source) {
  return {
    omaraha: "#b72206",
    mintos: "#78c8c7",
    bondora: "#5fade2",
    funderbeam: "#d63d79",
    fundwise: "#f16b4f"
  }[source];
}
