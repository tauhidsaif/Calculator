document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", function(event) {
        let display = document.querySelector("#display");
        let buttonText = event.target.innerText;

        let lastChar = display.value.slice(-1); // Get last character in display


        if(buttonText === "AC"){
            display.value = "";

        
        }else if (buttonText === "="){

            try{
                let result = eval(display.value.replace(/x/g, "*").replace(/÷/g, "/"));
                display.value = Number.isInteger(result) ? result : parseFloat(result.toFixed(10));

            }
            catch(error){
                display.value = "Error";
            }

        }else if(buttonText === "←"){
                display.value = display.value.slice(0, -1); // Remove last character

        }else{
                // Prevent adding two consecutive operators
                if (["+", "-", "x", "÷", "."].includes(buttonText) && ["+", "-", "x", "÷", "."].includes(lastChar)) {
                    return; // Stop the function from adding another operator
                 }
                
                 display.value += buttonText;
           
        }

    })
})

function giveHapticFeedback() {
    if ("vibrate" in navigator && /Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        navigator.vibrate([10, 30]); // Short pulse with a small delay
    }
}

document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", giveHapticFeedback);
});



document.addEventListener("keydown", function(event) {
    let display = document.querySelector("#display");
    let key = event.key;

    // Mapping keyboard keys to calculator operations
    let keyMap = {
        "*": "x",  // Replace * with x for multiplication
        "/": "÷",  // Replace / with ÷ for division
        "Enter": "=",  // Enter key to evaluate expression
        "Backspace": "←",  // Backspace to delete last character
        "Escape": "AC"  // Escape key to clear display
    };

    let buttonText = keyMap[key] || key; // Convert mapped keys

    // Allow only valid characters OR special keys (AC & Backspace)
    if (/[0-9+\-x÷.=]/.test(buttonText) || buttonText === "AC" || buttonText === "←") {
        event.preventDefault(); // Prevent default actions like form submission
        handleInput(buttonText);
    }
});

function handleInput(buttonText) {
    let display = document.querySelector("#display");
    let lastChar = display.value.slice(-1);

    if (buttonText === "AC") {
        display.value = ""; // Clear the display

    } else if (buttonText === "=") {
        try {
            let result = eval(display.value.replace(/x/g, "*").replace(/÷/g, "/"));
            display.value = Number.isInteger(result) ? result : parseFloat(result.toFixed(5));
        } catch (error) {
            display.value = "Error";
        }

    } else if (buttonText === "←") {
        display.value = display.value.slice(0, -1); // Remove last character

    } else {
        // Prevent consecutive operators
        if (["+", "-", "x", "÷", "."].includes(buttonText) && ["+", "-", "x", "÷", "."].includes(lastChar)) {
            return;
        }

        display.value += buttonText;
    }
}
