let rawValue = "";

document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", function (event) {
    const buttonText = event.target.innerText;
    handleInput(buttonText);
  });
});

function giveHapticFeedback() {
  if (
    "vibrate" in navigator &&
    /Mobi|Android|iPhone/i.test(navigator.userAgent)
  ) {
    navigator.vibrate([10, 30]); // Short pulse with a small delay
  }
}

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", giveHapticFeedback);
});

document.addEventListener("keydown", function (event) {
  const keyMap = {
    "*": "x",
    "/": "÷",
    Enter: "=",
    Backspace: "←",
    Escape: "AC",
    c: "AC", // added
    C: "AC", // optional, for uppercase C
  };

  let buttonText = keyMap[event.key] || event.key;

  // Allow digits, single-char operators, dot, percent, AC, backspace, and Enter
  if (
    (buttonText.length === 1 && /[0-9+\-x÷.=()%]/.test(buttonText)) ||
    buttonText === "AC" ||
    buttonText === "←" ||
    buttonText === "="
  ) {
    event.preventDefault();
    handleInput(buttonText);
  }
});

function handleInput(buttonText) {
  const display = document.querySelector("#display");
  const operators = ["+", "-", "x", "÷", "%"];
  let lastCharRaw = rawValue.slice(-1);

  // CLEAR
  if (buttonText === "AC") {
    rawValue = "";
    display.value = "";
    return;
  }

  // BACKSPACE
  if (buttonText === "←") {
    rawValue = rawValue.slice(0, -1);
    display.value = formatExpression(rawValue);
    return;
  }

  // EVALUATE
  if (buttonText === "=") {
    try {
      if (!rawValue) return;
      // prepare expression for eval: replace x and ÷ and remove commas
      let evalExpr = rawValue
        .replace(/x/g, "*")
        .replace(/÷/g, "/")
        .replace(/,/g, "");
      let result = eval(evalExpr);
      if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
        // Use up to 10 decimals, strip trailing zeros
        let resultStr = Number.isInteger(result)
          ? String(result)
          : parseFloat(result.toFixed(10)).toString();
        rawValue = resultStr; // keep raw number (no commas) for further operations
        display.value = formatExpression(rawValue);
      } else {
        display.value = "Error";
        rawValue = "";
      }
    } catch (e) {
      display.value = "Error";
      rawValue = "";
    }
    return;
  }

  // PREVENT BAD OPERATOR INSERTIONS
  if (
    (operators.includes(buttonText) || buttonText === ".") &&
    (operators.includes(lastCharRaw) || lastCharRaw === ".")
  ) {
    // Disallow operator right after another operator or dot after dot
    return;
  }

  // Prevent inserting operator as first character except minus (allow negative numbers)
  if (!rawValue && ["+", "x", "÷", "%", "."].includes(buttonText)) return;

  // HANDLE DECIMAL POINT: only one dot in the current number token
  if (buttonText === ".") {
    let lastOpIndex = Math.max(
      rawValue.lastIndexOf("+"),
      rawValue.lastIndexOf("-"),
      rawValue.lastIndexOf("x"),
      rawValue.lastIndexOf("÷"),
      rawValue.lastIndexOf("%")
    );
    let currentNum = rawValue.slice(lastOpIndex + 1);
    if (currentNum.includes(".")) return;
    rawValue += currentNum === "" ? "0." : ".";
  } else if (buttonText === "00") {
    rawValue += "00";
  } else {
    rawValue += buttonText;
  }

  // Update display with formatted numbers but operators preserved
  display.value = formatExpression(rawValue);
}

function formatIndianNumber(numStr) {
  if (numStr === "" || typeof numStr === "undefined" || numStr === null)
    return "";
  let s = String(numStr);
  // handle sign
  let sign = "";
  if (s[0] === "-") {
    sign = "-";
    s = s.slice(1);
  }
  if (s === "") return sign;
  // split integer & decimal part
  let parts = s.split(".");
  let intPart = parts[0];
  let decPart = parts[1] || "";

  if (intPart.length <= 3) {
    return sign + intPart + (decPart ? "." + decPart : "");
  }

  let lastThree = intPart.slice(-3);
  let rest = intPart.slice(0, -3);
  rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return sign + rest + "," + lastThree + (decPart ? "." + decPart : "");
}

function formatExpression(expr) {
  if (!expr) return "";
  // format each numeric token (handles decimals) while leaving operators intact
  return expr.replace(/(\d+(\.\d+)?)/g, function (match) {
    // remove any commas (safety), then format number
    return formatIndianNumber(match.replace(/,/g, ""));
  });
}
