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
    fundwise: "#f16b4f",
    rent: "#5286ec",
    interests: "#cb4f40",
    loss: "#ED441A",
    net: "#20BD0F",
    estate: "#5286ec",
    crowdestate: "#4983C3",
    LHV1T: "#A1ABB2"
  }[source];
}
