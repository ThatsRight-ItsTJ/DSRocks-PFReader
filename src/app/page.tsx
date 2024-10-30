"use client";

import React, { useState, useEffect } from "react";
import {
  Change,
  createTwoFilesPatch,
  diffChars,
  diffWords,
  diffLines,
} from "diff";

interface ChangeWithChunkHeader extends Change {
  chunkHeader: boolean;
}

export default function Home() {
  const [diffType, setDiffType] = useState("diffChars");
  const [textA, setTextA] = useState("restaurant");
  const [textB, setTextB] = useState("aura");
  const [diffResult, setDiffResult] = useState<ChangeWithChunkHeader[]>([]);

  useEffect(() => {
    computeDiff();
  }, [textA, textB, diffType]);

  const computeDiff = () => {
    let diff: ChangeWithChunkHeader[];
    if (diffType === "diffPatch") {
      let pastHunkHeader = false;
      const patch = createTwoFilesPatch("a.txt", "b.txt", textA, textB)
        .split("\n")
        .map((entry) => {
          const result = {
            value: entry + "\n",
            chunkHeader: false,
            removed: false,
            added: false,
          };
          if (entry.startsWith("@@")) {
            result.chunkHeader = true;
            pastHunkHeader = true;
          } else if (pastHunkHeader) {
            if (entry.startsWith("-")) {
              result.removed = true;
            } else if (entry.startsWith("+")) {
              result.added = true;
            }
          }
          return result;
        });
      diff = patch;
    } else if (diffType === "diffChars") {
      diff = diffChars(textA, textB).map((entry) => {
        return {
          ...entry,
          chunkHeader: false,
        };
      });
    } else if (diffType === "diffWords") {
      diff = diffWords(textA, textB).map((entry) => {
        return {
          ...entry,
          chunkHeader: false,
        };
      });
    } else {
      diff = diffLines(textA, textB).map((entry) => {
        return {
          ...entry,
          chunkHeader: false,
        };
      });
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
      <div id="settings">
        <h1>Diff</h1>
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
        <label>
          <input
            type="radio"
            name="diff_type"
            value="diffPatch"
            checked={diffType === "diffPatch"}
            onChange={handleDiffTypeChange}
          />
          Patch
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
                    } else if (part.chunkHeader) {
                      return (
                        <span key={index} className="chunk-header">
                          {part.value}
                        </span>
                      );
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
