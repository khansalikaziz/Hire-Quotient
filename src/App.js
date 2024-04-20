import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [holdings, setHoldings] = useState([]);
  const [expanded, setExpanded] = useState(new Map());

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        "https://canopy-frontend-task.now.sh/api/holdings"
      );
      const dataMap = new Map();
      result.data.payload.forEach(holding => {
        dataMap.set(holding.asset_class, false);
      });
      setExpanded(dataMap);
      setHoldings(result.data.payload);
    };

    fetchData();
  }, []);

  const handleAccordionClick = (assetClass) => {
    const newExpanded = new Map(expanded);
    newExpanded.set(assetClass, !expanded.get(assetClass));
    setExpanded(newExpanded);
  };

  const getFilteredHoldings = (assetClass) => {
    return assetClass === ""
      ? holdings
      : holdings.filter((holding) => holding.asset_class === assetClass);
  };

  return (
    <div style={{ backgroundColor: "#6CA4C8", minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {Object.values(
          holdings.reduce((acc, holding) => {
            if (!acc[holding.asset_class]) {
              acc[holding.asset_class] = [];
            }
            acc[holding.asset_class].push(holding);
            return acc;
          }, {})
        ).map((holdings, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  padding: "10px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() => handleAccordionClick(holdings[0].asset_class)}
              >
                <h3 style={{ margin: 0, fontSize: "16px" }}>
                  {holdings[0].asset_class} ({holdings.length})
                </h3>
                <FontAwesomeIcon
                  icon={expanded.get(holdings[0].asset_class) ? faChevronUp : faChevronDown}
                  style={{
                    color: expanded.get(holdings[0].asset_class) ? "brinjal" : "lightgrey",
                    fontSize: "16px",
                  }}
                />
              </div>
              {expanded.get(holdings[0].asset_class) && (
                <table style={{ width: "100%", fontSize: "14px", marginTop: "10px", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", color: "grey", padding: "8px" }}>Name</th>
                      <th style={{ textAlign: "left", color: "grey", padding: "8px" }}>Ticker</th>
                      <th style={{ textAlign: "left", color: "grey", padding: "8px" }}>Avg. Price</th>
                      <th style={{ textAlign: "left", color: "grey", padding: "8px" }}>Market Price</th>
                      <th style={{ textAlign: "left", color: "grey", padding: "8px" }}>Latest Change %</th>
                      <th style={{ textAlign: "left", color: "grey", padding: "8px" }}>Market Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((holding, index) => (
                      <tr key={holding.id} style={{ backgroundColor: index % 2 === 0 ? "#f0f0f0" : "white" }}>
                        <td style={{ textAlign: "left", padding: "8px" }}>{holding.name}</td>
                        <td style={{ textAlign: "left", padding: "8px" }}>{holding.ticker}</td>
                        <td style={{ textAlign: "left", padding: "8px" }}>{holding.avg_price}</td>
                        <td style={{ textAlign: "left", padding: "8px" }}>{holding.market_price}</td>
                        <td style={{ textAlign: "left", padding: "8px" }}>{holding.latest_chg_pct}</td>
                        <td style={{ textAlign: "left", padding: "8px" }}>{holding.market_value_ccy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
