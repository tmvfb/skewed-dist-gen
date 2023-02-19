const skewPercentage = 0.10;

function randomInteger(min, max) {
    // returns random int in range (0,1000)
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomIntegerSkew(min, max, additionalPercent = skewPercentage) {
    function quantile(P1, n, d) {
        /*
        integrate probability distribution P(n) = P1 + d * n by n
        to get сumulative distribution function:
        F(n) = P1 * n + d * n^2 / 2
        (can get the same result without integration)

        find inverse function for F(n) to get quantile function:
        F(y) = sqrt((2 * y / d) + (P1 / d)^2) - P1 / d
        find the quantile for n by calculating F(n):
         */
        return Math.sqrt((2 * (n) / d) + Math.pow(P1 / d, 2)) - P1 / d;
    }

    const elementsCount = max - min;
    /*
    Using properties of arithmetic progression to determine
    probabilities of first and last elements in distribution.
    sumOfProbabilities = (P1 + PN) / 2 * elementsCount = 100
    PN = P1 * (1 + skewPercentage)
     */
    let P1 = 200 / ((2 + additionalPercent) * elementsCount);
    let PN = (1 + additionalPercent) * P1;
    // d: probability increment. allows to count P(n), where n <= elementsCount:
    let d = ((PN - P1) / elementsCount);
    let n = (Math.random() * (max - min + 1) + min);
    let result = Math.floor(quantile(P1, n, d));
        return result;
}

function randConstantCallback() {
    return function (min, max) {
        return randomInteger(min, max);
    };
}

function randSkewedCallback() {
    return function (min, max) {
        return randomIntegerSkew(min, max);
    };
}

function collectValues(from, to, countSet, randFunc) {
    let count = to - from;
    let labelsForRange = [];
    let dataForRange = {};
    let resultData = [];

    for (let i = from; i <= to; ++i) {
        labelsForRange.push(i);
    }
    for (let i = 0; i < countSet; ++i) {
        let randValue = randFunc(from, to);
        let randValueCountExist = dataForRange[randValue] ? (dataForRange[randValue] + 1) : 1;
        dataForRange[randValue] = randValueCountExist;
    }
    for (let i = from; i <= to; ++i) {
        let randValueCount = dataForRange[i] ? dataForRange[i] : 0;
        resultData.push(randValueCount);
    }
    return {
        labelsForRange,
        resultData
    };
}

var resultConstant = collectValues(0, 1000, 10000000, randConstantCallback());
var resultSkewed = collectValues(0, 1000, 100000000, randSkewedCallback(skewPercentage));
labels = resultConstant.labelsForRange;
dataConstant = resultConstant.resultData;
dataSkewed = resultSkewed.resultData;

var chart = new Chart(document.getElementById("line-chart"), {
    type: "line",
    data: {
        labels: labels,
        datasets: [{
                data: dataConstant,
                label: "Constant",
                borderColor: "#3e95cd",
                fill: false
            }, {
                data: dataSkewed,
                label: "Skewed",
                borderColor: "#cd2410",
                fill: false
            }, {
                data: [0],
                label: "Toggle scale",
                borderColor: "#b98ccd",
                fill: false
            }
        ]
    },
    options: {
        title: {
            display: true,
            text: "Constant and skewed random integer distributions in range from 0 to 1000"
        }
    }
});