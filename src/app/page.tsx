"use client";

import React, { useState, useEffect } from "react";
import { Change, diffChars, diffWords, diffLines } from "diff";

export default function Home() {
  const [diffType, setDiffType] = useState("diffChars");
  const [textA, setTextA] = useState("restaurant");
  const [textB, setTextB] = useState("aura");
  const [diffResult, setDiffResult] = useState<Change[]>([]);

  useEffect(() => {
    computeDiff();
  }, [textA, textB, diffType]);

  const computeDiff = () => {
    let diff: Change[];
    if (diffType === "diffChars") {
      diff = diffChars(textA, textB);
    } else if (diffType === "diffWords") {
      diff = diffWords(textA, textB);
    } else {
      diff = diffLines(textA, textB);
    }

    // Swap logic
    for (let i = 0; i < diff.length; i++) {
      if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
        const swap = diff[i];
        diff[i] = diff[i + 1];
        diff[i + 1] = swap;
      }
    }

    setDiffResult(diff);
  };

  const handleDiffTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiffType(e.target.value);
  };

  return (
    <div>
      <div>
        <label>
          <input
            type="radio"
            value="diffChars"
            checked={diffType === "diffChars"}
            onChange={handleDiffTypeChange}
          />
          Chars
        </label>
        <label>
          <input
            type="radio"
            value="diffWords"
            checked={diffType === "diffWords"}
            onChange={handleDiffTypeChange}
          />
          Words
        </label>
        <label>
          <input
            type="radio"
            value="diffLines"
            checked={diffType === "diffLines"}
            onChange={handleDiffTypeChange}
          />
          Lines
        </label>
      </div>

      <table>
        <tbody>
          <tr>
            <td>
              <textarea
                value={textA}
                onChange={(e) => setTextA(e.target.value)}
                spellCheck="false"
                rows={10}
                cols={30}
              />
            </td>
            <td>
              <textarea
                value={textB}
                onChange={(e) => setTextB(e.target.value)}
                rows={10}
                cols={30}
              />
            </td>
            <td>
              <div>
                <pre id="result">
                  {diffResult.map((part, index) => {
                    if (part.removed) {
                      return <del key={index}>{part.value}</del>;
                    } else if (part.added) {
                      return <ins key={index}>{part.value}</ins>;
                    } else {
                      return <span key={index}>{part.value}</span>;
                    }
                  })}
                </pre>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
