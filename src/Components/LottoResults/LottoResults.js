import React, { useState, useEffect } from "react";
import "./LottoResult.css";

const LottoResults = () => {
  const [lottoResults, setLottoResults] = useState([]);
  const [lottoDrawNumber, setLottoDrawNumber] = useState(2372);
  const [totalNumberOfResults, setTotalNumberOfResults] = useState(20);
  const [isError, setIsError] = useState(false);

  const handleLottoDrawNumber = (event) => {
    console.log(event.target.value);
    setLottoDrawNumber(event.target.value);
  };

  const handleTotalNumberOfResultsChange = (event) => {
    setTotalNumberOfResults(event.target.value);
  };
  const handleFetchResult = () => {
    console.log(
      `lotto draw Number: ${lottoDrawNumber} and results total: ${totalNumberOfResults}`
    );
    fetchLottoResults();
  };

  useEffect(() => {
    fetchLottoResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLottoResults = async () => {
    const requestOptions = {
      method: "GET",
      mode: "cors", // Specify CORS mode
      headers: {
        "Content-Type": "application/json",
      },
    };
    let startingLottoNumber = lottoDrawNumber;

    setLottoResults([]);
    for (let i = 0; i < totalNumberOfResults; i++) {
      fetch(
        `https://gateway.mylotto.co.nz/api/results/v1/results/lotto/${startingLottoNumber}`,
        requestOptions
      )
        .then((response) => {
          if (!response.ok) {
            setIsError(true);
          } else {
            setIsError(false);
          }
          return response.json();
        })
        .then((data) => {
          //console.log("Data:", data);
          setLottoResults((prevState) => [...prevState, data]);
        })
        .catch((error) => {
          console.error(error);
        });
      startingLottoNumber -= 1;
    }
    console.log(lottoResults);
  };

  const convertToCSV = (data) => {
    const headers = [
      "Draw Number",
      "Date of the Draw",
      "Time",
      "Lotto Numbers",
      "Bonus",
      "Powerball",
      "Strike",
    ];

    const csvRows = [headers.join(",")];

    data.forEach((result) => {
      const row = [
        result.lotto.drawNumber,
        result.lotto.drawDate, // Format the date
        result.lotto.drawTime,
        result.lotto.lottoWinningNumbers.numbers.join(" | "),
        result.lotto.lottoWinningNumbers.bonusBalls,
        result.powerBall.powerballWinningNumber,
        result.strike.strikeWinningNumbers.join(" | "),
      ];
      csvRows.push(row.join(","));
    });

    return csvRows.join("\n");
  };

  // Function to handle CSV download
  const handleDownload = () => {
    const csvData = convertToCSV(lottoResults);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "lotto_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1 className="heading">Lotto Results</h1>
      <div className="infinite-input-container">
        <div className="input-field-container">
          <label htmlFor="lotto-draw-number" className="input-label">
            Latest Lotto Draw Number
          </label>
          <input
            type="number"
            value={lottoDrawNumber}
            onChange={handleLottoDrawNumber}
            placeholder="Enter Draw Number... like 2372"
            id="lotto-draw-number"
            className="infinite-input-field"
          />
        </div>

        <div className="input-field-container">
          <label htmlFor="total-results" className="input-label">
            Total results to fetch
          </label>
          <input
            type="number"
            value={totalNumberOfResults}
            onChange={handleTotalNumberOfResultsChange}
            placeholder="Enter total results to fetch... like 20"
            id="total-results"
            className="infinite-input-field"
          />
        </div>
        <button
          className="get-result-btn"
          type="button"
          onClick={handleFetchResult}
        >
          Submit
        </button>

        <button
          className="get-result-btn"
          type="button"
          onClick={handleDownload}
        >
          Print/Download
        </button>
      </div>
      {isError ? (
        "Error"
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Draw Number</th>
                <th>Date</th>
                <th>Time</th>
                <th>Lotto Numbers</th>
                <th>Bonus Balls</th>
                <th>Powerball</th>
                <th>Strike</th>
              </tr>
            </thead>
            <tbody>
              {lottoResults.length > 0 ? (
                lottoResults.map((result, index) => (
                  <tr key={index}>
                    <td>{result.lotto.drawNumber}</td>
                    <td>{result.lotto.drawDate}</td>
                    <td>{result.lotto.drawTime}</td>
                    <td>
                      {result.lotto.lottoWinningNumbers.numbers.join(", ")}
                    </td>
                    <td>{result.lotto.lottoWinningNumbers.bonusBalls}</td>
                    <td>{result.powerBall.powerballWinningNumber}</td>
                    <td>{result.strike.strikeWinningNumbers.join(", ")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>{lottoResults.length}</td>
                  <td>loading...</td>
                  <td>loading...</td>
                  <td>loading...</td>
                  <td>loading...</td>
                  <td>loading...</td>
                  <td>loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LottoResults;
