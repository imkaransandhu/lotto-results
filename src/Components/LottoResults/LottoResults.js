import React, { useState, useEffect } from "react";
import "./LottoResult.css";

const LottoResults = () => {
  const [lottoResults, setLottoResults] = useState([]);

  useEffect(() => {
    const fetchLottoResults = async () => {
      const requestOptions = {
        method: "GET",
        mode: "cors", // Specify CORS mode
        headers: {
          "Content-Type": "application/json",
        },
      };
      let lottoNumber = 2372;
      for (let i = 0; i < 20; i++) {
        fetch(
          `https://gateway.mylotto.co.nz/api/results/v1/results/lotto/${lottoNumber}`,
          requestOptions
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("Data:", data);
            setLottoResults((prevState) => [...prevState, data]);
          })
          .catch((error) => console.error(error));
        lottoNumber -= 1;
      }
    };

    fetchLottoResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Last 20 Lotto Results</h1>
      <table>
        <thead>
          <tr>
            <th>Draw Number</th>
            <th>Draw Date</th>
            <th>Draw Time</th>
            <th>Lotto Winning Numbers</th>
            <th>Powerball Winning Number</th>
            <th>Strike Winning Numbers</th>
          </tr>
        </thead>
        <tbody>
          {lottoResults.map((result, index) => (
            <tr key={index}>
              <td>{result.lotto.drawNumber}</td>
              <td>{result.lotto.drawDate}</td>
              <td>{result.lotto.drawTime}</td>
              <td>{result.lotto.lottoWinningNumbers.numbers.join(", ")}</td>
              <td>{result.powerBall.powerballWinningNumber}</td>
              <td>{result.strike.strikeWinningNumbers.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LottoResults;
